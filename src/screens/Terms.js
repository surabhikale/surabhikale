/* eslint-disable react-native/no-inline-styles */
import {ActivityIndicator, ScrollView, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {fetchGet} from '../services/apiService';
import {TERMS_CONDITIONS} from '../globals';
import {useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RenderHTML from 'react-native-render-html';
export default function Terms() {
  useEffect(() => {
    fetchContent('');
  }, []);
  const user = useSelector(state => state.user.value);
  const navigation = useNavigation();

  const toast = useToast();
  const [state, setState] = useState({
    content: '',
    isLoading: true,
  });

  async function fetchContent(range) {
    setState(prevState => ({...prevState, isLoading: true}));
    try {
      const response = await fetchGet(TERMS_CONDITIONS, {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token,
      });
      if (response?.data) {
        let formatted = response?.data?.trim();

        setState(prevState => ({
          ...prevState,
          content: formatted,
          isLoading: false,
        }));
      } else {
        setState(prevState => ({...prevState, isLoading: false}));
        toast.show('No Content Found', {
          type: 'warning',
        });
      }
    } catch (error) {
      setState(prevState => ({...prevState, isLoading: false}));
      toast.show('No Content Found', {
        type: 'warning',
      });
    }
  }

  const tagsStyles = {
    p: {
      color: '#000',
      fontFamily: 'Outfit-Regular',
    },
    ul: {
      color: '#000',
      fontFamily: 'Outfit-Regular',
    },
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
        label={'Terms & Conditions'}
      />
      <View>
        {state.isLoading ? (
          <ActivityIndicator style={{margin: 20}} size={'large'} />
        ) : (
          <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 120}}>
            <RenderHTML
              source={{html: state.content}}
              tagsStyles={tagsStyles}
              contentWidth={'85%'}
            />
            {/* <HTMLView value={state.content} stylesheet={styles} /> */}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
