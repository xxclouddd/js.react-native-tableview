//
//  SHMCollectionViewUpdateTask.m
//  SHMList
//
//  Created by Mac on 2020/8/6.
//

#import "SHMCollectionViewUpdateTask.h"
#import <React/RCTConvert.h>

@implementation SHMCollectionViewUpdateTask

- (instancetype)initWithData:(NSArray *)data reload:(BOOL)reload priority:(NSUInteger)priority
{
  self = [super init];
  if (self) {
    _data = data;
    _reload = reload;
    _priority = priority;
  }
  return self;
}

- (instancetype)initWithData:(NSArray *)data updates:(NSDictionary *)updates priority:(NSUInteger)priority
{
  self = [super init];
  if (self) {
    _data = data;
    _reload = false;
    _priority = priority;
    [self transformUpdates:updates];
  }
  return self;
}

- (void)transformUpdates:(NSDictionary *)aUpdates
{
  NSDictionary *dict = aUpdates ? [RCTConvert NSDictionary:aUpdates] : nil;
  _updates = [NSIndexPath shm_indexPathArray:dict[@"updates"]];
  _deletes = [NSIndexPath shm_indexPathArray:dict[@"deletes"]];
  _inserts = [NSIndexPath shm_indexPathArray:dict[@"inserts"]];

  NSArray *moves = [RCTConvert NSDictionaryArray:dict[@"moves"]];
  _moves = [NSMutableArray arrayWithCapacity:moves.count];
  [moves enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
    NSIndexPath *from = [NSIndexPath shm_indexPath:obj[@"from"]];
    NSIndexPath *to = [NSIndexPath shm_indexPath:obj[@"to"]];
    SHMCollectionViewMove move = {.fromIndexPath = from, .toIndexPath = to};
    [(NSMutableArray *)_moves addObject:[NSValue valueWithBytes:&move objCType:@encode(SHMCollectionViewMove)]];
  }];
}

- (NSUInteger)batchUpdateCount
{
  return self.updates.count +
  self.deletes.count +
  self.inserts.count +
  self.moves.count;
}

@end

@implementation NSIndexPath (SHMCollectionView)

+ (NSIndexPath *)shm_indexPath:(id)json
{
  if ([json isKindOfClass:[NSNumber class]]) {
    return [NSIndexPath indexPathForItem:[json unsignedIntegerValue] inSection:0];
  } else if ([json isKindOfClass:[NSDictionary class]]) {
    NSUInteger section = json[@"section"] ? [RCTConvert NSUInteger:json[@"section"]] : 0;
    NSUInteger item = json[@"item"] ? [RCTConvert NSUInteger:json[@"item"]] : 0;
    return [NSIndexPath indexPathForItem:item inSection:section];
  } else {
    return nil;;
  }
}

+ (NSArray<NSIndexPath *> *)shm_indexPathArray:(id)json
{
  NSArray *array = json ? [RCTConvert NSArray:json] : nil;
  NSMutableArray *pool = [NSMutableArray arrayWithCapacity:array.count];
  [array enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
    NSIndexPath *indexPath = [NSIndexPath shm_indexPath:obj];
    if (indexPath) {
      [pool addObject:indexPath];
    }
  }];
  return pool;
}

@end

