<h2 align="center">React Native TableView</h2>

<p align="center">Native iOS UITableView for React Native</a>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-tableview">
    <img alt="npm version" src="https://img.shields.io/npm/v/react-native-tableview.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/react-native-tableview">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/react-native-tableview.svg?style=flat-square">
  </a>
   <a href="#badge">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  </a>
</p>

## Contents

- [Contents](#contents)
- [Features](#features)
- [Installation](#installation)
  - [Pods](#pods)
- [Examples](#examples)
    - [Register your component.](#register-your-component)
    - [Diff](#diff)

## Features

- Use native iOS TableView
- Display long lists of data with no performance loss
- Support mutable cells
- Wrapper cell with Redux and custom context.
- Diff data source changes to refresh tableview

## Installation

Using npm:

```bash
npm install js.react-native-tableview --save
```

or using yarn:

```bash
yarn add js.react-native-tableview
```

### Pods

```bash
cd ios && pod install && cd ..
```

## Examples

```js
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
```

#### Register your component.

Each cell you render becomes a reuseable root view or `App`.

```js
regisgerCell(store, ThemeContext)(SwitchCell)("SwitchCell");

```

#### Diff

- https://github.com/mcudich/HeckelDiff/blob/master/Source/Diff.swift
- https://gist.github.com/ndarville/3166060
- http://documents.scribd.com/docs/10ro9oowpo1h81pgh1as.pdf

