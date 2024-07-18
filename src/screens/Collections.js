/* eslint-disable react-native/no-inline-styles */
import {ActivityIndicator, Linking, Platform, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fetchGet} from '../services/apiService';
import {COLLECTION_CENTER} from '../globals';
import {useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Collections() {
  useEffect(() => {
    fetchEvents();
  }, []);
  const user = useSelector(state => state.user.value);
  const navigation = useNavigation();

  const toast = useToast();
  const [state, setState] = useState({
    collections: [],
    isLoading: true,
  });

  async function fetchEvents() {
    setState(prevState => ({...prevState, isLoading: true}));
    try {
      const response = await fetchGet(`${COLLECTION_CENTER}${user.tenant_id}`, {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token,
      });
      if (response?.data) {
        setState(prevState => ({
          ...prevState,
          collections: response.data,
          isLoading: false,
        }));
      } else {
        setState(prevState => ({...prevState, isLoading: false}));
        toast.show('Unable to fetch events, Something Went Wrong', {
          type: 'warning',
        });
      }
    } catch (error) {
      console.log('error', error);
      setState(prevState => ({...prevState, isLoading: false}));
      toast.show('Unable to fetch events, Something Went Wrong !', {
        type: 'warning',
      });
    }
  }

  async function openMaps(address) {
    const url = Platform.select({
      ios: `maps:0,0?q=${address}`,
      android: `geo:0,0?q=${address}`,
    });

    Linking.openURL(url);
  }

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
        label={'Collection Centers'}
      />
      <View>
        {state.isLoading ? (
          <ActivityIndicator size={'large'} style={{marginTop: '20%'}} />
        ) : (
          <FlatList
            data={state.collections}
            style={{height: '85%'}}
            renderItem={({item}) => (
              <View
                key={item.id}
                style={{
                  width: '90%',
                  height: 160,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  alignSelf: 'center',
                  elevation: 15,
                  marginTop: 15,
                  backgroundColor: '#fff',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    width: '90%',
                    marginLeft: 20,
                    alignItems: 'center',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#000',
                      fontSize: 15,
                      fontFamily: 'Outfit-Bold',
                      width: '90%',
                      marginTop: 15,
                    }}>
                    {item.collective_name}
                  </Text>
                  <Text
                    onPress={() =>
                      Linking.openURL(`tel:${item.collective_mobile_no}`)
                    }
                    numberOfLines={1}
                    style={{
                      color: '#0185CA',
                      fontSize: 14,
                      width: '90%',
                      fontFamily: 'Outfit-Regular',
                      marginTop: 5,
                    }}>
                    {item.collective_mobile_no}
                  </Text>

                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#d6d6d6',
                      width: '95%',
                      marginVertical: 8,
                    }}
                  />

                  <Text
                    onPress={() => openMaps(item.collective_address)}
                    numberOfLines={5}
                    style={{
                      color: '#000',
                      fontSize: 13,
                      width: '90%',
                      fontFamily: 'Outfit-Regular',
                      marginTop: 5,
                    }}>
                    {item.collective_address}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
