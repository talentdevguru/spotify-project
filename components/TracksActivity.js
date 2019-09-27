import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, ListView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios  from 'axios';

class TracksActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isLoading: true,
        };
      }

    static navigationOptions = {
        title: 'Tracks',
        headerStyle: {
            backgroundColor: '#73c6b6',
        }
    };

    handleSpotifyTracks = async () => {

        let auth0Domain = `https://api.spotify.com/v1/playlists/${this.props.navigation.state.params.playlist_id}/` +
                            `tracks?market=${this.props.navigation.state.params.country}`;

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
            dataSource: ds.cloneWithRows(userInfo.data.items),
        });
    };

    componentDidMount() {

        this.handleSpotifyTracks();

    }

    ListViewItemSeparator = () => {
        return (
          <View style={{height: 0.5, width: '100%', backgroundColor: '#080808'}} />
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
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Details',{
                            access_token: this.props.navigation.state.params.access_token,
                            country: this.props.navigation.state.params.country,
                            username: this.props.navigation.state.params.id,
                            email: this.props.navigation.state.params.email,
                            playlist_id: this.props.navigation.state.params.playlist_id,
                            track_id: rowData.track.id,
                        })}>
                            <View style={styles.rowContainer}>
                                <View style={styles.imageContainer}>
                                    <Image style={styles.profileImage} source={{'uri': rowData.track.album.images[2].url}}/>    
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.playlistTitle}>
                                    {rowData.track.name}
                                    </Text>
                                    <Text style={styles.playlistTitle}>
                                    Artist Name: {rowData.track.artists[0].name}
                                    </Text>
                                    <Text style={styles.tracksNumber}>Popularity: {rowData.track.popularity}</Text>
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
        fontSize: 16,
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
});

export default TracksActivity;