import React, { useEffect, FunctionComponent, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Switch,
} from "react-native";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { ThemeContext } from "./ctx";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CCFFFF",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleStyle: {
    color: "white",
    fontSize: 80,
    textAlign: "center",
  },
  sepStyle: {
    position: "absolute",
    height: 5,
    left: 0,
    width: "100%",
    bottom: 0,
    backgroundColor: "white",
  },
});

export const ActivityIndicatorCell = (data) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <View style={styles.sepStyle} />
    </View>
  );
};

export const SwitchCell: FunctionComponent = (data) => {
  const [open, setOpen] = useState(true);
  const onValueChange = (value) => {
    setOpen(value);
  };
  return (
    <View style={styles.container}>
      <Switch value={open} onValueChange={onValueChange} />
      <View style={styles.sepStyle} />
    </View>
  );
};

export const TextCell = (data) => {
  const count = useSelector((s) => s);
  const theme = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme.theme }]}>
      <Text style={styles.titleStyle}>{`${count}`}</Text>
      <View style={styles.sepStyle} />
    </View>
  );
};

export default {};
