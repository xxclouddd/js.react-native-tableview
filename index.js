/**
 * @format
 */

import React from "react";
import { AppRegistry } from "react-native";
import App, { store } from "./App";
import { name as appName } from "./app.json";
import { ActivityIndicatorCell, SwitchCell, TextCell } from "./Cells";
import { ThemeContext as iThemeContext } from "./ctx";
import regisgerCell, {
  regisgerCellWithConnects,
  pipe,
} from "./src/utils/regisgerCell";

const ThemeContext = {
  context: iThemeContext,
  defaultValue: { theme: "black" },
};

AppRegistry.registerComponent(appName, () => App);

regisgerCell(store, ThemeContext)(TextCell)("TextCell");
regisgerCell(store, ThemeContext)(SwitchCell)("SwitchCell");
regisgerCell(store, ThemeContext)(ActivityIndicatorCell)("ActivityIndicatorCell");
