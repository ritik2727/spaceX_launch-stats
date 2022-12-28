import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  StatusBar,
  Pressable,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useQuery, gql} from '@apollo/client';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const dayjs = require('dayjs');

const GET_LAUNCHES = gql`
  query {
    launchesPast(limit: 10) {
      id
      mission_name
      details
      launch_date_local
      launch_site {
        site_name_long
      }
      links {
        article_link
        video_link
        flickr_images
      }
      rocket {
        first_stage {
          cores {
            flight
          }
        }
        rocket_name
        second_stage {
          block
          payloads {
            id
            payload_type
          }
        }
      }
      ships {
        id
      }
    }
  }
`;

const SpaceXLaunchList = () => {
  const {loading, error, data} = useQuery(GET_LAUNCHES, {
    notifyOnNetworkStatusChange: true,
  });

  const [expandedCardID, setExpandedCardID] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const handleShowDetails = id => {
    setExpandedCardID(id);
  };

  useEffect(() => {
    console.log('testing api');
  }, [data, error, loading]);

  if (loading) {
    return (
      <View>
        <Text style={{color: 'white', textAlign: 'center', top: '80%'}}>
          Loading...
        </Text>
      </View>
    );
  }
  if (error) return <Text>Error : {error.message}</Text>;
  return (
    <>
      <StatusBar backgroundColor="#FFFEFE" barStyle="dark-content" />

      <View style={styles.mainpage}>
        <View style={styles.headerwrapper}>
          <View style={styles.headsection}>
            <View style={styles.logosection}>
              <Text style={styles.logotext}>
                <Image
                  style={{
                    width: 168,
                    resizeMode: 'contain',
                    height: 40,
                    margin: 10,
                  }}
                  source={require('../assets/spacexLogo.png')}
                />
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={styles.shortwarpper}>
            <FlatList
              data={data.launchesPast}
              renderItem={({item}) => (
                <>
                  <View style={styles.outliner}>
                    <View style={styles.postinformation}>
                      <View style={{flexDirection: 'column'}}>
                        <Text
                          style={{
                            color: '#EEEEEE',
                            fontWeight: 'bold',
                            marginTop: 15,
                            fontSize: 20,
                            // width: wp(40),
                            marginLeft: 10,
                            marginRight: 10,
                          }}>
                          {item.mission_name}
                        </Text>
                        <Text
                          style={{
                            color: '#929292',
                            fontSize: 14,
                            marginLeft: 10,
                            marginRight: 10,
                          }}>
                          {' '}
                          {dayjs(item.launch_date_local).format('DD MMM YYYY')}
                        </Text>

                        <View
                          style={{
                            borderTopWidth: 1,
                            borderColor: '#E5E5E5',
                            width: '100%',
                            margin: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: wp(80),
                          }}></View>

                        <View style={{minHeight: 60, marginTop: 20}}>
                          <Text
                            numberOfLines={
                              expandedCardID === item.id && showDetails ? 0 : 2
                            }
                            style={{
                              color: '#929292',
                              textAlign: 'justify',
                              margin: 0,
                            }}>
                            <Text
                              style={{
                                margin: 0,
                                color: 'white',
                                fontWeight: '700',
                              }}>
                              Description:{' '}
                            </Text>
                            {item.details ? item.details : 'No description'}
                          </Text>
                        </View>
                        {expandedCardID === item.id && showDetails ? (
                          <View style={{marginVertical: 20}}>
                            <View
                              style={{flexDirection: 'row', marginBottom: 10}}>
                              <Text style={{color: 'white', width: '30%'}}>
                                Mission:
                              </Text>
                              <Text style={{color: '#B9B9B9', width: '60%'}}>
                                {item.mission_name}
                              </Text>
                            </View>
                            <View
                              style={{flexDirection: 'row', marginBottom: 10}}>
                              <Text style={{color: 'white', width: '30%'}}>
                                Rocket:
                              </Text>
                              <Text style={{color: '#B9B9B9'}}>
                                {item.rocket.rocket_name}
                              </Text>
                            </View>
                            <View
                              style={{flexDirection: 'row', marginBottom: 10}}>
                              <Text style={{color: 'white', width: '30%'}}>
                                Payloads:
                              </Text>
                              <Text style={{color: '#B9B9B9'}}>
                                {
                                  item.rocket.second_stage.payloads[0]
                                    .payload_type
                                }
                              </Text>
                            </View>
                            <View
                              style={{flexDirection: 'row', marginBottom: 10}}>
                              <Text style={{color: 'white', width: '30%'}}>
                                Ships:
                              </Text>
                              <Text style={{color: '#B9B9B9', maxWidth: '60%'}}>
                                {item.ships.length > 0
                                  ? item.ships.map((ship, index, ships) => {
                                      return (
                                        ship.id +
                                        (index != ships.length - 1 ? ', ' : '')
                                      );
                                    })
                                  : 'No Ships'}
                              </Text>
                            </View>
                            <View
                              style={{flexDirection: 'row', marginBottom: 10}}>
                              <Text style={{color: 'white', width: '30%'}}>
                                Launch Site:
                              </Text>
                              <Text style={{color: '#B9B9B9', width: '60%'}}>
                                {item.launch_site.site_name_long}
                              </Text>
                            </View>

                            <View style={{marginVertical: 10}}>
                              <Text style={{color: 'white'}}>
                                Launch Images:
                              </Text>
                              <ScrollView
                                contentContainerStyle={{marginVertical: 10}}
                                horizontal={true}>
                                {item.links.flickr_images.length > 0 ? (
                                  item.links.flickr_images.map((img, index) => {
                                    return (
                                      <Pressable
                                        style={{marginRight: 15}}
                                        onPress={() => {
                                          Linking.openURL(img);
                                        }}
                                        key={index}>
                                        <Image
                                          progressiveRenderingEnabled={true}
                                          defaultSource={require('../assets/image_placeholder2.png')}
                                          style={{
                                            height: 80,
                                            width: 80,
                                            borderRadius: 3,
                                            alignSelf: 'center',
                                          }}
                                          source={{uri: img}}
                                        />
                                      </Pressable>
                                    );
                                  })
                                ) : (
                                  <Text style={{color: '#B9B9B9'}}>
                                    No Launch Images
                                  </Text>
                                )}
                              </ScrollView>
                            </View>
                          </View>
                        ) : null}

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 0,
                            marginLeft: 5,
                            marginRight: 10,
                            alignItems: 'center',
                          }}>
                          <View>
                            <Pressable
                              onPress={() => {
                                setShowDetails(!showDetails);
                                handleShowDetails(item.id);
                              }}
                              style={{
                                backgroundColor: '#555555',
                                padding: 5,
                                paddingHorizontal: 16,
                                borderRadius: 4,
                                margin: 0,
                              }}>
                              <Text
                                style={{
                                  color: 'white',
                                  margin: 0,
                                  padding: 0,
                                  fontWeight: '700',
                                }}>
                                {expandedCardID === item.id && showDetails
                                  ? 'Close'
                                  : 'Launch Details'}
                              </Text>
                            </Pressable>
                          </View>
                          <View style={{flexDirection: 'row'}}>
                            <Pressable
                              disabled={item.links.article_link ? false : true}
                              onPress={() => {
                                Linking.openURL(item.links.article_link);
                              }}
                              style={{}}>
                              <Text
                                style={{
                                  color: item.links.article_link
                                    ? 'white'
                                    : '#929292',
                                  margin: 0,
                                  padding: 0,
                                  fontWeight: '700',
                                }}>
                                Article
                              </Text>
                            </Pressable>
                            <Pressable
                              disabled={item.links.video_link ? false : true}
                              onPress={() => {
                                Linking.openURL(item.links.video_link);
                              }}
                              style={{marginLeft: 20}}>
                              <Text
                                style={{
                                  color: item.links.video_link
                                    ? 'white'
                                    : '#929292',
                                  margin: 0,
                                  padding: 0,
                                  fontWeight: '700',
                                }}>
                                Video
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
              )}
              keyExtractor={item => item.id}
              initialNumToRender={5}
              nestedScrollEnabled
              onEndReachedThreshold={0.5}
              removeClippedSubviews={true} // Unmount components when outside of window
              // Reduce initial render amount
              maxToRenderPerBatch={1} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
              ListFooterComponent={
                <View style={{height: 0, paddingBottom: 180}}></View>
              }
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainpage: {
    backgroundColor: '#060606',
    height: hp(100),
    fontFamily: 'Inter',
  },

  headerwrapper: {
    backgroundColor: '#060606',
    // height: hp(15),
    alignItems: 'flex-start',
    padding: 10,
  },

  headsection: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(94),
    marginLeft: 5,
    // marginBottom: 10
  },
  logo: {
    height: 50,
    width: 50,
  },
  logosection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  shortwarpper: {
    height: hp(98),
    marginTop: hp(2),
    alignItems: 'center',
    width: wp(100),
    // paddingBottom: hp(28),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.37,
    shadowRadius: 15.19,
    // zIndex:1,
    elevation: 29,
  },
  outliner: {
    paddingTop: 6,
    // height: hp(31.5),
    position: 'relative',
    zIndex: 1,
    backgroundColor: '#282828',
    width: wp(90),
    borderRadius: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.37,
    shadowRadius: 15.19,

    elevation: 29,
  },

  postinformation: {
    margin: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SpaceXLaunchList;
