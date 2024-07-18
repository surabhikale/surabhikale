import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Linking} from 'react-native';
import Button from './Button';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {ADMIN_ID, COMMITTEE_MEMBER_ID} from '../globals';
import {useSelector} from 'react-redux';
const EventListItem = React.memo(({item, navigation, activeCategory}) => {
  const [showEntryButton, setShowEntryButton] = useState(false);
  const user = useSelector(state => state.user.value);
  useEffect(() => {
    const parseEventDates = dates => {
      return dates.split(',').map(date => {
        const dateParts = date.trim().split(' to ');
        if (dateParts.length === 1) {
          return new Date(dateParts[0]);
        } else if (dateParts.length === 2) {
          const startDate = new Date(dateParts[0]);
          const endDate = new Date(dateParts[1]);
          return {startDate, endDate};
        }
        return null;
      });
    };

    // const eventTime = moment.utc(item.event_actual_time, 'hh:mm A').toDate();
    const today = new Date();
    const formattedTime = `${today.toISOString().slice(0, 10)} ${
      item.event_actual_time
    }`;
    const eventTime = moment.utc(formattedTime, 'YYYY-MM-DD hh:mm A').toDate();

    const currentTime = moment.utc(item.current_time).toDate();

    const eventScheduleDates = parseEventDates(item.event_schedule_date);

    const currentDate = currentTime.toISOString().split('T')[0];

    const dateMatches = eventScheduleDates.some(date => {
      if (item.event_schedule === 'Continuous') {
        // For continuous events
        if (date.startDate && date.endDate) {
          return (
            currentDate >= date.startDate.toISOString().split('T')[0] &&
            currentDate <= date.endDate.toISOString().split('T')[0]
          );
        }
      } else {
        // For other event types
        const parsedDate = Date.parse(date);
        return (
          !isNaN(parsedDate) &&
          new Date(parsedDate).toISOString().split('T')[0] === currentDate
        );
      }
      return false;
    });
    const timeDifferences = eventTime - currentTime;
    const timeDifferenceInMinutes = timeDifferences / 60000;

    // if (item.event_name === 'Invitaion Ceremony Kite Flying') {
    //   console.log('Time Diff', timeDifferenceInMinutes);
    // }

    if (
      dateMatches &&
      timeDifferenceInMinutes > 0 &&
      timeDifferenceInMinutes < 60
    ) {
      setShowEntryButton(true);
    } else {
      setShowEntryButton(false);
      // setShowEntryButton(true);
    }
  }, [
    item.current_time,
    item.event_actual_time,
    item.event_schedule_date,
    item.event_schedule,
  ]);

  function navigateToDetails() {
    console.log('$$$$ ITEM', item.id);
    // return false;
    navigation.navigate('EventDetails', {
      id: item.id,
      enrolled: item.sign_button_visible,
      message: item.user_transaction_message,
    });
  }

  return (
    <TouchableOpacity
      key={item.id}
      onPress={() => navigateToDetails()}
      style={styles.eventCard}>
      <View style={{flexDirection: 'row'}}>
        <View style={{width: '40%'}}>
          <FastImage
            source={{uri: item.event_image}}
            style={styles.eventImage}
          />
        </View>

        <View style={{width: '60%', marginLeft: 20}}>
          <Text numberOfLines={2} style={styles.eventTitleLabel}>
            {item.event_name}
          </Text>

          <Text numberOfLines={1} style={styles.eventTimeLabel}>
            {item.event_actual_time}
          </Text>

          <Text numberOfLines={2} style={styles.eventVenueLabel}>
            {item.event_venue}
          </Text>

          {(activeCategory === 'Upcoming' || activeCategory === 'All') && (
            <View style={styles.btnContainer}>
              {item.sign_button_visible !== 'enrolled' && !showEntryButton && (
                <Button
                  id={'updateBtn'}
                  label={
                    item.sign_button_visible === 'no' ? 'Enroll' : 'Sign Up'
                  }
                  width={80}
                  fontSize={14}
                  onPress={() => navigateToDetails()}
                />
              )}

              {(user.role_id === ADMIN_ID ||
                user.role_id === COMMITTEE_MEMBER_ID) &&
                showEntryButton && (
                  <Button
                    id={'updateBtn'}
                    label={'Entry'}
                    onPress={() =>
                      navigation.navigate('EnrolledUsers', {
                        id: item.id,
                        title: item.event_name,
                      })
                    }
                    width={70}
                    fontSize={14}
                  />
                )}
            </View>
          )}

          {activeCategory === 'Past' && item.event_drive_link && (
            <View style={styles.btnContainer}>
              <Button
                id={'updateBtn'}
                label={'View Gallery'}
                width={120}
                fontSize={14}
                onPress={() => Linking.openURL(`${item.event_drive_link}`)}
              />
            </View>
          )}
        </View>
      </View>
      <Text numberOfLines={2} style={styles.eventScheduleLabel}>
        Schedule : {item.event_schedule_date}
      </Text>
      {item.user_transaction_message !== '' && (
        <Text numberOfLines={2} style={styles.transactionMessage}>
          <Feather
            name="info"
            size={15}
            style={{alignSelf: 'center'}}
            color={'#77DD77'}
          />{' '}
          {item.user_transaction_message}
        </Text>
      )}
    </TouchableOpacity>
  );
});

export default EventListItem;

const styles = StyleSheet.create({
  eventCard: {
    width: '90%',
    borderRadius: 15,
    alignSelf: 'center',
    elevation: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    marginBottom: 5,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  transactionMessage: {
    color: '#77DD77',
    fontSize: 12,
    width: '90%',
    fontFamily: 'Outfit-Regular',
    marginTop: 5,
    paddingHorizontal: 15,
  },
  shimmerCard: {
    flexDirection: 'row',
    padding: 10,
    width: '90%',
    height: 180,
    borderRadius: 15,
    alignSelf: 'center',
    elevation: 15,
    marginTop: 15,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  shimmerLines: {
    borderRadius: 10,
    height: 25,
    marginTop: 10,
  },
  eventImage: {
    resizeMode: 'cover',
    width: '100%',
    height: 145,
    margin: 10,
    borderRadius: 10,
  },
  eventTitleLabel: {
    color: '#000',
    fontSize: 15,
    fontFamily: 'Outfit-Bold',
    width: '90%',
    marginTop: 15,
  },
  eventTimeLabel: {
    color: '#0185CA',
    fontSize: 13,
    width: '90%',
    fontFamily: 'Outfit-Regular',
    marginTop: 5,
  },
  eventVenueLabel: {
    color: '#000',
    fontSize: 15,
    width: '90%',
    fontFamily: 'Outfit-Regular',
    marginTop: 5,
  },
  eventScheduleLabel: {
    color: '#000',
    fontSize: 14,
    width: '90%',
    fontFamily: 'Outfit-Regular',
    marginTop: 5,
    paddingHorizontal: 15,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%',
    marginTop: -10,
  },
});
