import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Icon, Left, Right, Button, Title, Body, Spinner } from 'native-base';

import {
    AdMobBanner
} from 'react-native-admob'

class GlobalScreen extends Component {
    static navigationOptions = {
        drawerLabel: 'Global',
        drawerIcon: <Icon ios='md-globe' android="md-globe" style={{fontSize: 20, color: 'black'}}/>,
        header: null
    };

    state = {
        coinInfo : {},
        loading: true,
        currency: 'USD'
    }

    componentDidMount = async () => {
        fetch('https://api.coinmarketcap.com/v1/global/')
            .then(resp => resp.json())
            .then(data =>  this.setState({coinInfo: data, loading: false}));
    }

    render() {
        return(
        <Container>
            <Header backgroundColor='#1E90FF' androidStatusBarColor="#2c3e50">
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
                    <Title>Global Market</Title>
                </Body>
                <Right>
                    {/* <Button transparent>
                    <Icon name='arrow-back' />
                    </Button> */}
                </Right>
            </Header>
            <Content>
                {(!this.state.loading) 
                    ? <Card>
                        <CardItem>
                            <Left>
                                <Text style={styles.listTitle}>Total Market Cap</Text>
                            </Left>
                            <Right>
                            <Text>{this.state.coinInfo.total_market_cap_usd} {this.state.currency}</Text>
                            </Right>
                        </CardItem>      
                        <CardItem>
                            <Left>
                                <Text style={styles.listTitle}>Total 24h Volume</Text>
                            </Left>
                            <Right>
                                <Text>{this.state.coinInfo.total_24h_volume_usd} {this.state.currency}</Text>                            
                            </Right>
                        </CardItem>      
                        <CardItem>
                            <Left>
                                <Text style={styles.listTitle}>Bitcoin Percentage of Market</Text>
                            </Left>
                            <Right>
                                <Text>{this.state.coinInfo.bitcoin_percentage_of_market_cap} {this.state.currency}</Text>                                                    
                            </Right>
                        </CardItem>      
                        <CardItem>
                            <Left>
                                <Text style={styles.listTitle}>Active Currencies</Text>
                            </Left>
                            <Right>
                                <Text>{this.state.coinInfo.active_currencies} {this.state.currency}</Text>                                                    
                            </Right>
                        </CardItem>      
                        <CardItem>
                            <Left>
                                <Text style={styles.listTitle}>Active Assets</Text>
                            </Left>
                            <Right>
                                <Text>{this.state.coinInfo.active_assets} {this.state.currency}</Text>                                                    
                            </Right>
                        </CardItem>      
                        <CardItem>
                            <Left>
                                <Text style={styles.listTitle}>Active Markets</Text>
                            </Left>
                            <Right>
                                <Text>{this.state.coinInfo.active_markets} {this.state.currency}</Text>                                                    
                            </Right>
                        </CardItem>      
                        <CardItem>
                            <Left>
                                <Text style={styles.listTitle}>Updated Time</Text>
                            </Left>
                            <Right>
                                <Text>{new Date(this.state.coinInfo.last_updated * 1000).toDateString()}</Text>                                                    
                            </Right>
                        </CardItem>
                        {/* <CardItem>
                            <Left>
                            </Left>
                            <Right>
                                <Text style={styles.listTitle}>Powered by CMC</Text>                                                    
                            </Right>
                        </CardItem>       */}
                    </Card>
                    : <Spinner color='blue' />
                }
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
        'color': 'dodgerblue'
    }
});
export default GlobalScreen;