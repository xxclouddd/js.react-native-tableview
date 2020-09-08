//
//  SHMFlatlist.h
//  SHMList
//
//  Created by Mac on 2020/7/21.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTView.h>
#import "SHMCollectionViewUpdateTask.h"

NS_ASSUME_NONNULL_BEGIN
           
@interface SHMCollectionView : RCTView

@property (nonatomic, strong) NSArray *data;
@property (nonatomic, assign) BOOL alwaysBounceVertical;
@property (nonatomic, assign) NSInteger reloadOnTooManyUpdatesThreshold;

- (instancetype)initWithBridge:(RCTBridge *)bridge;

- (void)addUpdateTask:(SHMCollectionViewUpdateTask *)task;


@end

NS_ASSUME_NONNULL_END
