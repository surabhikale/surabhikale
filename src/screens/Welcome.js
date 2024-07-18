// WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
const logo = require('../assets/images/logoTransparent.png');
import CustomButton from '../componenHome/customButton';
const Welcome = ({ navigation }) => {
  return (    
    <View style={styles.container}>
      <View style={styles.innercontainer} >
      <Image source={logo} style={styles.logo} />
      <Text style={styles.welcomeText}>Welcome To</Text>
      <Text style={styles.welcomeText}>Child Shield</Text>
      </View>
      <View style={styles.bottomcontainer} >
      <CustomButton onPress={() => navigation.navigate('Login')} title="Login" />
      <CustomButton onPress={() => navigation.navigate('Register')} title="Register" />    
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  innercontainer:{   
    flex:2,
    backgroundColor: '#1B83E3',
    alignItems: 'center', 
    borderRadius: 26,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: '100%',
  },
  logo: {
    marginTop:20,
    width: 236,
    height: 236,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  welcomeText: {
    fontFamily: 'Poppins-SemiBold', // Ensure this matches the font file name
    fontSize: 25,
    fontWeight: '600', // Font weight is often inferred from the font file
    lineHeight: 37.5,
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 30,
  },
  bottomcontainer:{
    flex: 1.5,
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'white',

  },
 
});

export default Welcome;
