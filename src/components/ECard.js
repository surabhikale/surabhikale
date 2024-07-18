import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import Button from './Button';
import Popup from './Modal';

const ECard = ({show, onBackPress}) => {
  const id = useSelector(state => state.id.value);
  const user = useSelector(state => state.user.value);
  return (
    <Popup
      show={show}
      onBackPress={onBackPress}
      label={'My E-Card'}
      height={550}
      body={
        <>
          <FastImage
            source={{
              uri: id?.id_card_logo,
            }}
            style={styles.idImage}
          />
          <FastImage
            source={{uri: user.qrcode_url_image}}
            style={[
              styles.idUserQRImage,
              {
                top: `${id?.member_qr_position_top}%`,
                left: `${id?.member_qr_position_right}%`,
              },
            ]}
          />
          <FastImage
            source={{uri: user.profile_image}}
            style={[
              styles.idUserImage,
              {
                top: `${id?.member_photo_position_top}%`,
                left: `${id?.member_photo_position_right}%`,
              },
            ]}
          />
          <Text
            style={[
              styles.idUserEmail,
              {
                top: `${id?.member_id_position_top}%`,
                left: `${id?.member_id_position_right}%`,
              },
            ]}>
            {user.alternate_id}
          </Text>
          <Text
            style={[
              styles.idUsername,
              {
                top: `${id?.member_name_position_top}%`,
                left: `${id?.member_name_position_right}%`,
              },
            ]}>
            {user.first_name} {user.last_name}
          </Text>
          <Text
            style={[
              styles.idUserEmail,
              {
                top: `${id?.member_address_position_top}%`,
                left: `${id?.member_address_position_right}%`,
              },
            ]}>
            {user.email}
          </Text>
          <Text
            style={[
              styles.idUserMobile,
              {
                top: `${id?.member_mobile_position_top}%`,
                left: `${id?.member_mobile_position_right}%`,
              },
            ]}>
            {user.mobile}
          </Text>
          <Text
            style={[
              styles.idUserDOB,
              {
                top: `${id?.member_dob_position_top}%`,
                left: `${id?.member_dob_position_right}%`,
              },
            ]}>
            {user.dob}
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              id={'cancel'}
              label={'Close'}
              width={150}
              onPress={onBackPress}
            />
          </View>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  idImage: {
    resizeMode: 'cover',
    width: '80%',
    height: 400,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d6d6d6',
  },
  idUserQRImage: {
    resizeMode: 'cover',
    width: 80,
    height: 80,
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    position: 'absolute',
  },
  idUserImage: {
    resizeMode: 'cover',
    width: 120,
    height: 120,
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    position: 'absolute',
  },

  idUsername: {
    position: 'absolute',
    color: '#000',
    fontSize: 11,
    backgroundColor: '#fff',
    width: '35%',
    fontFamily: 'Outfit-Bold',
  },
  idUserEmail: {
    position: 'absolute',
    color: '#000',
    fontSize: 10,
    backgroundColor: '#fff',
    fontFamily: 'Outfit-Regular',
    top: '63%',
    left: '36%',
  },
  idUserMobile: {
    position: 'absolute',
    color: '#000',
    fontSize: 10,
    backgroundColor: '#fff',

    fontFamily: 'Outfit-Regular',
  },
  idUserDOB: {
    position: 'absolute',
    color: '#000',
    fontSize: 10,
    backgroundColor: '#fff',
    fontFamily: 'Outfit-Regular',
  },
});

export default ECard;
