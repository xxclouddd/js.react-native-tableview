import { AppRegistry } from "react-native";
import connectRedux from "./connectRedux";
import connectContext from "./connectContext";

const RegisterSet = new Set();

export const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
export const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

export const regisgerCellWithConnects = (...connects) => (cell) => (
  reuseIdentifier
) => {
  if (!cell) {
    throw new Error("Expect cell!");
  }
  if (!reuseIdentifier) {
    throw new Error("Expect reuseIdentifier!");
  }
  if (RegisterSet.has(reuseIdentifier)) {
    console.warn(`${reuseIdentifier} has been registerted`);
    return;
  }
  RegisterSet.add(reuseIdentifier);
  const wrapperCell = pipe(...connects)(cell);
  AppRegistry.registerComponent(reuseIdentifier, () => wrapperCell);
};

const regisgerCell = (store = undefined, ...contexts) => (cell) => (
  reuseIdentifier
) => {
  const toggleRedux = store ? connectRedux(store) : null;
  const connects = [];
  if (toggleRedux) {
    connects.push(toggleRedux);
  }

  contexts.forEach((ctx) => {
    const { context, defaultValue } = ctx;
    const contextName = context?.contextName;
    if (!contextName) {
      throw new Error("Expect contextName!");
    }
    if (context && context.Provider) {
      toggleCtx = connectContext(context, defaultValue);
      connects.push(toggleCtx);
    }
  });
  regisgerCellWithConnects(...connects)(cell)(reuseIdentifier);
};

export default regisgerCell;
