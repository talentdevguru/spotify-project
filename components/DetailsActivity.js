import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, ListView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios  from 'axios';

class DetailsActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailsInfo: null,
            isLoading: true,
        };
      }

    static navigationOptions = {
        title: 'Details',
        headerStyle: {
            backgroundColor: '#73c6b6',
        }
    };

    handleSpotifyDetails = async () => {

        let auth0Domain = `https://api.spotify.com/v1/tracks/${this.props.navigation.state.params.track_id}/` +
                            `?market=${this.props.navigation.state.params.country}`;

        const userInfo = await axios.get(auth0Domain,
            {
              headers: {
                "Authorization": `Bearer ${this.props.navigation.state.params.access_token}`
              }
            });
        
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.setState({
            isLoading: false,
            detailsInfo: userInfo.data,
        });
    };

    componentDidMount() {

        this.handleSpotifyDetails();

    }

    render() {
        if (this.state.isLoading) {
            return (
              <View style={{flex: 1, paddingTop: 20}}>
                <ActivityIndicator />
              </View>
            );
          } else {
            return (
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.profileImage} source={{'uri': this.state.detailsInfo.album.images[1].url}}/>    
                    </View>
                    <Text style={styles.headerText}>{this.state.detailsInfo.name}</Text>
                    <Text style={styles.headerText}>Artist Name: {this.state.detailsInfo.artists[0].name}</Text>
                    <Text style={styles.headerText}>Album Name: {this.state.detailsInfo.album.name}</Text>
                    <Text style={styles.headerText}>Durations: {this.state.detailsInfo.duration_ms}ms</Text>
                </View>
            );
          }
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff',
    },
    headerText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    imageContainer: {
        marginLeft: 0,
        alignItems: 'center',
    },
    profileImage: {
        height:150,
        width: 150,
        borderRadius: 0
      },
});

export default DetailsActivity;