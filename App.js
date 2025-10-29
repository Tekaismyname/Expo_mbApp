import React, { Component } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Main from "./components/MainComponent";
// redux
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/ConfigureStore';
const store = ConfigureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

export default App;
