/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchPost } from '../services/apiService';
import { EVENT_LISTING } from '../globals';
import { useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import EventListItem from '../components/EventListItem';

export default function Events() {
  useEffect(() => {
    fetchEvents('upcoming');
  }, []);
  const user = useSelector(state => state.user.value);
  const navigation = useNavigation();

  const [activeCategory, setActiveCategory] = useState('Upcoming');
  const toast = useToast();
  const [state, setState] = useState({
    events: [],
    isLoading: true,
  });

  async function fetchEvents(range) {
    setState(prevState => ({ ...prevState, isLoading: true }));
    try {
      const response = await fetchPost(
        `${EVENT_LISTING}`,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
        {
          user_id: user.id,
          data_range: range,
        },
      );
      if (response?.data) {
        setState(prevState => ({
          ...prevState,
          events: response.data,
          isLoading: false,
        }));
      } else {
        setState(prevState => ({ ...prevState, events: [], isLoading: false }));
        toast.show('No Events Found', {
          type: 'warning',
        });
      }
    } catch (error) {
      console.log('errorrrr', error);
      setState(prevState => ({ ...prevState, events: [], isLoading: false }));
      toast.show('No Events Found', {
        type: 'warning',
      });
    }
  }

  const renderEventList = ({ item }) => (
    <EventListItem
      item={item}
      navigation={navigation}
      activeCategory={activeCategory}
    />
  );

  const renderShimmers = () => {
    return (
      <View style={styles.shimmerCard}>
        <View style={{ width: '40%' }}>
          <ShimmerPlaceHolder
            shimmerStyle={{ borderRadius: 10, width: '95%', height: '95%' }}
            LinearGradient={LinearGradient}
          />
        </View>
        <View style={{ width: '60%' }}>
          <ShimmerPlaceHolder
            shimmerStyle={{ borderRadius: 10, width: '100%', height: 25 }}
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerStyle={[styles.shimmerLines, { width: '45%' }]}
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerStyle={[styles.shimmerLines, { width: '60%' }]}
            LinearGradient={LinearGradient}
          />
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        leftIcon={
          <MaterialIcons
            name="chevron-left"
            size={25}
            color={'#000'}
            onPress={() => navigation.goBack()}
          />
        }
        label={'Events'}
      />
      <View>
        <View
          style={{
            width: '90%',
            height: 40,
            borderRadius: 30,
            alignSelf: 'center',
            marginTop: 20,
            backgroundColor: '#CAEBFF',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => {
              setActiveCategory('All');
              fetchEvents('');
            }}
            style={{
              width: '33%',
              justifyContent: 'center',
              borderRadius: 30,
              backgroundColor:
                activeCategory === 'All' ? '#037CC3' : 'transparent',
            }}>
            <Text
              style={{
                color: activeCategory === 'All' ? '#fff' : '#000',
                fontSize: 16,
                fontFamily: 'Outfit-Bold',
                textAlign: 'center',
              }}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveCategory('Upcoming');
              fetchEvents('upcoming');
            }}
            style={{
              width: '33%',
              justifyContent: 'center',
              borderRadius: 30,
              backgroundColor:
                activeCategory === 'Upcoming' ? '#037CC3' : 'transparent',
            }}>
            <Text
              style={{
                color: activeCategory === 'Upcoming' ? '#fff' : '#000',
                fontSize: 16,
                fontFamily: 'Outfit-Bold',
                textAlign: 'center',
              }}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '33%',
              justifyContent: 'center',
              borderRadius: 30,
              backgroundColor:
                activeCategory === 'Past' ? '#037CC3' : 'transparent',
            }}
            onPress={() => {
              setActiveCategory('Past');
              fetchEvents('past');
            }}>
            <Text
              style={{
                color: activeCategory === 'Past' ? '#fff' : '#000',
                fontSize: 16,
                fontFamily: 'Outfit-Bold',
                textAlign: 'center',
                alignSelf: 'center',
              }}>
              Past
            </Text>
          </TouchableOpacity>
        </View>

        {/* Events */}

        {state.isLoading ? (
          Array.from(Array(3), (_, i) => renderShimmers())
        ) : (
          <FlatList
            data={state.events}
            style={{ height: '82%' }}
            renderItem={renderEventList}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 20,
  },
  itemIcon: { marginLeft: 8, color: '#fff', paddingRight: 10 },
  itemText: { color: '#fff', fontSize: 18, fontFamily: 'Outfit-Regular' },
  subItemsContainer: { marginLeft: 10 },
  tenantText: {
    color: '#ffffff',
    paddingTop: 10,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },
  tenantLogo: {
    height: 100,
    width: 100,
  },
  tenantLogoContainer: {
    marginTop: 80,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 100,
    width: 160,
    height: 160,
  },
  versionLabel: {
    color: '#fff',
    fontSize: 10,
    width: '100%',
    height: 30,
    fontFamily: 'Outfit-Regular',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  linearGradient: {
    paddingLeft: 10,
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 230,
    borderBottomRightRadius: 120,
    marginBottom: 50,
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#fff',
    padding: 5,
    width: '80%',
    alignSelf: 'center',
  },

  buttonContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-around',
    alignSelf: 'center',
  },
  floatingButton: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: '88%',
    backgroundColor: '#0083C9',
    right: 30,
    zIndex: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff',
  },
  userInfoCard: {
    width: '90%',
    height: 80,
    elevation: 5,
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 20,
    flexDirection: 'row',
  },
  userImage: {
    resizeMode: 'cover',
    width: 60,
    height: 60,
    alignSelf: 'center',
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: '#000',
    margin: 10,
  },
  userLabel: {
    color: '#000',
    fontSize: 18,
    textAlignVertical: 'center',
    padding: 10,
    fontFamily: 'Outfit-Regular',
  },
  categoryCard: {
    width: '90%',
    height: 40,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#CAEBFF',
    flexDirection: 'row',
  },
  categorySubCard: {
    width: '33%',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: 'transparent',
  },
  eventCard: {
    width: '90%',
    borderRadius: 15,
    // borderWidth: 0.1,
    alignSelf: 'center',
    elevation: 15,
    marginTop: 15,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  eventImage: {
    resizeMode: 'cover',
    width: '100%',
    height: 145,
    margin: 10,
    borderRadius: 10,
  },
  eventTitleLabel: {
    color: '#000',
    fontSize: 15,
    fontFamily: 'Outfit-Bold',
    width: '90%',
    marginTop: 15,
    height: 45,
  },
  eventTimeLabel: {
    color: '#0185CA',
    fontSize: 13,
    width: '90%',
    fontFamily: 'Outfit-Regular',
    marginTop: 5,
  },
  eventVenueLabel: {
    color: '#000',
    fontSize: 15,
    width: '90%',
    fontFamily: 'Outfit-Regular',
    marginTop: 5,
  },
  eventScheduleLabel: {
    color: '#000',
    fontSize: 14,
    width: '90%',
    fontFamily: 'Outfit-Regular',
    marginTop: 5,
    paddingHorizontal: 15,
  },
  idImage: {
    resizeMode: 'cover',
    width: '80%',
    height: 400,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d6d6d6',
  },
  idUserQRImage: {
    resizeMode: 'cover',
    width: 100,
    height: 100,
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    position: 'absolute',
  },
  idUserImage: {
    resizeMode: 'cover',
    width: 120,
    height: 120,
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    position: 'absolute',
  },

  idUsername: {
    position: 'absolute',
    color: '#000',
    fontSize: 11,
    backgroundColor: '#fff',
    width: '35%',
    fontFamily: 'Outfit-Bold',
  },
  idUserEmail: {
    position: 'absolute',
    color: '#000',
    fontSize: 10,
    backgroundColor: '#fff',
    fontFamily: 'Outfit-Regular',
    top: '63%',
    left: '36%',
  },
  idUserMobile: {
    position: 'absolute',
    color: '#000',
    fontSize: 10,
    backgroundColor: '#fff',
    width: '35%',
    fontFamily: 'Outfit-Regular',
  },
  idUserDOB: {
    position: 'absolute',
    color: '#000',
    fontSize: 10,
    backgroundColor: '#fff',
    width: '30%',
    fontFamily: 'Outfit-Regular',
  },
  shimmerCard: {
    flexDirection: 'row',
    padding: 10,
    width: '90%',
    height: 180,
    borderRadius: 15,
    alignSelf: 'center',
    elevation: 15,
    marginTop: 15,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  shimmerLines: {
    borderRadius: 10,
    height: 25,
    marginTop: 10,
  },
});
