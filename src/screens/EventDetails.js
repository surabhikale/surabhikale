/* eslint-disable react-native/no-inline-styles */
import {
  TouchableOpacity,
  FlatList,
  Text,
  View,
  StyleSheet,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import BackIcon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {fetchGet, fetchPost} from '../services/apiService';
import {useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {EVENT_DETAILS, EVENT_REGISTER_TRANSACTION} from '../globals';
import Arrows from 'react-native-vector-icons/Entypo';
import Entypo from 'react-native-vector-icons/Entypo';
import Header from '../components/Header';
import {Picker} from '@react-native-picker/picker';
import Input from '../components/TextInput';
import Button from '../components/Button';
import FastImage from 'react-native-fast-image';
import RenderHtml from 'react-native-render-html';
import {WebView} from 'react-native-webview';

export default function EventDetails({route}) {
  const navigation = useNavigation();

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const {id, enrolled, message} = route.params;

  const user = useSelector(state => state.user.value);
  const toast = useToast();
  const [state, setState] = useState({
    eventDetails: [],
    isLoading: true,
    paymentMethod: ['Online', 'Cash', 'Cheque'],
    selectedPaymentMethod: 0,
    transactionNumber: '',
  });
  const [key, setKey] = useState(false);

  async function fetchEventDetails() {
    // console.log('$$$$ ITEMss', id);
    setState(prevState => ({
      ...prevState,
      isLoading: true,
      transactionNumber: '',
    }));

    await fetch(
      'https://yourclubworld.com/api/public/v1/getalleventsdetailsbyid/' + id,
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + user.token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
        }),
      },
    )
      .then(response => {
        response.json().then(data => {
          console.log('Response-->', data);
        });
      })
      .catch(error => {
        this.setState({showLoader: false});
      });
    // try {
    //   const response = await fetchPost(
    //     'https://yourclubworld.com/api/public/v1/getalleventsdetailsbyid/' + id,
    //     {
    //       'Content-Type': 'application/json',
    //       Authorization: 'Bearer ' + user.token,
    //     },
    //     {
    //       user_id: user?.id,
    //     },
    //   );
    //   if (response?.data) {
    //     setState(prevState => ({
    //       ...prevState,
    //       eventDetails: response.data,
    //       isLoading: false,
    //     }));
    //   } else {
    //     setState(prevState => ({...prevState, isLoading: false}));
    //     toast.show('No Event Details Found', {
    //       type: 'warning',
    //     });
    //   }
    // } catch (error) {
    //   console.log('Erro ITEMss', error);
    //   setState(prevState => ({...prevState, isLoading: false}));
    //   toast.show('No Event Details Found !', {
    //     type: 'warning',
    //   });
    // }
  }

  const register = async () => {
    setState(prevState => ({...prevState, isLoading: true}));

    const formData = {};
    let totalAmount = 0;
    for (const item of state.eventDetails?.event_inpackage_data) {
      totalAmount += parseInt(item.totalAmt || 0, 10);
      formData[item.package_label] = item.selectedPerson || '';
    }

    if (totalAmount < 1) {
      toast.show('Please select valid reservations !', {
        type: 'warning',
      });
      return false;
    }

    if (state.transactionNumber.length < 1) {
      toast.show('Please enter valid transaction number !', {
        type: 'warning',
      });
      return false;
    }

    setState(prevState => ({...prevState, isLoading: true}));

    try {
      const response = await fetchPost(
        EVENT_REGISTER_TRANSACTION,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
        {
          user_id: user?.id,
          event_id: state.eventDetails?.id,
          tenant_id: state.eventDetails?.tenant_id,
          amount: totalAmount,
          payment_type: state.selectedPaymentMethod,
          transaction_description: state.transactionNumber,
          form_data: [formData],
        },
      );
      if (response?.data?.id) {
        setState(prevState => ({...prevState, isLoading: false}));
        toast.show('Registration Successful', {
          type: 'success',
        });
        navigation.goBack();
      } else {
        setState(prevState => ({...prevState, isLoading: false}));
        toast.show(response?.message, {
          type: 'warning',
        });
      }
    } catch (error) {
      setState(prevState => ({...prevState, isLoading: false}));
      toast.show('Unable to register, Please try again !', {
        type: 'warning',
      });
    }
  };
  const tagsStyles = {
    p: {
      whiteSpace: 'normal',
      color: '#000',
      margin: 0,
    },
    span: {
      whiteSpace: 'normal',
      color: '#000',
      margin: 0,
    },
    h1: {
      whiteSpace: 'normal',
      color: '#000',
      margin: 0,
    },
    h2: {
      whiteSpace: 'normal',
      color: '#000',
      margin: 0,
    },
    h3: {
      whiteSpace: 'normal',
      color: '#000',
      margin: 0,
    },
    h4: {
      whiteSpace: 'normal',
      color: '#000',
      margin: 0,
    },
    h5: {
      whiteSpace: 'normal',
      color: '#000',
      margin: 0,
    },
    h6: {
      whiteSpace: 'normal',
      color: '#000',
      margin: 0,
    },
    li: {
      whiteSpace: 'normal',
      color: '#000',
      margin: 0,
    },
    ul: {
      whiteSpace: 'normal',
      color: '#000',
      margin: 0,
    },
  };

  const renderDetailsData = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            item.collapsed = !item.collapsed;
            setKey(!key);
          }}
          style={{
            alignSelf: 'center',
            width: '90%',
            backgroundColor: '#fff',
            overflow: 'hidden',
            borderRadius: 20,
            borderWidth: 0.3,
            padding: 10,
            elevation: 1,
            margin: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            zIndex: 1,
          }}>
          <Text
            style={{
              color: '#000',
              fontSize: 15,
              fontFamily: 'Outfit-Regular',
              alignSelf: 'center',
              zIndex: 10,
              width: '80%',
            }}>
            {index + 1}) {item.event_title}
          </Text>

          <Arrows
            size={25}
            color="#000"
            name={item.collapsed ? 'chevron-small-up' : 'chevron-small-down'}
          />
        </TouchableOpacity>
        {item.collapsed && (
          <View
            style={{
              borderRadius: 20,
              borderLeftWidth: 0.3,
              borderBottomWidth: 0.3,
              borderRightWidth: 0.3,
              width: '88%',
              alignSelf: 'center',
              padding: 15,
              marginTop: -10,
              backgroundColor: '#fff',
              marginBottom: 20,
            }}>
            {/* <Text
              style={{
                color: '#000',
                fontFamily: 'Outfit-Regular',
              }}> */}
            {/* {item.event_description} */}
            <RenderHtml
              source={{html: item.event_description}}
              tagsStyles={tagsStyles}
            />
            {/* </Text> */}
          </View>
        )}
      </>
    );
  };

  const renderPackageData = ({item, index}) => {
    return (
      <View
        style={{
          borderColor: '#d6d6d6',
          borderWidth: 1,
          width: '90%',
          color: '#000',
          alignSelf: 'center',
          borderRadius: 10,
          margin: 5,
          flexDirection: 'row',
        }}>
        <Text
          style={{
            color: '#000',
            textAlign: 'center',
            textAlignVertical: 'center',
            fontFamily: 'Outfit-Regular',
            padding: 10,
            width: '35%',
          }}>
          {item.package_label} {'\n'} ( ₹ {item.package_price} )
        </Text>

        <Text
          style={{
            color: '#000',
            textAlign: 'center',
            textAlignVertical: 'center',
            fontFamily: 'Outfit-Regular',
            padding: 5,
          }}>
          x
        </Text>
        <Picker
          itemStyle={{height: 40}}
          style={{
            borderColor: '#d6d6d6',
            borderWidth: 1,
            borderRadius: 20,
            width: '30%',
            color: '#000',
            alignSelf: 'center',
            margin: 5,
            fontFamily: 'Outfit-Regular',
            backgroundColor: '#f6f6f6',
          }}
          pickerStyle={{fontFamily: 'Outfit-Regular'}}
          selectedValue={item.selectedPerson}
          onValueChange={(itemValue, itemIndex) => {
            item.selectedPerson = itemValue;
            item.totalAmt =
              parseInt(item.selectedPerson || 0) *
              parseInt(item.package_price || 0);
            setKey(!key);
            getTotal();
          }}>
          <Picker.Item label="0" value="0" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
        </Picker>
        <Text
          style={{
            color: '#000',
            textAlign: 'center',
            textAlignVertical: 'center',
            fontFamily: 'Outfit-Regular',
            padding: 5,
          }}>
          =
        </Text>
        <Text
          style={{
            color: '#000',
            textAlign: 'center',
            textAlignVertical: 'center',
            fontFamily: 'Outfit-Regular',
            padding: 5,
          }}>
          {parseInt(item.selectedPerson || 0) *
            parseInt(item.package_price || 0)}
        </Text>
      </View>
    );
  };

  function getTotal() {
    const totalPackagePrice = state.eventDetails?.event_inpackage_data?.reduce(
      (acc, item) => acc + (item.totalAmt || 0),
      0,
    );
    return totalPackagePrice || 0;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header
        label={state.eventDetails.event_name}
        color={'#fff'}
        leftIcon={
          <BackIcon
            size={25}
            color="#fff"
            name="chevron-back"
            onPress={() => navigation.goBack()}
          />
        }
      />

      <FastImage
        source={{uri: state.eventDetails.event_image}}
        style={styles.headerImage}
      />

      <View style={styles.infoCard}>
        <Text
          style={[
            styles.infoLabel,
            {
              color: enrolled === 'enrolled' ? '#77DD77' : '#000',
              fontSize: enrolled === 'enrolled' ? 16 : 18,
            },
          ]}>
          {enrolled === 'enrolled' ? message : 'Signup for this event'}
        </Text>

        {state.eventDetails?.user_accommodation && (
          <Text
            style={[
              styles.infoLabel,
              {
                color: '#000',
                fontFamily: 'Outfit-Regular',
                fontSize: 15,
                borderBottomWidth: 0.5,
                paddingBottom: 15,
                paddingTop: 15,
              },
            ]}>
            Accommodation : {state.eventDetails.user_accommodation}
          </Text>
        )}

        <Text
          style={{
            color: '#000',
            fontSize: 16,
            fontFamily: 'Outfit-Regular',
            zIndex: 1,
            padding: 5,
          }}>
          Venue : {state.eventDetails.event_venue}
        </Text>
        <Text
          style={{
            color: '#000',
            fontSize: 16,
            fontFamily: 'Outfit-Regular',
            zIndex: 1,
            padding: 5,
          }}>
          Time : {state.eventDetails.event_actual_time}
        </Text>
        <Text
          style={{
            color: '#000',
            fontSize: 16,
            fontFamily: 'Outfit-Regular',
            zIndex: 1,
            padding: 5,
          }}>
          Pre Registration Due Date:{' '}
          {state.eventDetails.event_pre_registration_date}
        </Text>
        <Text
          style={{
            color: '#000',
            fontSize: 14,
            fontFamily: 'Outfit-Regular',
            zIndex: 1,
            padding: 5,
          }}>
          Schedule: {state.eventDetails.event_schedule_date}
        </Text>
        {enrolled !== 'enrolled' &&
          (state.eventDetails?.in_package?.includes('paid') ||
            state.eventDetails?.in_package?.includes('Paid')) && (
            <>
              <Text
                style={{
                  color: '#d6d6d6',
                  fontSize: 15,
                  fontFamily: 'Outfit-Bold',
                  zIndex: 1,
                  marginTop: 15,
                }}>
                Joining Fee :
              </Text>
              {state.eventDetails?.event_inpackage_data?.map(item => {
                return (
                  <Text
                    style={{
                      color: '#6564DB',
                      fontSize: 16,
                      fontFamily: 'Outfit-Regular',
                      zIndex: 1,
                      marginTop: 8,
                    }}>
                    {item.package_label} - ₹ {item.package_price}
                  </Text>
                );
              })}
            </>
          )}
      </View>

      <View>
        {enrolled !== 'enrolled' &&
          (state.eventDetails?.in_package?.includes('paid') ||
            state.eventDetails?.in_package?.includes('Paid')) && (
            <>
              <Text
                style={{
                  color: '#000',
                  fontSize: 15,
                  fontFamily: 'Outfit-Bold',
                  padding: 20,
                }}>
                I would like to join this event and reserve a place for :
              </Text>

              <FlatList
                data={state.eventDetails?.event_inpackage_data}
                renderItem={renderPackageData}
                keyExtractor={item => item.id}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '65%',
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 14,
                    fontFamily: 'Outfit-Bold',
                    padding: 10,
                  }}>
                  Total amount payable by you is
                </Text>
                <Text
                  key={Date.now()}
                  style={{
                    color: '#085EA9',
                    fontSize: 18,
                    fontFamily: 'Outfit-Bold',
                    alignSelf: 'center',
                    padding: 6,
                    borderRadius: 10,
                    justifyContent: 'center',
                    borderColor: '#d6d6d6',
                    borderWidth: 1,
                  }}>
                  ₹ {getTotal()}
                </Text>
              </View>

              {/* <Text
            style={{
              color: '#000',
              fontSize: 14,
              fontFamily: 'Outfit-Bold',
              padding: 10,
            }}>
            Choose Payment Method
          </Text> */}

              {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              margin: 12,
            }}>
            {state.paymentMethod.map((data, key) => {
              return (
                <View key={key}>
                  {state.selectedPaymentMethod === key ? (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        margin: 15,
                      }}>
                      <BackIcon
                        size={25}
                        color="#085EA9"
                        name="radio-button-on"
                        style={{alignSelf: 'center'}}
                      />
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 15,
                          fontFamily: 'Outfit-Regular',
                          textAlignVertical: 'center',
                          padding: 5,
                        }}>
                        {data}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setState(prevState => ({
                          ...prevState,
                          selectedPaymentMethod: key,
                        }));
                      }}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        margin: 15,
                      }}>
                      <BackIcon
                        size={25}
                        color="#000"
                        name="radio-button-off"
                        style={{alignSelf: 'center'}}
                      />
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#000',
                          fontFamily: 'Outfit-Regular',
                          textAlignVertical: 'center',
                          padding: 5,
                        }}>
                        {data}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View> */}

              <Text
                style={{
                  color: '#000',
                  fontSize: 15,
                  fontFamily: 'Outfit-Regular',
                  padding: 15,
                }}>
                Please enter your Transaction reference no. in the field given
                below
              </Text>

              <Input
                id={'Transaction Number'}
                defaultValue={state.transactionNumber}
                placeholder="Transaction number"
                onChangeText={txt => {
                  setState(prevState => ({
                    ...prevState,
                    transactionNumber: txt,
                  }));
                }}
              />
              <Text
                style={{
                  color: '#000',
                  fontSize: 15,
                  fontFamily: 'Outfit-Regular',
                  padding: 15,
                  paddingHorizontal: 20,
                }}>
                By clicking the SignUp button below, you confirm that you have
                paid the full amount via bank transfer as per Payment Details
                given below.
              </Text>
            </>
          )}

        {enrolled !== 'enrolled' && (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 10,
              }}>
              <Button
                id={'resetBtn'}
                label={'Reset'}
                width={120}
                fontSize={15}
                onPress={() => fetchEventDetails()}
              />

              <Button
                id={'submitBtn'}
                label={'Submit'}
                width={120}
                fontSize={15}
                bg={'#1aee40'}
                onPress={() => register()}
                isLoading={state.isLoading}
              />
            </View>
          </>
        )}

        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              width: '50%',
              color: '#000',
              fontSize: 18,
              fontFamily: 'Outfit-Bold',
              zIndex: 1,
              padding: 20,
            }}>
            Event Details
          </Text>
          {state.eventDetails?.event_itinerary && (
            <TouchableOpacity
              style={{width: '50%'}}
              onPress={() =>
                Linking.openURL(state.eventDetails?.event_itinerary)
              }>
              <Text
                style={{
                  color: 'blue',
                  fontSize: 15,
                  fontFamily: 'Outfit-Bold',
                  zIndex: 1,
                  textAlign: 'right',
                  padding: 20,
                }}>
                <Entypo size={20} color="blue" name={'download'} /> Download
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={state.eventDetails?.event_details_data}
          renderItem={renderDetailsData}
          keyExtractor={item => item.id}
        />
      </View>
      {state.eventDetails?.event_location != ('#' || null) && (
        <>
          <Text
            style={{
              width: '50%',
              color: '#000',
              fontSize: 18,
              fontFamily: 'Outfit-Bold',
              zIndex: 1,
              padding: 20,
            }}>
            Location
          </Text>
          <View
            style={{
              width: '90%',
              height: 250,
              borderWidth: 0.5,
              borderRadius: 20,
              elevation: 15,
              marginTop: 10,
              backgroundColor: '#fff',
              alignSelf: 'center',
              overflow: 'hidden',
            }}>
            <WebView
              key={state.eventDetails?.event_location}
              style={{
                height: '100%',
                width: '100%',
                alignSelf: 'center',
              }}
              originWhitelist={['*']}
              source={{
                html: `<iframe id="inlineFrameExample" title="location" style="margin:20px " width="100%" height="100%" src=${state.eventDetails?.event_location}/> </iframe>`,
              }}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  headerImage: {
    resizeMode: 'cover',
    width: '100%',
    height: 400,
    position: 'absolute',
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
  },
  infoCard: {
    width: '85%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: 250,
    borderRadius: 20,
    elevation: 10,
    padding: 10,
  },
  infoLabel: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    zIndex: 1,
  },
});
