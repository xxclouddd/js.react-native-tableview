//
//  SHMFlatlist.m
//  SHMList
//
//  Created by Mac on 2020/7/21.
//

#import "SHMCollectionView.h"
#import "SHMModuleCell.h"
#import <semaphore.h>
#import <pthread/pthread.h>
#import <React/RCTConvert.h>
#import "SHMCollectionViewUtil.h"

@interface SHMCollectionView ()<UICollectionViewDelegateFlowLayout, UICollectionViewDataSource>

@property (nonatomic, strong) UICollectionView *collectionView;

@end

@implementation SHMCollectionView {
  RCTBridge *_bridge;
  NSMutableSet *_registeredIdentifiers;
  NSMutableArray *_penddingTasks;
  sem_t _updateMutex;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if ((self = [super init]) == nil) return nil;
  _bridge = bridge;
  [self _setup];
  return self;
}

- (void)_setup
{
  sem_init(&_updateMutex, 0, 1);
  _registeredIdentifiers = [[NSMutableSet alloc] init];
  _penddingTasks = [NSMutableArray array];
  _reloadOnTooManyUpdatesThreshold = 100;
  
  self.backgroundColor = [UIColor whiteColor];
  [self addSubview:self.collectionView];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _collectionView.frame = self.bounds;
}

- (void)dealloc
{
  sem_destroy(&_updateMutex);
}

- (void)reloadData
{
  [_collectionView reloadData];
}

#pragma setter
- (void)setAlwaysBounceVertical:(BOOL)alwaysBounceVertical
{
  _alwaysBounceVertical = alwaysBounceVertical;
  _collectionView.alwaysBounceVertical = alwaysBounceVertical;
}

#pragma mark - update collection
- (void)addUpdateTask:(SHMCollectionViewUpdateTask *)task
{
  if (task) {
    [_penddingTasks addObject:task];
  }
  [self flushUpdateTasks];
}

- (void)flushUpdateTasks
{
  __weak __typeof(self) weakSelf = self;
  SHMExecuteOnManagerQueue(^{
    __strong __typeof(weakSelf) strongSelf = weakSelf;
    if (!strongSelf || strongSelf->_penddingTasks.count == 0) {
      return;
    }
    
    sem_wait(&strongSelf->_updateMutex);

    __block BOOL shouldReload = false;
    __block NSUInteger updateCount = 0;
    __block SHMCollectionViewUpdateTask *max = nil;
    __block SHMCollectionViewUpdateTask *min = nil;
    
    [strongSelf->_penddingTasks enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
      SHMCollectionViewUpdateTask *task = obj;
      updateCount += ([task batchUpdateCount]);
      if (!min || task.priority < min.priority) {
        min = task;
      }
      if (!max || task.priority > max.priority) {
        max = task;
      }
      if (task.reload || updateCount > strongSelf.reloadOnTooManyUpdatesThreshold) {
        shouldReload = true;
      }
    }];
    
    SHMCollectionViewUpdateTask *executeTask = shouldReload ? max : min;
    if (shouldReload) {
      [strongSelf->_penddingTasks removeAllObjects];
    } else {
      [strongSelf->_penddingTasks removeObject:executeTask];
    }
    
    [strongSelf performUpdateWithTask:executeTask reload:shouldReload completion:^{
      sem_post(&strongSelf->_updateMutex);
      [strongSelf flushUpdateTasks];
    }];
  });
}

- (void)performUpdateWithTask:(SHMCollectionViewUpdateTask *)task reload:(BOOL)reload completion:(void(^)(void))completion
{
  void(^reloadDataFallback)(void) = ^{
    self.data = task.data;
    [self.collectionView reloadData];
    [self.collectionView layoutIfNeeded];
    if (completion) {
      completion();
    }
  };
    
  void(^executeUpdateBlocks)(void) = ^{
    if ([task batchUpdateCount] == 0) {
      if (completion) {
        completion();
      }
      return;
    }
    self.data = task.data;
    @try {
      UICollectionView *collectionView = self.collectionView;
      [collectionView performBatchUpdates:^{
        if (task.updates.count > 0) {
          [collectionView reloadItemsAtIndexPaths:task.updates];
        }
        if (task.inserts.count > 0) {
          [collectionView insertItemsAtIndexPaths:task.inserts];
        }
        if (task.deletes.count > 0) {
          [collectionView deleteItemsAtIndexPaths:task.deletes];
        }
        for (NSValue *moveVale in task.moves) {
          SHMCollectionViewMove move;
          [moveVale getValue:&move];
          [collectionView moveItemAtIndexPath:move.fromIndexPath toIndexPath:move.toIndexPath];
        }
      } completion:^(BOOL finished) {
        if (completion) {
          completion();
        }
      }];
    } @catch (NSException *exception) {
      NSLog(@"%@", exception);
    }
  };
  
  SHMExecuteOnMainQueue(^{
    if (reload) {
      reloadDataFallback();
    } else {
      executeUpdateBlocks();
    }
  });
}

#pragma mark - collection delegate & datasource
- (SHMModuleCell *)dequeueItemView:(UICollectionView *)collectionView forIndexPath:(NSIndexPath *)indexPath reuseIdentifier:(NSString *)reuseIdentifier;
{
  if (![_registeredIdentifiers containsObject:reuseIdentifier]) {
    NSString *className = [NSString stringWithFormat:@"SHMModuleCell%lu", (unsigned long)_registeredIdentifiers.count];
    Class class = NSClassFromString(className);
    NSAssert(class, @"Overflow the max cell template!");
    [collectionView registerClass:class forCellWithReuseIdentifier:reuseIdentifier];
    [_registeredIdentifiers addObject:reuseIdentifier];
  }
  return [collectionView dequeueReusableCellWithReuseIdentifier:reuseIdentifier forIndexPath:indexPath];
}

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView
{
  return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
  return self.data.count;
}

- (__kindof UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
  NSDictionary *item = _data[indexPath.item];
  NSString *modelName = [RCTConvert NSString:item[SHMReuseIdentifierKey]];
  NSAssert(modelName, @"Expect cell identifier");
  SHMModuleCell *cell = [self dequeueItemView:collectionView forIndexPath:indexPath reuseIdentifier:modelName];
  [cell configWithBridge:_bridge module:modelName props:_data[indexPath.item]];
  return cell;
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
  NSDictionary *item = _data[indexPath.item];
  NSDictionary *size = [RCTConvert NSDictionary:[item valueForKey:SHMSizeKey]];
  CGFloat width = [size valueForKey:@"width"] ? [RCTConvert CGFloat:[size valueForKey:@"width"]] : collectionView.bounds.size.width;
  CGFloat height = [RCTConvert CGFloat:[size valueForKey:@"height"]];
  return CGSizeMake(width, height);
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout minimumLineSpacingForSectionAtIndex:(NSInteger)section
{
  return 0;
}

- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout minimumInteritemSpacingForSectionAtIndex:(NSInteger)section
{
  return 0;
}

- (UICollectionView *)collectionView
{
  if (!_collectionView) {
    UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
    _collectionView = [[UICollectionView alloc] initWithFrame:self.bounds collectionViewLayout:layout];
    _collectionView.dataSource = self;
    _collectionView.delegate = self;
    _collectionView.backgroundColor = [UIColor clearColor];
  }
  return _collectionView;
}

@end
