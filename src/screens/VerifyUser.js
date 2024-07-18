/* eslint-disable react-native/no-inline-styles */
import {ActivityIndicator, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {fetchPost} from '../services/apiService';
import {ENROLL_USER} from '../globals';
import {useToast} from 'react-native-toast-notifications';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';

export default function VerifyUser({route}) {
  useEffect(() => {
    // fetchUsers();
  }, []);

  const {eventID, userID, id} = route.params;
  const navigation = useNavigation();

  const user = useSelector(state => state.user.value);
  const toast = useToast();
  const [state, setState] = useState({
    users: [],
    isLoading: false,
    searchHolder: [],
  });

  const onSuccess = async e => {
    if (e.data) {
      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));
      enroll(e.data);
    }
  };

  const enroll = async alternate_id => {
    try {
      const response = await fetchPost(
        ENROLL_USER + id,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
        {
          event_id: eventID,
          user_id: userID,
          alternate_id: alternate_id,
        },
      );

      if (response?.message) {
        if (response.message === 'Enrolled Successfully') {
          toast.show(response.message, {
            type: 'success',
          });
          setState(prevState => ({
            ...prevState,
            isLoading: false,
          }));
          navigation.goBack();
        } else {
          toast.show(response.message, {
            type: 'warning',
          });
          setState(prevState => ({
            ...prevState,
            isLoading: false,
          }));
        }
      } else {
        setState(prevState => ({...prevState, isLoading: false}));
        toast.show('Unable to verify, Please try again', {
          type: 'warning',
        });
      }
    } catch (error) {
      setState(prevState => ({...prevState, isLoading: false}));
      toast.show('Unable to verify, Please try again !', {
        type: 'warning',
      });
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <Header
        color={'#000'}
        leftIcon={
          <MaterialIcons
            name="chevron-left"
            size={25}
            color={'#000'}
            onPress={() => navigation.goBack()}
          />
        }
        label={'Verify User'}
      />

      {state.isLoading ? (
        <ActivityIndicator size={'large'} color={'#0056B3'} style={{flex: 1}} />
      ) : (
        <QRCodeScanner
          onRead={e => onSuccess(e)}
          cameraStyle={{height: '100%', width: '100%'}}
          showMarker={true}
          markerStyle={{borderRadius: 20, borderColor: '#0056B3'}}
        />
      )}
    </View>
  );
}
