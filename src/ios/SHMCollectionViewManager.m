//
//  SHMFlatlistManager.m
//  SHMList
//
//  Created by Mac on 2020/7/21.
//

#import "SHMCollectionViewManager.h"
#import "SHMCollectionView.h"
#import <React/RCTUIManager.h>
#import "SHMCollectionViewUpdateTask.h"

@implementation SHMCollectionViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(alwaysBounceVertical, BOOL);
RCT_EXPORT_VIEW_PROPERTY(reloadOnTooManyUpdatesThreshold, NSInteger);

- (UIView *)view
{
  return [[SHMCollectionView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_METHOD(performUpdate:(nonnull NSNumber *)viewTag
                  data:(NSArray *)data
                  updates:(NSDictionary *)updates
                  priority:(nonnull NSNumber *)priority)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, id> *viewRegistry)
  {
    SHMCollectionViewUpdateTask *task = [[SHMCollectionViewUpdateTask alloc] initWithData:data updates:updates priority:(NSUInteger)priority.unsignedIntegerValue];
    SHMCollectionView *view = viewRegistry[viewTag];
    [view addUpdateTask:task];
  }];
}

RCT_EXPORT_METHOD(reloadData:(nonnull NSNumber *)viewTag
                  data:(NSArray *)data
                  priority:(nonnull NSNumber *)priority)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, id> *viewRegistry)
  {
    SHMCollectionViewUpdateTask *task = [[SHMCollectionViewUpdateTask alloc] initWithData:data reload:YES priority:priority.unsignedIntegerValue];
    SHMCollectionView *view = viewRegistry[viewTag];
    [view addUpdateTask:task];
  }];
}

@end
