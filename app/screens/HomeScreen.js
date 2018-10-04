// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });

import React, { Component } from 'react';
import { AppState, View, StyleSheet, Image, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { Root, Container, ActionSheet, Header, Left, Body, Right, Button, Icon, Title,
        Content, Card, CardItem, Text, Spinner, Picker } from 'native-base';
import { StackNavigator } from 'react-navigation';
import DetailsScreen from './DetailsScreen';
import WebScreen from './WebScreen';
import ChangellyScreen from './ChangellyScreen';
const Item = Picker.Item;

import {
  AdMobBanner
} from 'react-native-admob'
       
        
var BUTTONS = ["Show Info", "Cancel"];
// var DESTRUCTIVE_INDEX = 1;
var CANCEL_INDEX = 1;
const {height, width} = Dimensions.get('window');
const currencies = ["USD","AUD", "BRL", "CAD", "CHF", "CLP", "CNY", "CZK", "DKK", "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PKR", "PLN", "RUB", "SEK", "SGD", "THB", "TRY", "TWD", "ZAR"];

class HomeScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: <Icon ios='md-home' android="md-home" style={{fontSize: 20, color: 'black'}}/>,
    header: null
  };

  state= {
    
    coins: [],
    coinOfDay: {},
    selectedCurrency: 'USD',
    isRefreshing: false,
    appState: AppState.currentState,
    last_updated: new Date()
  }

  componentDidMount = async () => {
    AppState.addEventListener('change', this._handleAppStateChange);
    this._onRefresh();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // console.log('App has come to the foreground!')
      if(this.hasbeenFiveMinutes(this.state.last_updated)) {
        this.setState({isRefreshing: true})
        this._onRefresh();
      }
    }
    this.setState({appState: nextAppState});
  }

  hasbeenFiveMinutes = (date1) => {
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = new Date().getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    //take out milliseconds
    difference_ms = difference_ms/1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms/60; 
    var minutes = Math.floor(difference_ms % 60);

    if(minutes > 5) {
      return true;
    }
    return false;
  }

  _onRefresh = async () => {
    let coins= [];
    let coinOfDay = {};
    try {
      let coins = await this.getCoins();
      coins = await coins.map(coin => {
        let currency = this.state.selectedCurrency.toLowerCase();
        let price_key = 'price_' + currency;
        let market_cap_key = 'market_cap_' + currency;
        let volume_key = '24h_volume_' + currency;
        coin['price'] = this.toFixedTrunc(coin[price_key], 2);
        coin['market_cap'] = Number(coin[market_cap_key]).toPrecision(3);
        coin['24h_volume'] = Number(coin[volume_key]).toPrecision(3);
        return coin;
      })
      let coin_percent_change = await coins.map(coin=> Number(coin.percent_change_24h));
      coinOfDay = coins[coin_percent_change.indexOf(Math.max.apply(Math,coin_percent_change))];
      // console.log(coins);
      this.setState({coins});
      this.setState({coinOfDay});
      this.setState({last_updated: new Date()});
    } catch (e) {
      
    }
  }

  onCurrencyChange = async (value) => {
    await this.setState({selectedCurrency: value});
    this._onRefresh();
  }

  getCoins = () => {
    const url = 'https://api.coinmarketcap.com/v1/ticker/?limit=50&convert=' + this.state.selectedCurrency;
    // console.log(url);
    return fetch(url)
      .then(resp => resp.json())
      .catch(err => alert("Failed to connect. Try again later."))
  }

  convertNumeral = (number) => {
    // Nine Zeroes for Billions
    return Math.abs(Number(number)) >= 1.0e+9
      ? Math.abs(Number(number)) / 1.0e+9 + " B"
        // Six Zeroes for Millions 
      : Math.abs(Number(number)) >= 1.0e+6
      ? Math.abs(Number(number)) / 1.0e+6 + " M"
      // Three Zeroes for Thousands
      : Math.abs(Number(number)) >= 1.0e+3
      ? Math.abs(Number(number)) / 1.0e+3 + " K"
      : Math.abs(Number(number));
  }

  toFixedTrunc = (value, n) => {
    const v = value.toString().split('.');
    if (n <= 0) return v[0];
    let f = v[1] || '';
    if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
    while (f.length < n) f += '0';
    return `${v[0]}.${f}`
  }

  getCoinCard = () => {
    let coinCards = [];
    this.state.coins.map(coin => {
      coinCards.push(<View key={coin.id}>
      <Card style={{ marginBottom:10, marginTop: 10}}>
      <CardItem style={{ paddingTop:0, paddingLeft:0, paddingRight:0, paddingBottom: 0}}>
        <Body style={{ flex:1, flexDirection:'row', alignItems:'center'}}>
        <View style={{ width:30, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <Text style={styles.coinRank}>{coin.rank}</Text>
        </View>
        <View style={{ flex: 10, flexDirection:'column',borderLeftWidth:2,borderLeftColor:'#f9f9f9'}}>
          <View style={{ flex:1, flexDirection:'row', justifyContent:'space-between'}}>
            <TouchableOpacity  
              style={{ flex: 1, flexDirection: 'column', paddingTop: 5}}
              onPress={()=> this.props.navigation.navigate('Details', {name: coin.name, coin: coin, currency: this.state.selectedCurrency})}>
              <View style={{flex:1,flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                <Image 
                  style={styles.coinImage}
                  source={{uri: coin.symbol}}
                  ></Image>
                <Text style={styles.tokenName}>{"   "}{coin.symbol}</Text>
              </View> 
              <View style={{ flex:1, flexDirection:'row', justifyContent:'center'}}>
                <Text style={styles.coinName}>{coin.name}</Text>
              </View>
            </TouchableOpacity >
            <View style={{ flex: 2 }}>
              <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                <Text style={styles.coinRate}>1 {coin.symbol} = {coin.price} {this.state.selectedCurrency}</Text>
                <Text style={styles.coinMarketCap}>Market Cap: {this.convertNumeral(coin.market_cap)}</Text>
              </View>
            </View>
          </View>
          <View style={{height:10}}></View>
          <View style={styles.coinChanges}>
            <View style={{ flex: 5,  flexDirection: 'row', justifyContent:'space-around'}}>
              <Text style={styles.coin1h}>
                {coin.percent_change_1h > 0 ? "+": ""}{coin.percent_change_1h} | 1h
              </Text>
              <Text style={coin.percent_change_24h > 0 ? styles.coinIncrease: styles.coinDecrease}>
                {coin.percent_change_24h > 0 ? "+": ""}{coin.percent_change_24h} | 24h
              </Text>
              <Text style={coin.percent_change_7d > 0 ? styles.coinIncrease: styles.coinDecrease}>
                {coin.percent_change_7d > 0 ? "+": ""}{coin.percent_change_7d} | 7d
              </Text>                
            </View>
            <View style={{ flex: 1,  flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity 
              style={{flex:1, justifyContent:'center', alignItems:'center'}}
                onPress={() =>
                  ActionSheet.show(
                  {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    // destructiveButtonIndex: DESTRUCTIVE_INDEX,
                    title: coin.name
                  },
                  buttonIndex => {
                    if(buttonIndex == 0) {
                      this.props.navigation.navigate('Details', {name: coin.name, coin: coin, currency: this.state.selectedCurrency});
                    }
                    // this.setState({ clicked: BUTTONS[buttonIndex] });
                  }
                )}>
                <Icon ios='ios-more' android="ios-more" style={{fontSize: 35, color: 'black'}}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </Body>
      </CardItem>
    </Card>
      <View style={{backgroundColor:'#e9e9e9', height:2}}></View>
    </View>)
    })
    return coinCards;
  }

  render() {
    return (
      <Root>
      <Container >
        <Header backgroundColor='#4912D4'>
          <Left>
            <Button 
                onPress={() => {
                    this.props.navigation.navigate('DrawerOpen');
                }}
                transparent>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Cryptocoins</Title>
          </Body>
          <Right>
            {/* <Button transparent>
              <Icon name='arrow-back' />
            </Button> */}
          </Right>
        </Header>
        {
          (this.state.coins.length == 0 )
          ?  <Content>
              <Spinner color='blue' />
            </Content>
          :
          <Content 
          style={{backgroundColor:'#f9f9f9'}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#0000ff"
              colors={['#ff0000', '#0000ff']}
              progressBackgroundColor="#ffffff"
            />
          }
        >
        <View style={styles.imageHeader}> 
          <Image
            style={{width: '100%', height: 200}}
            source={{uri: 'blockchain'}}
          />
          <View style={styles.backdropView}>
              <Text style={{fontSize: 20, color: 'white', fontWeight:'bold',marginBottom:10}}>Coin of The Day</Text>
              <Image
                style={{width: 64, height: 64, paddingTop:10, paddingBottom: 10}}
                source={{uri: this.state.coinOfDay.symbol}}
                />
              <Text style={{fontSize: 20, color: 'white',fontWeight:'bold'}}>({this.state.coinOfDay.symbol})</Text>
              <Text style={(this.state.coinOfDay.percent_change_24h > 0)? styles.coinOfDayIncrease: styles.coinOfDayDecrease}>
                {(this.state.coinOfDay.percent_change_24h > 0) ? "+": ""}{this.state.coinOfDay.percent_change_24h} %
              </Text>
              <Text style={{fontSize: 20, color: 'white',fontWeight:'bold'}}>{this.state.coinOfDay.price} {this.state.selectedCurrency}</Text>
          </View>
        </View>
        <View style={{flex:1, flexDirection: 'row', justifyContent:'flex-end'}}>
          <View style={{width:100, height: 40, marginTop: -10}}>
            <Picker
                  mode="dropdown"
                  placeholder={this.state.selectedCurrency}
                  selectedValue={this.state.selectedCurrency}
                  onValueChange={this.onCurrencyChange.bind(this)}
                >
                {currencies.map(currency => <Item key={currency} label={currency} value={currency} />)}
              </Picker>
            </View>
          </View>
        <View>
        {
          this.getCoinCard()
        }
        </View>
        </Content>
        }
        <AdMobBanner
          adSize="banner"
          adUnitID="ca-app-pub-3491676180184189/4904678290"
          onAdFailedToLoad={error => console.error(error)}
          />
      </Container>
      </Root>
    );
  }
} 

const styles = StyleSheet.create({
  coinRank : {
    'fontWeight': 'bold',
    'fontSize' : 20,
    // 'left': 0

  },
  coinName: {
    'fontWeight': 'bold',
    'fontSize' : 18,
  // 'left': 20,
  // 'top': 0

  },
  coinImage : {
    'width':30,
    'height': 30  
  },
  tokenName: {
    'fontWeight': '700'
  },
  coinRate : {
    'backgroundColor' : '#50A0EF',
    'color':'white',
    'fontWeight': '700',
    'padding' : 5
    // 'position': 'absolute',
    // 'top': 0,
    // 'right': 0 
  },
  coinMarketCap : {
    'backgroundColor' : '#6C6A6E',
    'color':'white',
    'fontWeight': '600',
    'fontSize': 14,
    'padding' : 5,
    // 'position': 'absolute',
    // 'top': 30,
    // 'right': 0
  },
  coin1h : {
    'backgroundColor' : '#FE9D49',
    'color':'white',
    'fontWeight': '600',
    'fontSize': 15,
    'padding' : 5
  },
  coinIncrease : {
    'backgroundColor' : '#6DEE87',
    'color':'white',
    'fontWeight': '600',
    'fontSize': 15,
    'padding' : 5
  },
  coinDecrease : {
    'backgroundColor' : '#FE4949',
    'color':'white',
    'fontWeight': '600',
    'fontSize': 15,
    'padding' : 5
  },
  coinChanges: {
    'flex': 1,
    'flexDirection': 'row'
  },
  imageHeader: {
    'width': '100%',
    'height': 200
  },
  backdropView: {
    'backgroundColor' : 'rgba(255,255,255,0.2)',
    'width': '100%',
    'height': 200,
    'position': 'absolute',
    'top': 0,
    'flex': 1,
    'flexDirection': 'column',
    'justifyContent': 'center',
    'alignItems': 'center',
  },
  coinOfDayIncrease: {
    'fontSize': 20, 
    'color': '#6DEE87',
    'fontWeight':'bold'
  },
  coinOfDayDecrease: {
    'fontSize': 20, 
    'color': '#FE4949',
    'fontWeight':'bold'
  },
  

})


const ModalStack = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Details : {
    screen: DetailsScreen,
  },
  Web: {
    screen: WebScreen
  },
  Changelly: {
    screen: ChangellyScreen
  }
});

export default ModalStack;