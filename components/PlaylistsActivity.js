import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, ListView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios  from 'axios';

class PlaylistsActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isLoading: true,
        };
      }

    static navigationOptions = {
        title: 'Playlists',
        headerLeft: null,
        headerStyle: {
            backgroundColor: '#73c6b6',
        }
    };

    handleSpotifyPlaylists = async () => {

        let auth0Domain = `https://api.spotify.com/v1/browse/featured-playlists?country=${this.props.navigation.state.params.country}`;

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
            dataSource: ds.cloneWithRows(userInfo.data.playlists.items),
        });
    };

    componentDidMount() {

        this.handleSpotifyPlaylists();

    }

    ListViewItemSeparator = () => {
        return (
          <View style={{height: 0.5, width: '100%', backgroundColor: '#080808'}} />
        );
    };

    ListViewHeader = () => {
        return (
            <View style={styles.headerContainer}>
                  <Text style={styles.headerTitle}>Playlists</Text>
            </View>  
          );
    };

    ListViewFooter = () => {
        return (
          <View style={styles.footerContainer}>
              <TouchableOpacity style={styles.moreButton} onPress={()=>console.log('load more')}>
                <Text style={styles.moreText}>Load More</Text>
              </TouchableOpacity>
          </View>  
        );
    };

    render() {
        if (this.state.isLoading) {
            return (
              <View style={{flex: 1, paddingTop: 20}}>
                <ActivityIndicator />
              </View>
            );
          } else {
            return (
                <View style={styles.MainContainer}>
                    <ListView 
                        dataSource={this.state.dataSource}
                        renderSeparator={this.ListViewItemSeparator}
                        renderRow={rowData =>(
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Tracks',{
                            access_token: this.props.navigation.state.params.access_token,
                            country: this.props.navigation.state.params.country,
                            username: this.props.navigation.state.params.id,
                            email: this.props.navigation.state.params.email,
                            playlist_id: rowData.id,
                        })}>
                            <View style={styles.rowContainer}>
                                <View style={styles.imageContainer}>
                                    <Image style={styles.profileImage} source={{'uri': rowData.images[0].url}}/>    
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.playlistTitle}>
                                    {rowData.name}
                                    </Text>
                                    <Text style={styles.tracksNumber}>Number of Tracks: {rowData.tracks.total}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        )}
                        renderFooter={this.ListViewFooter}
                    />
                </View>
            );
          }
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5fcff',
    },
    headerText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
    },
    profileImage: {
      height:64,
      width: 64,
      borderRadius: 32
    },
    rowContainer: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
    },
    imageContainer: {
        marginLeft: 12,
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    playlistTitle: {
        marginLeft: 12,
        fontSize: 20,
        fontWeight: 'bold',
    },
    tracksNumber: {
        marginLeft: 12,
        fontSize: 16,
    },
    footerContainer: {
        flex: 1,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreButton: {
        borderColor: '#8e8e8e',
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    moreText: {
        color: '#8e8e8e',
    },
    headerContainer: {
        flex: 1,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#73c6b6',
    },
    headerTitle: {
        paddingTop: 16,
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default PlaylistsActivity;