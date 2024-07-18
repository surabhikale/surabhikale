import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const Dropdown = ({ options, onOptionSelected }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showOptions, setShowOptions] = useState(false);

  const filterOptions = (text) => {
    setSearchText(text);
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(text.toLowerCase())
      )
    );
    setShowOptions(true);
  };

  const onOptionPress = (option) => {
    setSearchText(option);
    onOptionSelected(option);
    setShowOptions(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
      <MaterialCommunityIcons name="van-passenger" color="#4383e3" size={30} style={styles.icon} />    
      <TextInput style={[styles.textInput]}
        value={searchText}
        onFocus={() => setShowOptions(true)}
        onChangeText={filterOptions}
        placeholder="VAN Number..."
      />
       <MaterialCommunityIcons name="chevron-down" color="#4383e3" size={30} style={styles.icon} />
      </View>
      {showOptions && (
        <FlatList style={[styles.dropdown]}
          data={filteredOptions}
          contentContainerStyle={{ height: 150 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onOptionPress(item)}
              style={{ height: 30 }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      )}
    
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    
    padding: 2,
   
    height:60,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'gray',
    borderWidth: 1,
    
  },
  textInput: {
    flex: 1,
    marginLeft:15,    
    backgroundColor: 'white',
  },
  icon: {
    margin: 0,
    padding:5
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 3,
  },
});
export default Dropdown;