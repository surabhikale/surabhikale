import {Text, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StatusBar, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fetchPost} from '../services/apiService';
import {CLUB_CODE, SPLASH_SCREEN} from '../globals';
import {useToast} from 'react-native-toast-notifications';
import {useSelector} from 'react-redux';
import jwt_decode from 'jwt-decode';
import FastImage from 'react-native-fast-image';

export default function Splash() {
  const user = useSelector(state => state.user.value);
  const navigation = useNavigation();
  const toast = useToast();

  useEffect(() => {
    getClubInfo();
  }, []);

  const [state, setState] = useState({
    isLoading: true,
    clubInfo: {},
  });

  async function getClubInfo() {
    setState(prevState => ({...prevState, isLoading: true}));
    try {
      const response = await fetchPost(
        SPLASH_SCREEN,
        {
          'Content-Type': 'application/json',
        },
        {
          club_code: CLUB_CODE,
        },
      );
      if (response?.data) {
        setState(prevState => ({
          ...prevState,
          clubInfo: response?.data,
          isLoading: false,
        }));
        sessionCheck();
      } else {
        setState(prevState => ({...prevState, isLoading: false}));
        toast.show('Something Went Wrong', {
          type: 'warning',
        });
      }
    } catch (error) {
      setState(prevState => ({...prevState, isLoading: false}));
      toast.show('Something Went Wrong', {
        type: 'warning',
      });
    }
  }

  async function sessionCheck() {
    if (user?.token) {
      let decoded = jwt_decode(user?.token);
      if (decoded.exp > Date.now() / 1000) {
        navigation.replace('Drawer');
      } else {
        navigation.replace('Login');
      }
    } else {
      setTimeout(() => {
        navigation.replace('Login');
      }, 5500);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <FastImage
        style={styles.clubImage}
        resizeMode="stretch"
        source={{uri: state.clubInfo?.logo_data?.club_logo}}
      />

      <Text style={styles.clubLabel}>
        {state.clubInfo?.logo_data?.club_name}
      </Text>

      <FastImage
        style={styles.splashImage}
        source={{uri: state.clubInfo?.splash_screen_data?.splash_screen_image}}
      />

      <Text style={styles.splashTitle}>
        {state.clubInfo?.splash_screen_data?.splash_screen_title}
      </Text>

      <FastImage
        style={styles.sponsorImage}
        source={{uri: state.clubInfo?.sponsor_data?.sponsored_image}}
      />

      <Text style={styles.sponserLabel}>
        {state.clubInfo?.sponsor_data?.sponsored_name}
      </Text>

      {state.isLoading && (
        <ActivityIndicator
          size={'large'}
          color={'#000'}
          style={styles.loader}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  loader: {position: 'absolute', alignSelf: 'center', top: '50%'},
  clubLabel: {
    fontSize: 17,
    fontFamily: 'Outfit-Bold',
    color: '#000',
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  clubImage: {
    width: 150,
    height: 80,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  splashTitle: {
    position: 'absolute',
    fontSize: 17,
    fontFamily: 'Outfit-Bold',
    color: '#fff',
    textAlign: 'center',
    top: '40%',
    width: '80%',
    alignSelf: 'center',
  },
  splashImage: {
    width: 311,
    height: 236,
    alignSelf: 'center',
    resizeMode: 'center',
    marginTop: 14,
    borderRadius: 17,
  },
  sponsorImage: {
    position: 'absolute',
    bottom: 30,
    width: 170,
    // borderWidth: 1,
    height: 120,
    alignSelf: 'center',
    marginVertical: 10,
    resizeMode: 'center',
  },
  sponserLabel: {
    position: 'absolute',
    bottom: 0,
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
  },
});
