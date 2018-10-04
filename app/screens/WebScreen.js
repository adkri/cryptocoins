import React, { Component } from 'react';
import { WebView } from 'react-native';


export default class WebScreen extends Component{
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.name
    });
    
    render() {
        return (
            <WebView
                source={{uri: `https://coinmarketcap.com/currencies/${this.props.navigation.state.params.id}/`}}
                style={{marginTop: 0}}
                />
        );  
    }
}    