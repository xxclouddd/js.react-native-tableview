import React, { useMemo } from "react";
import { Provider } from "react-redux";

export default function connectRedux(store) {
  if (!store) {
    throw new Error("expect store!");
  }
  return function wrapWithConnect(WrappedComponent) {
    return function ConnectFunction(props) {
      const renderedWrappedComponent = useMemo(() => {
        return (
          <Provider store={store}>
            <WrappedComponent {...props} />
          </Provider>
        );
      }, [props, WrappedComponent, store]);

      return renderedWrappedComponent;
    };
  };
}
