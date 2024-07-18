/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';

const Popup = ({show, onBackPress, label, body, height}) => {
  return (
    <Modal
      animationOut={'slideOutDown'}
      isVisible={show}
      coverScreen={true}
      onBackdropPress={onBackPress}
      backdropColor={'#003560'}
      style={{margin: 0}}>
      <View style={[styles.modalContainer, {height: height ? height : 500}]}>
        <Text style={styles.modalHeaderLabel}>{label}</Text>
        <View
          style={[
            styles.horizontalLine,
            {borderBottomColor: '#000', padding: 1},
          ]}
        />
        {body}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  horizontalLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#fff',
    padding: 5,
    width: '80%',
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    position: 'absolute',
    height: 500,
    width: '100%',
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  modalHeaderLabel: {
    fontFamily: 'Outfit-Bold',
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 12,
  },
});

export default Popup;
