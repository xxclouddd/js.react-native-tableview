import React, { ReactElement } from "react";
import NativeList, { Props as NativeListProps } from "./NativeList";
import { diff } from "./diff/listDiff";
import {
  sizeKey,
  instanceIdentityKey,
  reuseIdentifierKey,
} from "./utils/propertyOffset";

export type ViewSize = { width?: number; height: number };
export type IndexPath = { section: number; item: number };

type DefaultProps = {
  alwaysBounceVertical: boolean;
  reloadOnTooManyUpdatesThreshold: number;
};

type RequiredProps<T, K> = {
  data: T[];
  keyExtractor: (item: T) => K;
  sizeForItemAtIndexPath: (item: T, indexPath: IndexPath) => ViewSize;
  reuseIdentifierForItemAtIndexPath: (item: T, indexPath: IndexPath) => string;
  numberOfSections: () => number;
};

type PrivateProps = {
  instanceIdentity?: string;
};

export type OptionalProps<T> = {
  itemEqual?: (oldItem: T, newItem: T) => boolean;
  alwaysBounceVertical?: boolean;
  reloadOnTooManyUpdatesThreshold?: number;
};

export interface Props<T, K>
  extends NativeListProps,
    PrivateProps,
    OptionalProps<T>,
    RequiredProps<T, K> {}

class VitualizedList<T, K> extends React.PureComponent<Props<T, K>> {
  props: Props<T, K>;

  static defaultProps: DefaultProps = {
    alwaysBounceVertical: true,
    reloadOnTooManyUpdatesThreshold: 100,
  };

  constructor(props: Props<T, K>) {
    super(props);
  }

  _listRef: any = null;
  _itemInfoByKey: Map<K, any> = new Map();

  _captureRef = (ref) => {
    this._listRef = ref;
  };

  _reloadData = () => {
    const {
      data,
      keyExtractor,
      reuseIdentifierForItemAtIndexPath,
      sizeForItemAtIndexPath,
      instanceIdentity,
    } = this.props;

    // clear cache
    this._itemInfoByKey.clear();

    const remapData = data.map((item, idx) => {
      const size = sizeForItemAtIndexPath(item, { section: 0, item: idx });
      const reuseIdentifier = reuseIdentifierForItemAtIndexPath(item, {
        section: 0,
        item: idx,
      });

      if (!reuseIdentifier) {
        throw new Error(
          "Reload Data: 'reuseIdentifierForItemAtIndexPath' should return value!"
        );
      }

      const key = keyExtractor(item);
      const itemInfo = {
        ...item,
        [sizeKey]: size,
        [reuseIdentifierKey]: reuseIdentifier,
        [instanceIdentityKey]: instanceIdentity,
      };
      this._itemInfoByKey.set(key, itemInfo);
      return itemInfo;
    });
    if (!this._listRef || !this._listRef.reloadData) {
      console.warn("expect implement reloadData method");
      return;
    }

    this._listRef.reloadData(remapData);
  };

  _performUpdate = (oldData: T[]) => {
    const {
      data,
      keyExtractor,
      itemEqual,
      reuseIdentifierForItemAtIndexPath,
      sizeForItemAtIndexPath,
      instanceIdentity,
    } = this.props;

    const ret = diff(oldData, data, keyExtractor, itemEqual);
    const { updates, moves, inserts } = ret;

    // update cell size and cell reuseIdentifier.
    const moveTos = moves.map((e) => e.to);
    const upToFresh = updates.concat(inserts).concat(moveTos);

    upToFresh.forEach((i) => {
      const item = data[i];
      const key = keyExtractor(item);
      const size = sizeForItemAtIndexPath(item, { section: 0, item: i });
      const reuseIdentifier = reuseIdentifierForItemAtIndexPath(item, {
        section: 0,
        item: i,
      });

      if (!reuseIdentifier) {
        throw new Error(
          "Perform Data: 'reuseIdentifierForItemAtIndexPath' should return value!"
        );
      }

      const itemInfo = {
        ...item,
        [sizeKey]: size,
        [reuseIdentifierKey]: reuseIdentifier,
        [instanceIdentityKey]: instanceIdentity,
      };
      this._itemInfoByKey.set(key, itemInfo);
    });

    // remap item
    const itemInfoByKey: Map<K, any> = new Map();

    const remapData = data.map((item, idx) => {
      const key = keyExtractor(item);
      let itemInfo = this._itemInfoByKey.get(key);
      if (!itemInfo) {
        const size = sizeForItemAtIndexPath(item, { section: 0, item: idx });
        const reuseIdentifier = reuseIdentifierForItemAtIndexPath(item, {
          section: 0,
          item: idx,
        });

        if (!reuseIdentifier) {
          throw new Error(
            "Perform Data: 'reuseIdentifierForItemAtIndexPath' should return value!"
          );
        }

        itemInfo = {
          ...item,
          [sizeKey]: size,
          [reuseIdentifierKey]: reuseIdentifier,
          [instanceIdentityKey]: instanceIdentity,
        };
      }
      itemInfoByKey.set(key, itemInfo);
      return itemInfo;
    });

    this._itemInfoByKey = itemInfoByKey;

    if (!this._listRef || !this._listRef.performUpdate) {
      console.warn("expect implement performUpdate method");
      return;
    }
    this._listRef.performUpdate(remapData, ret);
  };

  componentDidMount() {
    this._reloadData();
  }

  componentDidUpdate(prevProps: Props<T, K>) {
    if (this.props.data !== prevProps.data) {
      this._performUpdate(prevProps.data);
    }
  }

  render() {
    const { data, ...rest } = this.props;
    return <NativeList ref={this._captureRef} {...rest}></NativeList>;
  }
}

export default VitualizedList;
