import React from "react";
import {
  StyleSheet,
  TextInput,
  View
} from "react-native";

const customInputText = ({  placeholder  }) => { 

  return (
    <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}        
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
  );
};
const styles = StyleSheet.create({
  inputView: {
    gap:20,
    alignSelf: 'stretch',   
    paddingHorizontal:20, 
  },
  input: {
    height: 64,
    paddingHorizontal: 20,
    borderColor: '#1B83E3',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    fontFamily: 'Poppins-Regular',    
    fontWeight: '500', 
    fontSize:16,
    color:'background: rgba(98, 98, 98, 1)',
    backgroundColor:'rgba(27, 131, 227, 0.1)'
  },
});
export default customInputText;