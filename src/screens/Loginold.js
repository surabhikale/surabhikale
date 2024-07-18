import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {ScrollView} from 'react-native';
import OTPTextView from 'react-native-otp-textinput';
import {useNavigation} from '@react-navigation/native';
import {fetchGet, fetchPost} from '../services/apiService';
import {
  CLUB_CODE,
  GET_ID_COORDS,
  GET_USER_INFO,
  LOGIN,
  VERIFY_OTP,
} from '../globals';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/slices/userSlice';
import {setID} from '../redux/slices/idSlice';

import Input from '../components/TextInput';
import Button from '../components/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import {useToast} from 'react-native-toast-notifications';
import FastImage from 'react-native-fast-image';
import codePush from 'react-native-code-push';

import ColorPicker, {Panel4, Panel5} from 'reanimated-color-picker';

export default function Login() {
  useEffect(() => {
    checkforUpdates();
  }, []);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const toast = useToast();
  const [state, setState] = useState({
    // inputEmail: '',
    inputMobile: '',
    // emailOTP: '',
    mobileOTP: '',
    otpSent: false,
    tempObject: {},
    isLoading: false,
    resendButtonEnabled: false,
  });
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(45);

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

  async function doLogin() {
    setState(prevState => ({...prevState, isLoading: true}));
    try {
      const response = await fetchPost(
        LOGIN,
        {'Content-Type': 'application/json'},
        {
          // email: state.inputEmail,
          mobile: state.inputMobile,
          club_code: CLUB_CODE,
        },
      );
      if (response?.access_token) {
        setState(prevState => ({
          ...prevState,
          tempObject: response,
          otpSent: true,
          isLoading: false,
        }));

        toast.show('OTP sent to your mobile', {
          type: 'success',
        });
        startResendTimer();
      } else {
        setState(prevState => ({...prevState, isLoading: false}));
        toast.show('Invalid Credentials, Please check your phone', {
          type: 'warning',
        });
      }
    } catch (error) {
      setState(prevState => ({...prevState, isLoading: false}));
      toast.show('Invalid Credentials, Please check your phone', {
        type: 'warning',
      });
    }
  }

  const startResendTimer = () => {
    setState(prevState => ({
      ...prevState,
      resendButtonEnabled: false,
    }));

    setResendTimer(45);

    const intervalId = setInterval(() => {
      setResendTimer(prevTimer => {
        console.log('resend time', prevTimer);
        if (prevTimer === 1) {
          clearInterval(intervalId);
          setState(prevState => ({
            ...prevState,
            resendButtonEnabled: true,
          }));
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleResend = () => {
    doLogin();
  };

  async function verifyOTP() {
    setState(prevState => ({...prevState, isLoading: true}));
    try {
      const response = await fetchPost(
        VERIFY_OTP,
        {'Content-Type': 'application/json'},
        {
          // email: state.inputEmail,
          // email_otp: state.emailOTP,
          mobile: state.inputMobile,
          mobile_otp: state.mobileOTP,
        },
      );
      if (response?.result === true) {
        getUserInfo();
      } else {
        setState(prevState => ({...prevState, isLoading: false}));
        toast.show('Invalid OTP, Please check OTP', {
          type: 'warning',
        });
      }
    } catch (error) {
      console.log('Error', error);
      setState(prevState => ({...prevState, isLoading: false}));
      toast.show('Invalid OTP !, Please check OTP', {
        type: 'warning',
      });
    }
  }

  async function getUserInfo() {
    try {
      const response = await fetchGet(GET_USER_INFO, {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + state.tempObject.access_token,
      });
      if (response?.data) {
        let userObject = {
          token: state.tempObject.access_token,
          rold_id: state.tempObject.role_id,
          tenant_id: state.tempObject.tenant_id,
          ...response.data,
        };
        dispatch(setUser(userObject));
        fetchIDCard();
      } else {
        setState(prevState => ({...prevState, isLoading: false}));
        toast.show('Invalid OTP, Please check OTP !', {
          type: 'warning',
        });
      }
    } catch (error) {
      console.log('Error', error);
      setState(prevState => ({...prevState, isLoading: false}));
      toast.show('Invalid OTP, Please check OTP!', {
        type: 'warning',
      });
    }
  }

  async function fetchIDCard() {
    try {
      const response = await fetchGet(`${GET_ID_COORDS}`, {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + state.tempObject.access_token,
      });
      if (response?.data) {
        dispatch(setID(response.data));
      }
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        otpSent: false,
      }));
      toast.show('Login Sucessful', {
        type: 'success',
      });
      navigation.replace('Drawer');
    } catch (error) {
      console.log('No ID Found');
    }
  }

  const validateForm = type => {
    let error = {};
    if (type === 'login') {
      if (!state.inputMobile) {
        error.mobileInput = 'Mobile is required.';
      }
      // if (!state.inputEmail) {
      //   error.emailInput = 'Email is required.';
      // } else if (!/\S+@\S+\.\S+/.test(state.inputEmail)) {
      //   error.emailInput = 'Please enter valid email';
      // }
      setErrors(error);
      console.log('Errors', error);
      if (Object.keys(error).length === 0) {
        doLogin();
      }
    }

    if (type === 'verify') {
      if (!state.mobileOTP) {
        error.name = 'Please enter valid Mobile OTP';
      }
      // if (!state.emailOTP) {
      //   error.name = 'Please enter valid Mobile OTP';
      // }
      setErrors(error);
      if (Object.keys(error).length === 0) {
        verifyOTP();
        // getUserInfo();
      }
    }
  };

  const onSelectColor = ({hex}) => {
    // do something with the selected color.
    console.log(hex);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      automaticallyAdjustKeyboardInsets={true}
      contentContainerStyle={styles.container}>
      <View>
        <Header label={'Member App Registration'} />

        {!state.otpSent && (
          <View>
            <FastImage
              resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
              source={require('../assets/images/login_bg.jpg')}
              style={styles.loginBackground}
            />

            <Input
              id={'mobileInput'}
              inputMode="numeric"
              maxLength={10}
              placeholder="Mobile"
              onChangeText={txt => {
                setState(prevState => ({...prevState, inputMobile: txt}));
                setErrors([]);
              }}
              leftIcon={
                <MaterialIcons name="cellphone" size={18} color={'#d6d6d6'} />
              }
              error={errors.mobileInput}
            />

            {/* <Input
              id={'emailInput'}
              placeholder="Email ID"
              inputMode="email"
              onChangeText={txt => {
                setState(prevState => ({...prevState, inputEmail: txt}));
                setErrors([]);
              }}
              leftIcon={
                <MaterialIcons name="email" size={18} color={'#d6d6d6'} />
              }
              error={errors.emailInput}
            /> */}

            <Button
              id={'btnOTP'}
              label={'Get OTP'}
              isLoading={state.isLoading}
              onPress={() => validateForm('login')}
            />

            <ColorPicker
              style={{width: '70%'}}
              value="red"
              onComplete={onSelectColor}>
              {/* <Preview /> */}
              <Panel4 />
              {/* <HueSlider /> */}
              {/* <OpacitySlider /> */}
              {/* <Swatches /> */}
            </ColorPicker>
          </View>
        )}

        {state.otpSent && (
          <View style={{marginTop: 25}}>
            <Header
              label={''}
              leftIcon={
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={'#000'}
                  onPress={() =>
                    setState(prevState => ({...prevState, otpSent: false}))
                  }
                />
              }
            />
            <Text style={styles.labelVerify}>
              Enter 6-digit OTP sent to your mobile number to verify the mobile
            </Text>

            <OTPTextView
              textInputStyle={styles.inputOTP}
              containerStyle={styles.otpContainer}
              inputCount={6}
              handleTextChange={txt =>
                setState(prevState => ({...prevState, mobileOTP: txt}))
              }
              keyboardType="numeric"
            />

            {/* <Text style={styles.labelVerify}>
              Enter 6-digit OTP sent to your email ID to verify the email ID
            </Text>

            <OTPTextView
              textInputStyle={styles.inputOTP}
              containerStyle={styles.otpContainer}
              inputCount={6}
              handleTextChange={txt =>
                setState(prevState => ({ ...prevState, emailOTP: txt }))
              }
              keyboardType="numeric"
            /> */}

            <Button
              id={'btnVerify'}
              label={'Verify'}
              isLoading={state.isLoading}
              onPress={() => validateForm('verify')}
            />

            <TouchableOpacity
              disabled={!state.resendButtonEnabled}
              onPress={handleResend}>
              <Text
                style={[
                  styles.labelVerify,
                  {
                    fontSize: 14,
                    color: state.resendButtonEnabled ? '#000' : '#d6d6d6',
                    textDecorationLine: 'underline',
                  },
                ]}>
                Resend OTP{' '}
                {resendTimer > 0 && (
                  <Text
                    style={[
                      styles.labelVerify,
                      {
                        fontSize: 14,
                        color: state.resendButtonEnabled ? '#000' : '#d6d6d6',
                      },
                    ]}>
                    ({resendTimer}s)
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  labelHeader: {
    color: '#000',
    fontSize: 22,

    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Outfit-Bold',
  },
  loginBackground: {
    height: 150,
    alignSelf: 'center',
    width: '80%',
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
});
