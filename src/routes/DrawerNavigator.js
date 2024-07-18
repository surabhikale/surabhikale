import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {APP_VERSION} from '../globals';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Dashboard from '../screens/Dashboard';
// import Modal from 'react-native-modal';
import Popup from '../components/Modal';
// Icon Imports
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../redux/slices/userSlice';
import FastImage from 'react-native-fast-image';
import Calendar from '../screens/Calendar';
import MessageCenter from '../screens/MessageCenter';
const Drawer = createDrawerNavigator();

function DrawerContentLogin(props) {
  //   const tenant = useSelector(state => state.tenant.value);
  const iconSize = 20;
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function logout() {
    dispatch(setUser({}));
    setShowLogoutModal(false);
    props.navigation.navigate('Login');
  }

  const id = useSelector(state => state.id.value);
  console.log('ID----->', id);

  return (
    <LinearGradient
      colors={['#0083C9', '#0069A6', '#004F83', '#003560', '#001B3D']}
      style={styles.linearGradient}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="true">
        <Popup
          show={showLogoutModal}
          onBackPress={() => setShowLogoutModal(false)}
          label={'Confirm Logout'}
          height={200}
          body={
            <>
              <Text style={styles.modalBodyLabel}>
                Are you sure you want to logout ?
              </Text>

              <View style={styles.buttonContainer}>
                <Button
                  id={'cancel'}
                  label={'Cancel'}
                  width={150}
                  onPress={() => setShowLogoutModal(false)}
                />
                <Button
                  id={'logout'}
                  label={'Logout'}
                  bg={'#FF6961'}
                  width={150}
                  onPress={() => logout()}
                />
              </View>
            </>
          }
        />

        <View style={styles.imageContainer}>
          <FastImage
            style={styles.tenantLogo}
            resizeMode="contain"
            // source={require('../assets/images/kyc.png')}
            source={{
              uri: id?.tenant_logo,
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Profile')}>
          <Feather name="user" size={iconSize} style={styles.itemIcon} />
          <Text style={styles.itemText}>My Profile</Text>
        </TouchableOpacity>

        <View style={styles.horizontalLine} />

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Events')}>
          <Feather name="calendar" size={iconSize} style={styles.itemIcon} />
          <Text style={styles.itemText}>Event Listing</Text>
        </TouchableOpacity>

        <View style={styles.horizontalLine} />

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Collections')}>
          <MaterialCommunityIcons
            name="office-building-marker-outline"
            size={iconSize}
            style={styles.itemIcon}
          />
          <Text style={styles.itemText}>Collection Center</Text>
        </TouchableOpacity>

        <View style={styles.horizontalLine} />

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Terms')}>
          <MaterialCommunityIcons
            name="file-document-outline"
            size={iconSize}
            style={styles.itemIcon}
          />
          <Text style={styles.itemText}>Terms & Conditions</Text>
        </TouchableOpacity>

        <View style={styles.horizontalLine} />

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Privacy')}>
          <MaterialCommunityIcons
            name="server-security"
            size={iconSize}
            style={styles.itemIcon}
          />
          <Text style={styles.itemText}>Privacy Policy</Text>
        </TouchableOpacity>

        <View style={styles.horizontalLine} />

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => setShowLogoutModal(true)}>
          <MaterialCommunityIcons
            name="logout"
            size={iconSize}
            style={styles.itemIcon}
          />
          <Text style={styles.itemText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <Text style={styles.versionLabel}>Version : {APP_VERSION}</Text>
    </LinearGradient>
  );
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={DrawerContentLogin}>
      <Drawer.Screen
        name="Dashboard"
        options={{headerShown: false}}
        component={Dashboard}
      />
      <Drawer.Screen
        name="Calendar"
        options={{headerShown: false}}
        component={Calendar}
      />
      <Drawer.Screen
        name="MessageCenter"
        options={{headerShown: false}}
        component={MessageCenter}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 20,
  },
  itemIcon: {marginLeft: 8, color: '#fff', paddingRight: 10},
  itemText: {color: '#fff', fontSize: 18, fontFamily: 'Outfit-Regular'},
  subItemsContainer: {marginLeft: 10},
  tenantText: {
    color: '#ffffff',
    paddingTop: 10,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },
  tenantLogo: {
    height: 100,
    width: 100,
  },
  tenantLogoContainer: {
    marginTop: 80,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 100,
    width: 160,
    height: 160,
  },
  versionLabel: {
    color: '#fff',
    fontSize: 10,
    width: '100%',
    height: 30,
    fontFamily: 'Outfit-Regular',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  linearGradient: {
    paddingLeft: 10,
    height: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 230,
    borderBottomRightRadius: 120,
    marginBottom: 50,
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    height: 200,
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
  modalBodyLabel: {
    fontFamily: 'Outfit-Regular',
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-around',
    alignSelf: 'center',
  },
});
