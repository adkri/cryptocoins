import React, { Component } from 'react';
import { View, WebView, Image, StyleSheet } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Right, Body } from 'native-base';


import {
  AdMobBanner
} from 'react-native-admob'

class DetailsScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.name
  });

  state = {
    coin: this.props.navigation.state.params.coin,
    currency: this.props.navigation.state.params.currency
  }

  componentWillMount() {
    console.log(this.state.coin)
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

  render() {
    // const {state} = this.props.navigation;
    return(
      <Container>
      <Content>
        <Card style={{flex: 0}}>
          <CardItem>
            <Left>
              <Thumbnail source={{uri: this.state.coin.symbol}} />
              <Body>
                <Text style={{ fontWeight:'bold', fontSize: 20}}>{this.state.coin.name} ({this.state.coin.symbol})</Text>
                <Text note>Last updated: {new Date(this.state.coin.last_updated * 1000).toDateString()}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Left></Left>
            <Body></Body>
              <Button textStyle={{color: '#87838B'}} onPress={() => this.props.navigation.navigate('Changelly', {name: "Buy/Sell at Changelly"})}>
                <Icon name="md-cart" />
                <Text>Buy/Sell</Text>
              </Button>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={styles.listTitle}>Rank</Text>
            </Left>
            <Body>
              <Text>
                {this.state.coin.rank}       
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={styles.listTitle}>24h Volume</Text>
            </Left>
            <Body>
              <Text>
                {this.convertNumeral(this.state.coin['24h_volume'])} {this.state.currency}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={styles.listTitle}>Market Cap</Text>
            </Left>
            <Body>
              <Text>
                {this.convertNumeral(this.state.coin['market_cap'])} {this.state.currency}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={styles.listTitle}>Available Supply</Text>
            </Left>
            <Body>
              <Text>
                {this.state.coin['available_supply']} {this.state.coin.symbol}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={styles.listTitle}>Total Supply</Text>
            </Left>
            <Body>
              <Text>
                {this.state.coin['total_supply']} {this.state.coin.symbol}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={styles.listTitle}>1h change(%)</Text>
            </Left>
            <Body>
              <Text>
                {this.state.coin['percent_change_1h']}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={styles.listTitle}>2h change(%)</Text>
            </Left>
            <Body>
              <Text>
                {this.state.coin['percent_change_24h']}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={styles.listTitle}>7d change(%)</Text>
            </Left>
            <Body>
              <Text>
                {this.state.coin['percent_change_7d']}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent textStyle={{color: '#87838B'}}>
                <Icon name="md-cash"/>
                <Text>{this.state.coin.price} {this.state.currency}</Text>
              </Button>
            </Left>
            <Right>
            <Button transparent textStyle={{color: '#87838B'}} onPress={() => this.props.navigation.navigate('Web', {name: this.state.coin.name, id: this.state.coin.id})}>
                <Icon name="md-analytics" />
                <Text>SEE CHARTS</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>
      </Content>
      <AdMobBanner
          adSize="banner"
          adUnitID="ca-app-pub-3491676180184189/4904678290"
          onAdFailedToLoad={error => console.error(error)}
        />
    </Container>
    )
  }
}

const styles = StyleSheet.create({
  listTitle: {
    'fontWeight': 'bold'
  }
})
export default DetailsScreen