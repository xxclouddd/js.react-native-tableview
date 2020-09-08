//
//  SHMDefine.h
//  SHMList
//
//  Created by Mac on 2020/8/6.
//

#import <Foundation/Foundation.h>

#if defined(__cplusplus)
#define SHM_EXTERN extern "C" __attribute__((visibility("default")))
#define SHM_EXTERN_C_BEGIN extern "C" {
#define SHM_EXTERN_C_END }
#else
#define SHM_EXTERN extern __attribute__((visibility("default")))
#define SHM_EXTERN_C_BEGIN
#define SHM_EXTERN_C_END
#endif
