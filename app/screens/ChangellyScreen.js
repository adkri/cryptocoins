import React, { Component } from 'react';
import { WebView, Share } from 'react-native';
import { Icon, Button } from 'native-base';


export default class ChangellyScreen extends Component{
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.name,
        headerRight: 
        <Button 
            onPress={()=> {
                Share.share({
                    message: 'Go to this link to buy/sell coins: https://changelly.com/?ref_id=942d9536137b',
                    url: 'https://changelly.com/?ref_id=942d9536137b',
                    title: 'Cryptocurrency buy and sell link'
                    }, {
                    // Android only:
                    dialogTitle: 'Share buy/sell link',
                    // iOS only:
                    excludedActivityTypes: [
                        'com.apple.UIKit.activity.PostToTwitter'
                    ]
                })
            }} 
            transparent textStyle={{color: '#000'}}><Icon name="md-share-alt" /></Button> 
    });

    render() {
        return (
            <WebView
                source={{uri: `https://changelly.com/?ref_id=942d9536137b`}}
                style={{marginTop: 0}}
                />
        );  
    }
}    