/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BottomBar from '../components/BottomBar';
import ECard from '../components/ECard';
import { useSelector } from 'react-redux';
import { fetchPost } from '../services/apiService';
import { GETMESSAGEDETAILS, UPDATEMESSAGE } from '../globals';
import RenderHtml from 'react-native-render-html';

export default function MessageCenter() {
  useEffect(() => { }, []);
  const navigation = useNavigation();
  const user = useSelector(state => state.user.value);

  const [state, setState] = useState({
    events: [],
    isLoading: true,
    eventMessageDetails: [],
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchDetails();
    }, []),
  );

  async function fetchDetails() {
    setState(prevState => ({ ...prevState, isLoading: true }));
    try {
      const response = await fetchPost(
        GETMESSAGEDETAILS,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
        {
          user_id: user.id,
          tenant_id: user.tenant_id,
        },
      );
      if (response?.data) {
        setState(prevState => ({
          ...prevState,
          eventMessageDetails: response.data,
          isLoading: false,
        }));
        updateMessage();
      } else {
        setState(prevState => ({ ...prevState, isLoading: false }));
        // toast.show('No Users Found !', {
        //   type: 'warning',
        // });
      }
    } catch (error) {
      setState(prevState => ({ ...prevState, isLoading: false }));
      // toast.show('No Users Found !!!', {
      //   type: 'warning',
      // });
    }
  }
  async function updateMessage() {
    setState(prevState => ({ ...prevState, isLoading: true }));
    try {
      const response = await fetchPost(
        UPDATEMESSAGE,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
        {
          user_id: user.id,
          tenant_id: user.tenant_id,
        },
      );
      if (response) {
        setState(prevState => ({
          ...prevState,
          isLoading: false,
        }));
      } else {
        setState(prevState => ({ ...prevState, isLoading: false }));
        // toast.show('No Users Found !', {
        //   type: 'warning',
        // });
      }
    } catch (error) {
      setState(prevState => ({ ...prevState, isLoading: false }));
      // toast.show('No Users Found !!!', {
      //   type: 'warning',
      // });
    }
  }

  function convertTimestamp(timestamp) {
    const givenTimestamp = new Date(`${timestamp}`);
    const localTime = givenTimestamp.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    const options = {
      year: '2-digit',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    const formattedDateString = givenTimestamp.toLocaleDateString(
      'en-US',
      options,
    );
    // .replace(',', '') // Remove the comma after the day

    const dateArray = formattedDateString.split(' ');

    // Capitalize the first letter of the month abbreviation
    const capitalizedMonth =
      dateArray[1].charAt(0).toUpperCase() + dateArray[1].slice(1);

    // Concatenate the formatted date and time
    const formattedDate = `${dateArray[0]
      } ${capitalizedMonth} '${dateArray[2].slice(-3)} ${localTime}`;

    return formattedDate;
  }
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

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
      }}>
      <ECard
        show={state.showID}
        onBackPress={() =>
          setState(prevState => ({ ...prevState, showID: false }))
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
        label={'Message Center'}
      />
      <View>
        {state.isLoading ? (
          <ActivityIndicator size={'large'} style={{ marginTop: '20%' }} />
        ) : (
          <FlatList
            data={state.eventMessageDetails}
            style={{ height: '85%' }}
            renderItem={({ item }) => (
              <View
                key={item.id}
                style={{
                  width: '90%',
                  // height: 70,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  alignSelf: 'center',
                  elevation: 15,
                  marginTop: 15,
                  backgroundColor: '#fff',
                  // flexDirection: 'row',
                }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginHorizontal: 20,
                    flexDirection: 'row',
                  }}>
                  <Text style={{ textAlign: 'left', color: '#000' }}>
                    New Message
                  </Text>
                  <Text style={{ textAlign: 'right', color: '#000' }}>
                    {convertTimestamp(
                      item.event_message_center_data.created_at,
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    width: '95%',
                    marginBottom: 20,
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#0185CA',
                      fontSize: 20,
                      fontFamily: 'Outfit-Bold',
                      width: '90%',
                      marginTop: 15,
                    }}>
                    {item.event_message_center_data.message_title}
                  </Text>
                  <Text
                    // onPress={() =>
                    //   Linking.openURL(`tel:${item.collective_mobile_no}`)
                    // }
                    numberOfLines={1}
                    style={{
                      color: '#000',
                      fontSize: 14,
                      fontWeight: '800',
                      width: '90%',
                      fontFamily: 'Outfit-Regular',
                      // marginTop: 5,
                    }}>
                    {item.event_message_center_data.message_type} :{' '}
                    {item.event_message_center_data.is_all_paid_member}
                  </Text>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderColor: '#d6d6d6',
                      width: '95%',
                      marginVertical: 8,
                    }}
                  />
                  {item.event_message_center_data.message_image && (
                    <FastImage
                      source={{
                        uri: item.event_message_center_data.message_image,
                      }}
                      style={styles.messageimage}
                    />
                  )}
                  <RenderHtml
                    source={{
                      html: item.event_message_center_data.message_content,
                    }}
                    tagsStyles={tagsStyles}
                    contentWidth={"100%"}
                  />

                  {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, }}>
                    <FastImage
                      source={{
                        uri: item.event_message_center_data.message_image,
                      }}
                      style={styles.messageimage}
                    />
                    <View style={{ width: "60%" }}>
                      <RenderHtml
                        source={{ html: item.event_message_center_data.message_content }}
                        tagsStyles={tagsStyles}
                        contentWidth={"100%"}
                      />
                    </View>
                  </View> */}
                  {item.event_message_center_data.document_link && (
                    <View
                      style={{
                        alignSelf: 'flex-start',
                        marginHorizontal: 10,
                        paddingBottom: 10,
                      }}>
                      <Text
                        // onPress={() =>
                        //   Linking.openURL(`tel:${item.event_message_center_data.document_link}`)
                        // }
                        numberOfLines={1}
                        style={{
                          color: '#0185CA',
                          fontSize: 14,
                          fontWeight: '900',
                          width: '90%',
                          fontFamily: 'Outfit-Regular',
                          // marginTop: 5,
                        }}>
                        Related Downloads :
                      </Text>
                      <Text
                        onPress={() =>
                          Linking.openURL(
                            `${item.event_message_center_data.document_link}`,
                          )
                        }
                        numberOfLines={1}
                        style={{
                          color: '#0185CA',
                          fontSize: 14,
                          fontWeight: '500',
                          width: '90%',
                          fontFamily: 'Outfit-Regular',
                          marginHorizontal: 10,
                          // marginTop: 5,
                        }}>
                        {item.event_message_center_data.document_link}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          />
        )}
      </View>
      <BottomBar
        activeTab={'MessageCenter'}
        navigation={navigation}
        onCardPress={() =>
          setState(prevState => ({ ...prevState, showID: true }))
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  messageimage: {
    width: '40%',
    height: 120,
    // backgroundColor: "#000",
    borderRadius: 5,
    marginBottom: 10,
  },
});
