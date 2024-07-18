import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
const Header = ({
  label,
  leftIcon,
  rightIcon,
  onPressLeft,
  onPressRight,
  color,
}) => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="#fff"
        translucent={false}
      />
      <View style={styles.leftIconContainer}>
        {leftIcon && (
          <TouchableOpacity style={styles.leftIcon} onPress={onPressLeft}>
            {leftIcon}
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, {color: color ? color : '#000'}]}>
          {label}
        </Text>
      </View>
      <View style={styles.rightIconContainer}>
        {rightIcon && (
          <TouchableOpacity style={styles.rightIcon} onPress={onPressRight}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    zIndex: 1,
    marginTop: Platform.OS === 'ios' ? 40 : 0,
  },
  leftIconContainer: {
    justifyContent: 'center',
    marginLeft: 15,
    width: 30,
    marginTop: 8,
  },
  leftIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 19,
    fontFamily: 'Outfit-Bold',
    color: '#000',
    width: '90%',
    textAlign: 'center',
    marginTop: 8,
  },
  rightIconContainer: {
    justifyContent: 'center',
    marginRight: 10,
    width: 30,
  },
  rightIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
});
export default Header;
