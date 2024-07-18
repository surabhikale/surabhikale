/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fetchPost} from '../services/apiService';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../redux/slices/userSlice';
import Input from '../components/TextInput';
import Button from '../components/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../components/Header';
import {useToast} from 'react-native-toast-notifications';
import {UPDATE_USER_INFO} from '../globals';
import ImagePicker from 'react-native-image-crop-picker';
import Popup from '../components/Modal';
import FastImage from 'react-native-fast-image';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Profile() {
  const user = useSelector(state => state.user.value);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  const [state, setState] = useState({
    inputFirstname: user.first_name,
    // inputMiddlename: user.middle_name,
    inputLastname: user.last_name,
    inputDOB: user.dob,
    inputGender: user.gender,
    inputEmail: user.email,
    inputMobile: user.mobile,
    inputAddress: user.address,
    inputCity: user.city,
    inputState: user.state,
    inputCountry: user.country,
    inputZipcode: user.zipcode,
    isLoading: false,
    showImagePicker: false,
    showDatePicker: false,
    imageUpdated: false,
    updatedImage: '',
  });
  const [errors, setErrors] = useState({});

  async function updateProfile() {
    setState(prevState => ({...prevState, isLoading: true}));
    try {
      const response = await fetchPost(
        `${UPDATE_USER_INFO}${user.id}`,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
        {
          first_name: state.inputFirstname,
          // middle_name: state.inputMiddlename,
          last_name: state.inputLastname,
          profile_image_encode: state.imageUpdated ? state.updatedImage : '',
          dob: state.inputDOB,
          gender: state.inputGender,
          mobile: state.inputMobile,
          address: state.inputAddress,
          country: state.inputCountry,
          state: state.inputState,
          city: state.inputCity,
          zipcode: state.inputZipcode,
        },
      );
      if (response?.data) {
        console.log('error', response);
        setState(prevState => ({
          ...prevState,
          isLoading: false,
        }));
        dispatch(setUser({...user, ...response?.data}));
        toast.show('Profile Updated Successfully', {
          type: 'success',
        });
      } else {
        setState(prevState => ({...prevState, isLoading: false}));
        toast.show('Unable to update profile, Something Went Wrong', {
          type: 'warning',
        });
      }
    } catch (error) {
      console.log('error', error);
      setState(prevState => ({...prevState, isLoading: false}));
      toast.show('Unable to update profile, Something Went Wrong !', {
        type: 'warning',
      });
    }
  }

  const setDate = (event, date) => {
    if (event.type === 'set') {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      // const dateString = `${day}-${month}-${year}`;
      const dateString = `${year}-${month}-${day}`;

      setState(prevState => ({
        ...prevState,
        showDatePicker: false,
        inputDOB: dateString,
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        showDatePicker: false,
        inputDOB: user.dob ? user.dob : null,
      }));
      setErrors([]);
      return null;
    }
  };

  const validateForm = () => {
    let error = {};

    if (!state.inputFirstname) {
      error.firstname = 'Please enter valid First Name';
    }
    // if (!state.inputMiddlename) {
    //   error.middlename = 'Please enter valid Middle Name';
    // }
    if (!state.inputLastname) {
      error.lastname = 'Please enter valid Last Name';
    }
    if (!state.inputDOB) {
      error.dob = 'Please enter valid Date of Birth';
    }
    if (!state.inputMobile) {
      error.mobile = 'Please enter valid Mobile';
    }
    if (state.inputMobile.length !== 10) {
      error.mobile = 'Mobile Sholud be 10 Digits';
    }
    if (!state.inputAddress) {
      error.address = 'Please enter valid Address';
    }
    if (!state.inputCity) {
      error.city = 'Please enter valid City';
    }
    if (!state.inputState) {
      error.state = 'Please enter valid State';
    }
    if (!state.inputCountry) {
      error.country = 'Please enter valid Country';
    }
    if (!state.inputZipcode) {
      error.zipcode = 'Please enter valid Pincode';
    }
    if (state.inputZipcode.length !== 6) {
      error.zipcode = 'Pincode Sholud be 6 Digits';
    }

    setErrors(error);

    if (Object.keys(error).length === 0) {
      updateProfile();
    }
  };

  const chooseImage = type => {
    const imgOptions = {
      mediaType: 'photo',
      width: 400,
      height: 400,
      compressImageQuality: 0.5,
      includeBase64: true,
      cropping: true,
    };
    if (type === 'Gallery') {
      ImagePicker.openPicker(imgOptions).then(img => {
        setState(prevState => ({
          ...prevState,
          updatedImage: img?.data,
          imageUpdated: true,
          showImagePicker: false,
        }));
      });
    }

    if (type === 'Camera') {
      ImagePicker.openCamera(imgOptions).then(img => {
        setState(prevState => ({
          ...prevState,
          updatedImage: img?.data,
          imageUpdated: true,
          showImagePicker: false,
        }));
      });
    }
  };
  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.container}>
        <View style={{height: '100%', marginBottom: 50}}>
          <Header
            leftIcon={
              <MaterialIcons
                name="chevron-left"
                size={25}
                color={'#000'}
                onPress={() => navigation.goBack()}
              />
            }
            label={'My Profile'}
          />

          <Popup
            show={state.showImagePicker}
            onBackPress={() =>
              setState(prevState => ({...prevState, showImagePicker: false}))
            }
            label={'Choose Image From'}
            height={260}
            body={
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}>
                  <View>
                    <TouchableOpacity
                      onPress={() => chooseImage('Gallery')}
                      style={styles.imageIconContainer}>
                      <ImageIcons name="photo" size={35} color={'#000'} />
                    </TouchableOpacity>
                    <Text style={styles.imageLabel}>Gallery</Text>
                  </View>

                  <View>
                    <TouchableOpacity
                      onPress={() => chooseImage('Camera')}
                      style={styles.imageIconContainer}>
                      <ImageIcons name="add-a-photo" size={35} color={'#000'} />
                    </TouchableOpacity>
                    <Text style={styles.imageLabel}>Camera</Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    id={'cancel'}
                    label={'Cancel'}
                    width={150}
                    onPress={() =>
                      setState(prevState => ({
                        ...prevState,
                        showImagePicker: false,
                      }))
                    }
                  />
                </View>
              </>
            }
          />
          <TouchableOpacity
            onPress={() =>
              setState(prevState => ({
                ...prevState,
                showImagePicker: true,
              }))
            }
            style={{
              backgroundColor: '#fff',
              width: '90%',
              // elevation: 10,
              alignSelf: 'center',
              borderRadius: 10,
            }}>
            <FastImage
              source={{
                uri: state.imageUpdated
                  ? 'data:image/png;base64,' + state.updatedImage
                  : user.profile_image ||
                    'https://firebasestorage.googleapis.com/v0/b/clubmanagement-8c662.appspot.com/o/user_placeholder.png?alt=media&token=ee80ab7d-7885-4431-ab8e-7a81470f67ad',
              }}
              style={{
                resizeMode: 'contain',
                width: 120,
                height: 120,

                margin: 10,
                borderRadius: 60,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>

          <View>
            <Input
              id={'firstname'}
              placeholder="First Name"
              onChangeText={txt => {
                setState(prevState => ({...prevState, inputFirstname: txt}));
                setErrors([]);
              }}
              defaultValue={state.inputFirstname}
              error={errors.firstname}
            />

            {/* <Input
            id={'middlename'}
            placeholder="Middle Name"
            onChangeText={txt => {
              setState(prevState => ({...prevState, inputMiddlename: txt}));
              setErrors([]);
            }}
            defaultValue={state.inputMiddlename}
            error={errors.middlename}
          /> */}

            <Input
              id={'lastname'}
              placeholder="Last Name"
              onChangeText={txt => {
                setState(prevState => ({...prevState, inputLastname: txt}));
                setErrors([]);
              }}
              defaultValue={state.inputLastname}
              error={errors.lastname}
            />

            <TouchableOpacity
              onPress={() =>
                setState(prevState => ({
                  ...prevState,
                  showDatePicker: true,
                }))
              }>
              <Input
                id={'dob'}
                editable={false}
                placeholder="Date of Birth"
                onChangeText={txt => {
                  setState(prevState => ({...prevState, inputDOB: txt}));
                  setErrors([]);
                }}
                defaultValue={state.inputDOB}
                error={errors.dob}
              />
            </TouchableOpacity>

            {state.showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={
                  state.inputDOB ? new Date(`${state.inputDOB}`) : new Date()()
                }
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={setDate}
              />
            )}

            <Input
              id={'gender'}
              disabled={true}
              placeholder="Gender"
              onChangeText={txt => {
                setState(prevState => ({...prevState, inputGender: txt}));
                setErrors([]);
              }}
              defaultValue={state.inputGender}
              error={errors.gender}
            />

            <Input
              id={'email'}
              editable={false}
              placeholder="Email"
              // onChangeText={txt => {
              //   setState(prevState => ({...prevState, inputEmail: txt}));
              //   setErrors([]);
              // }}
              defaultValue={state.inputEmail}
              error={errors.email}
            />

            <Input
              id={'mobile'}
              inputMode="numeric"
              placeholder="Mobile"
              maxLength={10}
              onChangeText={txt => {
                setState(prevState => ({...prevState, inputMobile: txt}));
                setErrors([]);
              }}
              defaultValue={state.inputMobile}
              error={errors.mobile}
            />

            <Input
              id={'address'}
              placeholder="Address"
              numberofLines={3}
              onChangeText={txt => {
                setState(prevState => ({...prevState, inputAddress: txt}));
                setErrors([]);
              }}
              defaultValue={state.inputAddress}
              error={errors.address}
            />

            <Input
              id={'city'}
              placeholder="City"
              numberofLines={3}
              onChangeText={txt => {
                setState(prevState => ({...prevState, inputCity: txt}));
                setErrors([]);
              }}
              defaultValue={state.inputCity}
              error={errors.city}
            />

            <Input
              id={'state'}
              placeholder="State"
              numberofLines={3}
              onChangeText={txt => {
                setState(prevState => ({...prevState, inputState: txt}));
                setErrors([]);
              }}
              defaultValue={state.inputState}
              error={errors.state}
            />

            <Input
              id={'country'}
              placeholder="Country"
              numberofLines={3}
              onChangeText={txt => {
                setState(prevState => ({...prevState, inputCountry: txt}));
                setErrors([]);
              }}
              defaultValue={state.inputCountry}
              error={errors.country}
            />

            <Input
              id={'pincode'}
              placeholder="Pincode"
              inputMode="numeric"
              numberofLines={3}
              maxLength={6}
              onChangeText={txt => {
                setState(prevState => ({...prevState, inputZipcode: txt}));
                setErrors([]);
              }}
              defaultValue={state.inputZipcode}
              error={errors.zipcode}
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#d3d3d3',
        }}>
        <Button
          id={'updateBtn'}
          label={'Update Profile'}
          isLoading={state.isLoading}
          onPress={() => validateForm()}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  labelHeader: {
    color: '#000',
    fontSize: 22,
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Outfit-Bold',
  },
  btnSubmit: {
    width: '50%',
    alignSelf: 'center',
    marginTop: 40,
    height: 50,
  },
  labelOTP: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
    alignSelf: 'center',
  },
  labelVerify: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    alignSelf: 'center',
    width: '80%',
  },
  inputOTP: {
    borderColor: '#000',
    borderWidth: 1,
    width: 45,
    backgroundColor: '#047AC1',
    borderRadius: 5,
    color: '#fff',
  },
  error: {
    color: '#ff0000',
    fontFamily: 'Outfit-Light',
  },
  otpContainer: {
    marginVertical: 25,
    marginHorizontal: 20,
  },
  imageIconContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    elevation: 10,
    marginTop: 18,
    backgroundColor: '#fff',
  },
  imageLabel: {
    color: '#000',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Outfit-Regular',
  },
  buttonContainer: {
    marginTop: 10,
  },
});
