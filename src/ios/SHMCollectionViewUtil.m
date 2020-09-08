//
//  SHMCollectionViewUtil.m
//  SHMList
//
//  Created by Mac on 2020/8/6.
//

#import "SHMCollectionViewUtil.h"

NSString * const SHMSizeKey = @"shm_hijack_size";
NSString * const SHMReuseIdentifierKey = @"shm_hijack_reuseIdentifier";
NSString * const SHMInstanceIdentityKey = @"shm_hijack_instanceIdentity";

char *const SHMManagerQueneName = "com.shihuimiao.collection.view";

dispatch_queue_t SHMGetManagerQueue(void)
{
  static dispatch_queue_t queue;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    queue = dispatch_queue_create(SHMManagerQueneName, DISPATCH_QUEUE_SERIAL);
  });
  return queue;
}

bool SHMIsManagerQueue()
{
  static void *queueKey = &queueKey;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    dispatch_queue_set_specific(SHMGetManagerQueue(), queueKey, queueKey, NULL);
  });
  return dispatch_get_specific(queueKey) == queueKey;
}

BOOL SHMIsMainQueue()
{
  static void *mainQueueKey = &mainQueueKey;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    dispatch_queue_set_specific(dispatch_get_main_queue(), mainQueueKey, mainQueueKey, NULL);
  });
  return dispatch_get_specific(mainQueueKey) == mainQueueKey;
}

void SHMExecuteOnManagerQueue(dispatch_block_t block)
{
  if (SHMIsManagerQueue()) {
    block();
  } else {
    dispatch_async(SHMGetManagerQueue(), ^{
      block();
    });
  }
}

void SHMExecuteOnMainQueue(dispatch_block_t block)
{
  if (SHMIsMainQueue()) {
    block();
  } else {
    dispatch_async(dispatch_get_main_queue(), ^{
      block();
    });
  }
}

void SHMExecuteOnMainQueueDelay(dispatch_block_t block, NSTimeInterval delay)
{
  if (delay) {
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      block();
    });
  } else {
    SHMExecuteOnMainQueue(block);
  }
}
