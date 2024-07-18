/* eslint-disable react-native/no-inline-styles */

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {fetchPost} from '../services/apiService';
import {
  ADMIN_ID,
  COMMITTEE_MEMBER_ID,
  EVENT_LISTING,
  SUPER_ADMIN_ID,
} from '../globals';
import {useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import EventListItem from '../components/EventListItem';
import FastImage from 'react-native-fast-image';
import ECard from '../components/ECard';
import BottomBar from '../components/BottomBar';
import codePush from 'react-native-code-push';
export default function Dashboard() {
  useEffect(() => {
    fetchEvents('upcoming');
    checkforUpdates();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents('upcoming');
    }, []),
  );

  async function checkforUpdates() {
    codePush.checkForUpdate().then(update => {
      if (update) {
        const checkUpdateStatus = async status => {
          switch (status) {
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
              break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
              break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
              await codePush.restartApp();
              break;
          }
        };
        const downloadProgress = (downloadedBytes, totalBytes) => {};
        codePush.sync(
          {updateDialog: false, installMode: codePush.InstallMode.IMMEDIATE},
          checkUpdateStatus,
          downloadProgress,
        );
      }
    });
  }

  const user = useSelector(state => state.user.value);
  const navigation = useNavigation();

  const [activeCategory, setActiveCategory] = useState('Upcoming');
  const toast = useToast();
  const [state, setState] = useState({
    events: [],
    isLoading: true,
    IDStyle: '',
    showID: false,
  });

  async function fetchEvents(range) {
    setState(prevState => ({...prevState, isLoading: true}));
    try {
      const response = await fetchPost(
        `${EVENT_LISTING}`,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
        {
          user_id: user.id,
          data_range: range === 'All' ? '' : range?.toLowerCase(),
        },
      );
      if (response?.data) {
        setState(prevState => ({
          ...prevState,
          events: response.data,
          isLoading: false,
        }));
      } else {
        setState(prevState => ({...prevState, events: [], isLoading: false}));
        toast.show('No Event Found', {
          type: 'warning',
        });
      }
    } catch (error) {
      console.log('error', error);
      setState(prevState => ({...prevState, events: [], isLoading: false}));
      toast.show('No Event Found!', {
        type: 'warning',
      });
    }
  }

  const renderSubCard = type => {
    return (
      <TouchableOpacity
        key={type}
        onPress={() => {
          setActiveCategory(type);
          fetchEvents(type);
        }}
        style={[
          styles.categorySubCard,
          {
            backgroundColor:
              activeCategory === type ? '#037CC3' : 'transparent',
          },
        ]}>
        <Text
          style={{
            color: activeCategory === type ? '#fff' : '#000',
            fontSize: 16,
            fontFamily: 'Outfit-Bold',
            textAlign: 'center',
          }}>
          {type}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderShimmers = () => {
    return (
      <View style={styles.shimmerCard}>
        <View style={{width: '40%'}}>
          <ShimmerPlaceHolder
            shimmerStyle={{borderRadius: 10, width: '95%', height: '95%'}}
            LinearGradient={LinearGradient}
          />
        </View>
        <View style={{width: '60%'}}>
          <ShimmerPlaceHolder
            shimmerStyle={{borderRadius: 10, width: '100%', height: 25}}
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerStyle={[styles.shimmerLines, {width: '45%'}]}
            LinearGradient={LinearGradient}
          />
          <ShimmerPlaceHolder
            shimmerStyle={[styles.shimmerLines, {width: '60%'}]}
            LinearGradient={LinearGradient}
          />
        </View>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={{alignSelf: 'center', margin: 50}}>
        <MaterialCommunityIcons
          name="calendar-search"
          size={30}
          style={{alignSelf: 'center'}}
          color={'#d6d6d6'}
        />
        <Text
          style={{
            color: '#d6d6d6',
            fontSize: 15,
            margin: 10,
            fontFamily: 'Outfit-Regular',
          }}>
          No Events Found
        </Text>
      </View>
    );
  };

  const renderEventList = ({item}) => (
    <EventListItem
      item={item}
      navigation={navigation}
      activeCategory={activeCategory}
    />
  );

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Header
          leftIcon={
            <MaterialIcons
              name="menu"
              size={25}
              color={'#000'}
              onPress={() => navigation.toggleDrawer()}
            />
          }
          label={'Dashboard'}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.userInfoCard}>
          <FastImage
            source={{
              uri:
                user.profile_image ||
                'https://firebasestorage.googleapis.com/v0/b/clubmanagement-8c662.appspot.com/o/user_placeholder.png?alt=media&token=ee80ab7d-7885-4431-ab8e-7a81470f67ad',
            }}
            style={styles.userImage}
          />
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.userLabel}>
              Hi, {user.first_name} {user.last_name}
            </Text>
            <Text style={styles.userSubLabelid}>{user.alternate_id}</Text>
            <Text style={styles.userSubLabel}>
              {user.role_id === SUPER_ADMIN_ID
                ? 'Super Admin'
                : user.role_id === ADMIN_ID
                ? 'Admin'
                : user.role_id === COMMITTEE_MEMBER_ID
                ? 'Committee Member'
                : 'Club Member'}
            </Text>
          </View>
        </TouchableOpacity>

        <ECard
          show={state.showID}
          onBackPress={() =>
            setState(prevState => ({...prevState, showID: false}))
          }
        />

        {/* Event Module Starts */}
        <View>
          <View style={styles.categoryCard}>
            {renderSubCard('All')}
            {renderSubCard('Upcoming')}
            {renderSubCard('Past')}
          </View>

          {state.isLoading ? (
            Array.from(Array(3), (_, i) => renderShimmers())
          ) : (
            <FlatList
              ListEmptyComponent={renderEmptyComponent()}
              data={state.events?.slice(0, 5)}
              style={{marginBottom: 60}}
              renderItem={renderEventList}
            />
          )}
        </View>
        {/* Event Module Ends */}
      </ScrollView>

      <BottomBar
        activeTab={'Home'}
        navigation={navigation}
        onCardPress={() =>
          setState(prevState => ({...prevState, showID: true}))
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  linearGradient: {
    paddingLeft: 10,
    height: '100%',
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.6,
    shadowRadius: 1,
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
    fontFamily: 'Outfit-Regular',
  },
  userSubLabel: {
    color: '#a3a3a3',
    fontSize: 13,
    textAlignVertical: 'center',
    fontFamily: 'Outfit-Regular',
  },
  userSubLabelid: {
    color: '#000',
    fontSize: 13,
    textAlignVertical: 'center',
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
