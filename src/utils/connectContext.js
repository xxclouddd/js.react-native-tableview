import React, { useMemo, useEffect, useState } from "react";
import ContextDispatcher from "./ContextDispatcher";
import { instanceIdentityKey } from "./propertyOffset";

export default function connectContext(context, defaultValue = undefined) {
  if (!context || !context.Provider) {
    throw new Error("expect context!");
  }
  const contextName = context?.contextName;
  if (!contextName) {
    throw new Error("Expect contextName");
  }

  return function wrapWithConnect(WrappedComponent) {
    return function ConnectFunction(props) {
      const pageID = props[instanceIdentityKey];
      if (!pageID) {
        console.warn("VirtualizedList HOC!");
      }

      const contextValue = ContextDispatcher.getContextValue(
        pageID,
        contextName
      );
      const [value, setValue] = useState(contextValue || defaultValue);

      useEffect(() => {
        const removeListener =
          pageID && contextName
            ? ContextDispatcher.addListener(pageID, contextName, setValue)
            : null;
        return () => {
          if (removeListener) {
            removeListener();
          }
        };
      }, [pageID, contextName, setValue]);

      const renderedWrappedComponent = useMemo(() => {
        return (
          <context.Provider value={value}>
            <WrappedComponent {...props} />
          </context.Provider>
        );
      }, [props, WrappedComponent, value]);

      return renderedWrappedComponent;
    };
  };
}
