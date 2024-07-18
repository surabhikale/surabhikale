/* eslint-disable react-native/no-inline-styles */

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fetchPost} from '../services/apiService';
import {ENROLL_USER, GET_ALL_ENROLLED_USERS} from '../globals';
import {useToast} from 'react-native-toast-notifications';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import Input from '../components/TextInput';
import FastImage from 'react-native-fast-image';
import Button from '../components/Button';
import Popup from '../components/Modal';
import moment from 'moment';
export default function EnrolledUsers({route}) {
  useEffect(() => {
    fetchUsers();
  }, []);

  const [activeCategory, setActiveCategory] = useState('Pending');

  const {id, title} = route.params;
  const navigation = useNavigation();
  const user = useSelector(state => state.user.value);
  const toast = useToast();
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    enrolledUsers: [],
    pendingUsers: [],
    isLoading: true,
    searchHolderEnrolled: [],
    searchHolderPending: [],
    showPINModal: false,
    userPIN: '',
    selectedUser: {},
  });

  async function fetchUsers() {
    setState(prevState => ({...prevState, isLoading: true}));
    try {
      const response = await fetchPost(
        GET_ALL_ENROLLED_USERS,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
        {
          event_id: id,
          field_db: '',
          search_val: '',
          per_page: '1000',
        },
      );

      if (response?.data) {
        const enrolled = response.data.filter(user => user.user_enroll == 1);
        const pending = response.data.filter(user => user.user_enroll == 0);

        setState(prevState => ({
          ...prevState,
          enrolledUsers: enrolled,
          pendingUsers: pending,
          searchHolderEnrolled: enrolled,
          searchHolderPending: pending,
          isLoading: false,
        }));
      } else {
        setState(prevState => ({...prevState, isLoading: false}));
        toast.show('No Users Found !', {
          type: 'warning',
        });
      }
    } catch (error) {
      setState(prevState => ({...prevState, isLoading: false}));
      toast.show('No Users Found !!!', {
        type: 'warning',
      });
    }
  }

  const renderUserList = ({item, index}) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={{
          width: '90%',
          borderRadius: 15,
          borderWidth: 0.5,
          alignSelf: 'center',
          elevation: 15,
          marginTop: 15,
          backgroundColor: '#fff',
          padding: 10,
        }}>
        <View
          style={{
            width: '90%',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <FastImage
            source={{uri: item.profile_image}}
            style={styles.userImage}
          />
          <View style={{width: '85%'}}>
            <Text
              numberOfLines={1}
              style={{
                color: '#000',
                fontSize: 15,
                fontFamily: 'Outfit-Bold',
                width: '90%',
                textAlignVertical: 'center',
              }}>
              {item.first_name} {item.last_name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: '#000',
                fontSize: 12,
                fontFamily: 'Outfit-Regular',
                width: '90%',
                textAlignVertical: 'center',
              }}>
              Package : {item.in_package}
            </Text>
          </View>
        </View>

        <Text
          numberOfLines={5}
          style={{
            color: '#000',
            fontSize: 14,
            fontFamily: 'Outfit-Bold',
            width: '95%',
            textAlignVertical: 'center',
          }}>
          Accommodation :{' '}
          <Text
            numberOfLines={5}
            style={{
              color: '#000',
              fontSize: 14,
              backgroundColor: '#fff',
              fontFamily: 'Outfit-Regular',
              width: '100%',
              textAlignVertical: 'center',
            }}>
            {item.user_accommodation}
          </Text>
        </Text>

        {/* <Text
          numberOfLines={5}
          style={{
            color: '#000',
            fontSize: 15,
            fontFamily: 'Outfit-Bold',
            width: '90%',
            textAlignVertical: 'center',
          }}>
          Amount :
          <Text
            numberOfLines={5}
            style={{
              color: '#000',
              fontSize: 15,
              fontFamily: 'Outfit-Regular',
              width: '90%',
              textAlignVertical: 'center',
            }}>
            {item.amount}{' '}
          </Text>
        </Text> */}

        {activeCategory === 'Enrolled' && (
          <Text
            numberOfLines={5}
            style={{
              color: '#000',
              fontSize: 13,
              fontFamily: 'Outfit-Bold',
              width: '90%',
              textAlignVertical: 'center',
            }}>
            Enrollment Time :{' '}
            <Text
              numberOfLines={5}
              style={{
                color: '#000',
                fontSize: 13,
                fontFamily: 'Outfit-Regular',
                width: '90%',
                textAlignVertical: 'center',
              }}>
              {moment(item.user_enroll_datetime).format(
                'MMMM D, YYYY [at] h:mm A',
              )}
            </Text>
          </Text>
        )}

        {activeCategory === 'Pending' && (
          <View style={styles.btnContainer}>
            <Button
              id={'verifyQR'}
              label={'QR Check'}
              width={100}
              fontSize={14}
              onPress={() =>
                navigation.navigate('VerifyUser', {
                  eventID: item.event_id,
                  userID: item.user_id,
                  id: item.id,
                })
              }
            />

            <Button
              id={'updateBtn'}
              label={'ID Check'}
              width={100}
              onPress={() =>
                setState(prevState => ({
                  ...prevState,
                  selectedUser: item,
                  showPINModal: true,
                }))
              }
              fontSize={14}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  function searchData(text) {
    if (activeCategory === 'Pending') {
      const newData = state.searchHolderPending.filter(item => {
        const itemData = item.first_name.toUpperCase();
        item.last_name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      setState(prevState => ({
        ...prevState,
        pendingUsers: newData,
      }));
    } else {
      const newData = state.searchHolderEnrolled.filter(item => {
        const itemData = item.first_name.toUpperCase();
        item.last_name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      setState(prevState => ({
        ...prevState,
        enrolledUsers: newData,
      }));
    }
  }

  const enrollUser = async () => {
    try {
      if (state.userPIN.length < 1) {
        let error = {};
        error.userID = 'Please enter valid User ID';
        setErrors(error);
        return false;
      }
      setState(prevState => ({
        ...prevState,
        isLoading: true,
      }));
      const response = await fetchPost(
        ENROLL_USER + state.selectedUser.id,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
        {
          event_id: state.selectedUser.event_id,
          user_id: state.selectedUser.user_id,
          alternate_id: state.userPIN,
        },
      );

      if (response?.message) {
        if (response.message === 'Enrolled Successfully') {
          toast.show(response.message, {
            type: 'success',
          });
          setState(prevState => ({
            ...prevState,
            selectedUser: {},
            showPINModal: false,
            isLoading: false,
          }));
          fetchUsers();
        } else {
          setErrors({userID: 'Invalid User ID, Please verify again'});

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

  const renderSubCard = type => {
    return (
      <TouchableOpacity
        key={type}
        onPress={() => {
          setActiveCategory(type);
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

  return (
    <View
      style={{
        backgroundColor: '#fff',
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
        label={'Enrolled Users'}
      />

      <Popup
        show={state.showPINModal}
        onBackPress={() =>
          setState(prevState => ({
            ...prevState,
            showPINModal: false,
          }))
        }
        label={'ID Verification'}
        height={420}
        body={
          <>
            <Text style={styles.modalBodyLabel}>
              Enter User ID to Verify & Enroll
            </Text>

            <FastImage
              source={{uri: state.selectedUser.profile_image}}
              style={styles.userImage}
            />

            <Text style={styles.modalBodyLabel}>
              {state.selectedUser.first_name} {state.selectedUser.last_name}
            </Text>

            <Input
              id={'User ID'}
              error={errors.userID}
              placeholder="User ID"
              onChangeText={txt => {
                setState(prevState => ({
                  ...prevState,
                  userPIN: txt,
                }));
                setErrors([]);
              }}
            />

            <View style={styles.buttonContainer}>
              <Button
                id={'pinverify'}
                label={'Verify'}
                width={150}
                isLoading={state.isLoading}
                onPress={() => enrollUser()}
              />
              <Button
                id={'cancel'}
                label={'Cancel'}
                width={150}
                onPress={() =>
                  setState(prevState => ({
                    ...prevState,
                    showPINModal: false,
                  }))
                }
              />
            </View>
          </>
        }
      />
      <View>
        {state.isLoading ? (
          <ActivityIndicator size={'large'} style={{marginTop: '20%'}} />
        ) : (
          <>
            <View
              style={{
                width: '90%',
                backgroundColor: '#fff',
                alignSelf: 'center',
                borderRadius: 20,
                elevation: 10,
                padding: 15,
              }}>
              <Text
                numberOfLines={5}
                style={{
                  color: '#000',
                  fontSize: 16,
                  fontFamily: 'Outfit-Regular',
                  width: '95%',
                  textAlignVertical: 'center',
                }}>
                Event : {title}
              </Text>
            </View>
            <Input
              id={'searchInput'}
              placeholder="Search Users..."
              onChangeText={txt => {
                searchData(txt);
              }}
              leftIcon={
                <MaterialIcons
                  name="account-search-outline"
                  size={20}
                  color={'#d6d6d6'}
                />
              }
            />

            <View style={styles.categoryCard}>
              {renderSubCard('Pending')}
              {renderSubCard('Enrolled')}
            </View>
            <FlatList
              data={
                activeCategory === 'Pending'
                  ? state.pendingUsers
                  : state.enrolledUsers
              }
              style={{height: '70%'}}
              renderItem={renderUserList}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
  },
  modalBodyLabel: {
    fontFamily: 'Outfit-Regular',
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-around',
    alignSelf: 'center',
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
    width: '50%',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: 'transparent',
  },
});
