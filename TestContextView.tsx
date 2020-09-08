import React, { useEffect, FunctionComponent, useState, useContext, useCallback } from 'react';
import { View } from "react-native";
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import connect from 'react-redux/lib/connect/connect';
import { useStore } from 'react-redux';

const TestContextView: FunctionComponent = (data)=> {
    // const ctx = useContext();
  const count = useSelector((s) => s);
  // console.warn('count >>> :', count);
  // const store = useStore();
  // const state = useEffect(() => state.getState(), [store]);

  const reduxStore = useStore();
  const getReduxState = useCallback(() => {
    const ret = reduxStore.getState();
    console.warn('ret:', ret);
  }, [reduxStore]);

  // console.warn('getReduxState:', getReduxState());

  useEffect(() => {
    // console.warn('state:', reduxStore, Date.now);
  }, [reduxStore]);
    
  return (
    <View style={{width: '100%', height: 50, backgroundColor: 'blue'}}>
    </View>
  );
}

export default connect()(TestContextView);