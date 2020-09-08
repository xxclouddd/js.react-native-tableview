import React from 'react';
import {ViewProps, requireNativeComponent, Platform} from 'react-native';
import ListResponder from './utils/listResponder';

let ScrollViewClass;
if (Platform.OS === 'ios') {
  ScrollViewClass = requireNativeComponent('SHMCollectionView');
}
if (!ScrollViewClass) {
  console.warn('ScrollViewClass must not be undefined');
}

type IOSProps = {};
type AndroidProps = {};

export interface Props 
  extends ViewProps,
  IOSProps,
  AndroidProps 
{
    horizontal?: boolean;
    alwaysBounceVertical?: boolean;
    reloadOnTooManyUpdatesThreshold?: number;
}

function createScrollResponder(
    node: React.ElementRef<typeof VitualizedList>,
): typeof ListResponder.Mixin {
    const scrollResponder = {...ListResponder.Mixin};
    for (const key in scrollResponder) {
      if (typeof scrollResponder[key] === 'function') {
        scrollResponder[key] = scrollResponder[key].bind(node);
      }
    }
    return scrollResponder;
}

class VitualizedList extends React.Component<Props> {
    props: Props;

    _scrollResponder: typeof ListResponder.Mixin = createScrollResponder(this);

    _scrollViewRef: any = null;

    _updateCount = 0;

    reloadData = (data) => {
      this._updateCount ++;
      this._scrollResponder.scrollResponderReloadData(data, this._updateCount);
    }

    performUpdate = (data, diff) => {
      this._updateCount ++;
      this._scrollResponder.scrollResponderUpdateData(data, diff, this._updateCount);
    }

    getNativeScrollRef = () => {
      return this._scrollViewRef;
    };

    _setNativeRef = ref => {
        this._scrollViewRef = ref;
    };

    render() {
      return (
        <ScrollViewClass 
          ref={this._setNativeRef} 
          {...this.props}
        >
        </ScrollViewClass>
      );
    }
}

export default VitualizedList;

