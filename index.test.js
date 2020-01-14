import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Tester, TestHookStore } from 'cavy';
import LoginSpecs from './specs/login.specs.js';
import NewOrder from './specs/newOrder.specs.js';

import App from './src/App';

const testHookStore = new TestHookStore();

class AppWrapper extends Component {
  render() {
    return (
      <Tester specs={[LoginSpecs, NewOrder]} store={testHookStore}>
        <App/>
      </Tester>
    );
  }
}

AppRegistry.registerComponent('bitmex_trading', () => AppWrapper);