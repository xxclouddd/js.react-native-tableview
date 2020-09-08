import React, { useEffect, useState, useMemo } from "react";
import { SafeAreaView, View, StatusBar } from "react-native";
import { Provider } from "react-redux";
import { createStore } from "redux";
import FlatList from "./src/FlatList";
import { ThemeContext } from "./ctx";

const e0 = { title: 0 };
const e1 = { title: 1 };
const e2 = { title: 2 };
const e3 = { title: 3 };
const e4 = { title: 4 };
const e5 = { title: 5 };
const e6 = { title: 6 };
const e7 = { title: 7 };
const e8 = { title: 8 };
const e9 = { title: 9 };
const e10 = { title: 10 };
const e11 = { title: 11 };
const e12 = { title: 12 };
const e13 = { title: 13 };
const e14 = { title: 14 };
const e15 = { title: 15 };
const e16 = { title: 16 };
const e17 = { title: 17 };

const reducer = (state = 0, action) => {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    default:
      return state;
  }
};

export const store = createStore(reducer);
const { dispatch } = store;

const rows = [
  { title: "SwitchCell" },
  { title: "TextCell" },
  { title: "ActivityIndicatorCell" },
];
const themes = [
  { theme: "#FFE4C4" },
  { theme: "#CDB79E" },
  { theme: "#8B7D6B" },
  { theme: "#8B795E" },
  { theme: "#9370DB" },
  { theme: "#BA55D3" },
];

setInterval(() => {
  dispatch({ type: "increment" });
}, 1000);

const App: () => React$Node = () => {
  const [theme, setTheme] = useState({ theme: "#FFE4C4" });
  const [ds, setDs] = useState([ e1, e2, e5, e7 ]);

  useEffect(() => {
    setInterval(() => {
      const idx = Math.floor(Math.random() * 10) % 6;
      setTheme(themes[idx]);
    }, 3000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setDs([ e0, e1, e2, e3, e4, e5, e6, e7 ]);
    }, 3000);
  }, []);

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={theme}>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              style={{ flex: 1 }}
              data={ds}
              heightForItemAtIndex={(_, idx) => 100}
              reuseIdentifierForItemAtIndex={(item, idx) => {
                return 'TextCell';
              }}
              keyExtractor={(e) => e.title}
              otherContext={ThemeContext}
            />
          </SafeAreaView>
        </View>
      </ThemeContext.Provider>
    </Provider>
  );
};

export default App;
