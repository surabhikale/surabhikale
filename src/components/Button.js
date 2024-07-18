/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const Button = ({ id, label, onPress, isLoading, width, bg, fontSize }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={['#0097DA', '#085EA9']}
        key={id}
        style={[
          styles.btnContainer,
          { width: width ? width : '70%', backgroundColor: bg ? bg : '#085EA9' },
        ]}>
        {isLoading ? (
          <ActivityIndicator
            size={'small'}
            style={{
              padding: 8,
            }}
            color="#fff"
          />
        ) : (
          <Text
            style={[styles.labelStyle, { fontSize: fontSize ? fontSize : 16 }]}>
            {label}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    borderRadius: 12,
    width: '70%',
    height: 40,
    backgroundColor: '#085EA9',
    alignSelf: 'center',
    marginVertical: 20,
  },
  labelStyle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 40,
    fontFamily: 'Outfit-Regular',
  },
});

export default Button;
