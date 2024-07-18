/* eslint-disable react-native/no-inline-styles */
import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import BottomBar from '../components/BottomBar';
import ECard from '../components/ECard';
export default function Calendar() {
  useEffect(() => {}, []);
  const navigation = useNavigation();

  const [state, setState] = useState({
    events: [],
    isLoading: true,
    IDStyle: '',
    showID: false,
  });

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <ECard
        show={state.showID}
        onBackPress={() =>
          setState(prevState => ({...prevState, showID: false}))
        }
      />
      <Header
        leftIcon={
          <MaterialIcons
            name="chevron-left"
            size={25}
            color={'#000'}
            onPress={() => navigation.goBack()}
          />
        }
        label={'Calendar'}
      />
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
          Coming Soon
        </Text>
      </View>
      <BottomBar
        activeTab={'Calendar'}
        navigation={navigation}
        onCardPress={() =>
          setState(prevState => ({...prevState, showID: true}))
        }
      />
    </View>
  );
}
