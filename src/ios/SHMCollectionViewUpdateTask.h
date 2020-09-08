//
//  SHMCollectionViewUpdateTask.h
//  SHMList
//
//  Created by Mac on 2020/8/6.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSUInteger, SHMCollectionViewUpdateType) {
  SHMCollectionViewUpdateTypeUpdateItem = 1,
  SHMCollectionViewUpdateTypeDeleteItem = 2,
  SHMCollectionViewUpdateTypeInsertItem = 3,
  SHMCollectionViewUpdateTypeMoveItem   = 4
};

typedef struct {
  NSIndexPath *fromIndexPath;
  NSIndexPath *toIndexPath;
} SHMCollectionViewMove;

@interface SHMCollectionViewUpdateTask : NSObject

@property (nonatomic, strong, readonly) NSArray *data;

@property (nonatomic, assign, readonly) BOOL reload;
@property (nonatomic, assign, readonly) NSUInteger priority;

@property (nonatomic, strong, readonly) NSArray<NSIndexPath *> *updates;
@property (nonatomic, strong, readonly) NSArray<NSIndexPath *> *deletes;
@property (nonatomic, strong, readonly) NSArray<NSIndexPath *> *inserts;
@property (nonatomic, strong, readonly) NSArray *moves; // NSValue<SHMCollectionViewMove>

- (NSUInteger)batchUpdateCount;

- (instancetype)initWithData:(NSArray *)data reload:(BOOL)reload priority:(NSUInteger)priority;
- (instancetype)initWithData:(NSArray *)data updates:(NSDictionary *)updates priority:(NSUInteger)priority;

@end

@interface NSIndexPath (SHMCollectionView)

+ (NSIndexPath *)shm_indexPath:(id)json;
+ (NSArray<NSIndexPath *> *)shm_indexPathArray:(id)json;

@end


NS_ASSUME_NONNULL_END
