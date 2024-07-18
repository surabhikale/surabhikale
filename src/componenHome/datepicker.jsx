import React, { useState } from 'react';
import { View, Button, Text, StyleSheet,TouchableOpacity  } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DatePickerComponent = ({}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={showDatePicker} style={styles.iconButton}>
        <MaterialCommunityIcons name="calendar-month-outline" color="#4383e3" size={30} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'white',
    borderWidth:1,
    borderRadius:2,
    borderColor:'#4f9ce9',
    margin:5
  },
  iconButton: {
    padding: 10, 
    borderRadius: 50,
  },
  dateText: {
    color:'black',
    fontSize: 18,
    marginLeft: 10, // Add some margin to the left of the text
  },
});

export default DatePickerComponent;
