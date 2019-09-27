import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, YellowBox } from 'react-native';
import {createStackNavigator} from 'react-navigation';

import LoginActivity from './components/LoginActivity';
import PlaylistsActivity from './components/PlaylistsActivity';
import TracksActivity from './components/TracksActivity';
import DetailsActivity from './components/DetailsActivity';

const RootStack = createStackNavigator(
  {
    LogIn: {screen: LoginActivity},
    Playlists: {screen: PlaylistsActivity},
    Tracks: {screen: TracksActivity},
    Details: {screen: DetailsActivity},
  },
  {
    initialRouteName: 'LogIn',
  }
);

export default class App extends Component {
  render() {
    return <RootStack />;
  }
};