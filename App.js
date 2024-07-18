import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import NavigationStack from './src/routes/NavigationStack';
/*const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'SFProDisplay-Medium',
          fontWeight: '500',
        },
      }}>
      <Drawer.Screen
        name="welcome"
        component={WelcomeScreen}
        options={{
          drawerLabel: 'Home',
          title: 'Home',
        }}
      />
      <Drawer.Screen
        name="Article"
        component={LoginForm}
        options={{title: 'My Article'}}
      />
    </Drawer.Navigator>
  );
}
*/
export default function App() {
  return (
   
      <NavigationStack />
    
   
  );
}
