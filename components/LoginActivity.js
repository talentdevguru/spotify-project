import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Button, ActivityIndicator} from 'react-native';
import { AuthSession } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import axios  from 'axios';

const CLIENT_ID = '64e428f744df484dac76ad699f626833';

class LoginActivity extends React.Component {
    static navigationOptions = {
        title: 'LogIn',
        headerStyle: {
            backgroundColor: '#03a9f4',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    state = {
        userInfo: null,
        didError: false,
        isLoading: true,
    };

    handleSpotifyLogin = async () => {
        let redirectUrl = AuthSession.getRedirectUrl();
        let auth0Domain = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}` +
                          `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
                          `&scope=user-read-private&response_type=token`;
        let results = await AuthSession.startAsync({
          authUrl: auth0Domain
        });
    
        if (results.type !== 'success') {
          this.setState({didError: true});
        } else {
          
          const userInfo = await axios.get(`https://api.spotify.com/v1/me`,
          {
            headers: {
              "Authorization": `Bearer ${results.params.access_token}`
            }
          });
          this.setState({userInfo: userInfo.data});      

          this.props.navigation.navigate("Playlists", {
              access_token: results.params.access_token,
              country: this.state.userInfo.country,
              username: this.state.userInfo.id,
              email: this.state.userInfo.email,
          });
        }
    
    };

    displayError = () => {
        return (
          <View style={styles.userInfo}>
            <Text style={styles.errorText}>
              There was an error, Please try again.
            </Text>
          </View>
        );
    }

    displayResults = () => {
        {return this.state.userInfo ? (
          <View style={styles.userInfo}>
            {/* <Image style={styles.profileImage} source={ {'uri': this.state.userInfo.images[0].url} }/> */}
            <View>
              <Text style={styles.userInfoText}>
                Username:
              </Text>
              <Text style={styles.userInfoText}>
                {this.state.userInfo.id}
              </Text>
              <Text style={styles.userInfoText}>
                Email:
              </Text>
              <Text style={styles.userInfoText}>
                {this.state.userInfo.email}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>
              Login to Spotify to request data.
            </Text>
          </View>
        )}
    }

    render() {
        return (
            <View style={styles.container}>
              <FontAwesome name="spotify" color="#2FD566" size={128}/>
              <TouchableOpacity style={styles.button} onPress={this.handleSpotifyLogin} disabled={this.state.userInfo ? true : false}>
                <Text style={styles.buttonText}>
                  Login with Spotify
                </Text>
              </TouchableOpacity>
              {this.state.didError ? this.displayError() : this.displayResults()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      backgroundColor: '#fff',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    button: {
      backgroundColor: '#2FD566',
      padding: 20
    },
    buttonText: {
      color: '#000',
      fontSize: 20,
    },
    userInfo: {
      height: 250,
      width: 200,
      alignItems: 'center',
    },
    userInfoText: {
      color: '#000',
      fontSize: 18,
      textAlign: 'center',
    },
    errorText: {
      color: '#000',
      fontSize: 18
    },
    profileImage: {
      height:64,
      width: 64,
      marginBottom: 32
    }
});

export default LoginActivity;