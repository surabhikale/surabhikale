import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';

const Input = ({ id, label, leftIcon, rightIcon, error, ...otherProps }) => {
  return (
    <View style={styles.container}>
     {/*  <Text
        style={{ color: '#0053B6', marginTop: 15, fontFamily: 'Outfit-Bold' }}>
        {otherProps.placeholder}
      </Text> */}
      <View style={styles.subContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <View style={styles.leftIcon}>{leftIcon}</View>
          </View>
        )}
<View style={styles.inputWrapper}>
          <TextInput
            key={id}
            style={styles.input}
            placeholderTextColor={'#626262'}
            {...otherProps}
          />
          {rightIcon && (
            <View style={styles.rightIconContainer}>
              <View style={styles.rightIcon}>{rightIcon}</View>
            </View>
          )}
        </View>
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignSelf: 'center',
  },
  subContainer: {
    gap: 20,
    alignSelf: 'stretch',   
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIconContainer: {
    marginLeft: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#1B83E3',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',    
    fontWeight: '500', 
    fontSize: 16,
    color: 'rgba(98, 98, 98, 1)',
  },
  leftIcon: {
    width: 24,
    height: 24,
  },
  rightIconContainer: {
    marginLeft: 10,
  },
  rightIcon: {
    width: 24,
    height: 24,
  },
  errorContainer: {
    paddingLeft: 1,
  },
  error: {
    fontFamily: 'Poppins-Regular',    
    fontWeight: '500', 
    fontSize: 12,
    color: '#ff0000',
  },
});


export default Input;
