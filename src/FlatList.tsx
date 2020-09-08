import React, { Context } from "react";
import VirtualizedList, {
  ViewSize,
  IndexPath,
  OptionalProps as VirtualizedListOptionalProps,
} from "./VirtualizedList";
import { Props as NativeListProps } from "./NativeList";
import connectHOC from "./utils/connectHOC";

export type ListContext<C> = Context<C> & { contextName: string };

type RequiredProps<T, K> = {
  data: T[];
  keyExtractor: (item: T) => K;
  heightForItemAtIndex: (item: T, idx: number) => number;
  reuseIdentifierForItemAtIndex: (item: T, idx: number) => string;
};

type OptionProps<C> = {
  otherContext?: ListContext<C>;
};

interface Props<T, K, C>
  extends NativeListProps,
    VirtualizedListOptionalProps<T>,
    RequiredProps<T, K>,
    OptionProps<C> {}

class FlatList<T, K, C> extends React.PureComponent<Props<T, K, C>, void> {
  props: Props<T, K, C>;

  constructor(props: Props<T, K, C>) {
    super(props);
    this._toggleVirtualizedListWithContext();
  }

  listClass: any;

  _toggleVirtualizedListWithContext = () => {
    const { otherContext } = this.props;
    this.listClass = otherContext
      ? connectHOC(otherContext)(VirtualizedList)
      : VirtualizedList;
  };

  _sizeForItemAtIndex = (item: T, idx: number): ViewSize => {
    const { heightForItemAtIndex } = this.props;
    const height = heightForItemAtIndex(item, idx);
    return { height };
  };

  _reuseIdentifierForItemAtIndexPath = (item: T, indexPath: IndexPath) => {
    const { reuseIdentifierForItemAtIndex } = this.props;
    const reuseIdentifier = reuseIdentifierForItemAtIndex(item, indexPath.item);
    if (!reuseIdentifier) {
      throw new Error("reuseIdentifierForItemAtIndexPath' should return value");
    }
    return reuseIdentifier;
  };

  _numberOfSections = () => {
    return 1;
  }

  render() {
    const ListClass = this.listClass;
    const {
      heightForItemAtIndex,
      reuseIdentifierForItemAtIndex,
      ...resProps
    } = this.props;
    return (
      <ListClass
        {...resProps}
        sizeForItemAtIndexPath={this._sizeForItemAtIndex}
        reuseIdentifierForItemAtIndexPath={
          this._reuseIdentifierForItemAtIndexPath
        }
        numberOfSections={this._numberOfSections}
      ></ListClass>
    );
  }
}

export default FlatList;
