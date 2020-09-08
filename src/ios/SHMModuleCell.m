//
//  SHMModuleCell.m
//  SHMList
//
//  Created by Mac on 2020/7/22.
//

#import "SHMModuleCell.h"
#import <React/RCTRootView.h>

@interface SHMModuleCell ()

@property (nonatomic, strong) RCTRootView *reactView;

@end

@implementation SHMModuleCell {
  RCTBridge *_bridge;
  NSString *_module;
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  if (_reactView) {
    _reactView.frame = self.bounds;
  }
}

- (void)configWithBridge:(RCTBridge *)bridge module:(NSString *)module props:(NSDictionary *)props
{
  _bridge = bridge;
  _module = module;
    
  if (_reactView == nil) {
    _reactView = [[RCTRootView alloc] initWithBridge:bridge moduleName:module initialProperties:props];
    _reactView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self.contentView addSubview:_reactView];
    return;
  }
  _reactView.appProperties = props;
}

- (void)prepareForReuse
{
  [super prepareForReuse];
  // todo: clear node state
}

@end

SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell0)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell1)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell2)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell3)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell4)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell5)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell6)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell7)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell8)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell9)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell10)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell11)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell12)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell13)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell14)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell15)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell16)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell17)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell18)
SHM_CREATE_MODULE_CELL_IMP(SHMModuleCell19)
