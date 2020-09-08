//
//  SHMCollectionViewUtil.h
//  SHMList
//
//  Created by Mac on 2020/8/6.
//

#import <Foundation/Foundation.h>
#import "SHMDefine.h"

SHM_EXTERN NSString * const SHMSizeKey;
SHM_EXTERN NSString * const SHMReuseIdentifierKey;
SHM_EXTERN NSString * const SHMInstanceIdentityKey;

SHM_EXTERN dispatch_queue_t SHMGetManagerQueue(void);
SHM_EXTERN void SHMExecuteOnManagerQueue(dispatch_block_t block);

SHM_EXTERN void SHMExecuteOnMainQueue(dispatch_block_t block);
SHM_EXTERN void SHMExecuteOnMainQueueDelay(dispatch_block_t block, NSTimeInterval delay);
