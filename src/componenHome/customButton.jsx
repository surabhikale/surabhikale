

import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

const CustomButton = ({ onPress, title  }) => { 

  return (
    <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
    appButtonContainer: {
    alignSelf: 'stretch',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#1B83E3',
    shadowColor: 'rgba(27, 131, 227, 0.13)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    marginVertical:24, 
    marginHorizontal:20      
      },
      appButtonText: {
        fontFamily: 'Poppins-Bold', 
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 30,
        textAlign: 'center',
        color: '#ffffff',
        textAlign: 'center',
      }
});
export default CustomButton;