import React, { Component } from "react";
import { StyleSheet, Image, Button, ScrollView } from 'react-native';

import { DrawerItems, DrawerNavigator } from "react-navigation";
import SplashScreen from 'react-native-splash-screen'

import HomeScreen from "./screens/HomeScreen.js";
// import SideBar from "./components/SideBar.js";
import GlobalScreen from './screens/GlobalScreen';

const CustomDrawerContentComponent = (props) => (
  <View style={{ flex: 1}}>
    <View style={{ backgroundColor: '#232323', height: 155, justifyContent:'center', paddingLeft: 15}}>
      <Text style={{ color:'#fff', fontSize: 22}}>CryptoCoins</Text>
    </View>
    <DrawerItems {...props} />
  </View>
);

class App extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return(<Drawer/>)
  }
}

const Drawer = DrawerNavigator({
  Home: {
    screen: HomeScreen
  },
  Global: {
    screen: GlobalScreen
  }
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent:'center',
        alignItems: 'center'
    },

    icon: {
      width: 24,
      height: 24,
    },
})

export default App
