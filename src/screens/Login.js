import React, {useState} from 'react';
import {
  Alert,  
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
const logo = require('../assets/images/logoTransparent.png');
import CustomButton from '../componenHome/customButton';
const LoginForm = ({ navigation }) => { 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 
  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.innercontainer} >
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Login here</Text>
      <Text style={styles.subtitle}>Welcome back</Text>
      <Text style={styles.subtitle}>to Child Shield</Text>
      </View>
      <View style={styles.bottomcontainer} >
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Vehicle Number"
          value={username}
          onChangeText={setUsername}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.rememberView}>      
        <View>
          <Pressable onPress={() => Alert.alert('Forget Password!')}>
            <Text style={styles.forgetText}>Forgot Password?</Text>
          </Pressable>
        </View>
      </View>
      <CustomButton onPress={() => navigation.navigate('Home')} title="Login" />
      <View>
      <Pressable onPress={() => Alert.alert('help')}>
            <Text style={styles.footerText}>Help</Text>
          </Pressable>  
      </View>
      
      </View>
    </SafeAreaView>
  );
}

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
    marginBottom: 15,
  },
  logo: {
    marginTop:20,
    width: 236,
    height: 236,
    resizeMode: 'contain',
    
  },
  title: {
    fontFamily: 'Poppins-SemiBold', 
    fontSize: 25,
    fontWeight: '700', 
    lineHeight: 25,
    textAlign: 'center',
    color: '#ffffff',
    marginBottom:8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular', 
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25,
    textAlign: 'center',
    color: '#ffffff',
   
  },
  bottomcontainer:{
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  inputView: {
    gap:20,
    alignSelf: 'stretch',   
    paddingHorizontal:20, 
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: '#1B83E3',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    fontSize:16,
    color:'background: rgba(98, 98, 98, 1)',
    backgroundColor:'rgba(27, 131, 227, 0.1)'
  },
  rememberView: {
    width: '100%',  
    paddingHorizontal:20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
 
  rememberText: {
    fontSize: 13,
  },
  forgetText: {
    fontSize: 11,
    color: '#4383e3',
  },
  
  optionsText: {
    textAlign: 'center',
    paddingVertical: 10,
    color: 'gray',
    fontSize: 13,
    marginBottom: 6,
  },
  mediaIcons: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 23,
  },
  icons: {
    width: 40,
    height: 40,
  },
  footerText: {
    textAlign: 'center',
    color: 'gray',
  },
  signup: {
    color: '#4383e3',
    fontSize: 13,
  },
});
export default LoginForm;