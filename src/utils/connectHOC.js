import React, {
  useContext,
  useMemo,
  useEffect,
  useRef,
} from "react";
import ContextDispatcher from "./ContextDispatcher";

function useIsomorphicLayoutEffectWithArgs(
  effectFunc,
  effectArgs,
  dependencies
) {
  useEffect(() => effectFunc(...effectArgs), dependencies);
}

export default function connectHOC(context) {
  if (!context || !context.Provider) {
    throw new Error("Expect context!");
  }

  const contextName = context?.contextName;
  if (!contextName) {
    throw new Error("Expect context with property 'contextName'!");
  }

  return function wrapWithConnect(WrappedComponent) {
    return function ConnectFunction(props) {
      const contextValue = useContext(context);
      const instanceRef = useRef(
        props?.instanceIdentity || String(Date.now() + Math.random() * 10000)
      );

      useIsomorphicLayoutEffectWithArgs(
        ContextDispatcher.notify,
        [instanceRef.current, contextName, contextValue],
        [contextValue, contextName]
      );

      const overridenChildProps = useMemo(() => {
        return { ...props, instanceIdentity: instanceRef.current };
      }, [props]);

      const renderedWrappedComponent = useMemo(
        () => <WrappedComponent {...overridenChildProps} />,
        [overridenChildProps, WrappedComponent]
      );

      return renderedWrappedComponent;
    };
  };
}
