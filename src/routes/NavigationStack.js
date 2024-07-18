import React from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Welcome from '../screens/Welcome';
import Register from '../screens/Register';
import Home from '../screens/Home';
//import DrawerNavigator from './DrawerNavigator';
const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

const options = { headerShown: false, animation: 'none' };

const NavigationStack = () => (
  <NavigationContainer ref={navigationRef}>
    <Stack.Navigator initialRouteName="Welcome">
    <Stack.Screen 
          name="Welcome" 
          component={Welcome} 
          options={{ headerShown: false }}
        />
      <Stack.Screen name="Splash" component={Splash} options={options} />
      <Stack.Screen name="Login" component={Login} options={options} />
      <Stack.Screen 
          name="Register" 
          component={Register} 
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
        />
     {/*  <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={options}
      /> */}
      
    </Stack.Navigator>
  </NavigationContainer>
);

export default NavigationStack;
