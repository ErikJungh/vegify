// SearchBar.js
import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  Button,
  Pressable,
} from "react-native";
import { Feather, Entypo, FontAwesome } from "@expo/vector-icons";
import api from "../utils/api";
import localStorage from "../utils/localStorage";
import preferences from "../utils/preferences";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

const fetchProductsFromDB = (props) => {
  api
    .getDatatext(props.searchPhrase)
    .then((response) => {
      if (!response.data) {
        console.log("Nothing is called this");
      } else {
        if (response.data.success == undefined) {
          props.setSearchData(response.data);
          console.log("SetSreachData gave ", response.data)
        } else {
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
let loadFromStorage = async function () {
  var prefs = await localStorage.readPreferences();
  return prefs;
};
const fetchRecipesFromDB = (props) => {
  loadFromStorage().then((preferences) => {
    api
      .getRecipesBySearch(props.searchPhrase, (preferences))
      .then((response) => {
        props.setSearchData(response.data);
      });
  });
};

const SearchBar = (props) => {
  const navigation = useNavigation();

  var func;
  if (props.function === "recipes") {
    func = fetchRecipesFromDB;
  } else if (props.function === "products") {
    func = fetchProductsFromDB;
  }
  return (
    <View style={styles.container}>
      <View
        style={
          !props.clicked
            ? styles.searchBar__unclicked
            : styles.searchBar__clicked
        }
      >
        {/* search Icon */}
        <Feather
          name="search"
          size={20}
          color="black"
          style={{ marginLeft: 1 }}
        />
        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder="Sök"
          keyboardType="web-search"
          value={props.searchPhrase}
          onChangeText={props.setSearchPhrase}
          onSubmitEditing={() => func(props)}
          onFocus={() => {
            props.setClicked(true);
          }}
        />
        {/* cross Icon, depending on whether the search bar is clicked or not */}
        {props.clicked && (
          <Entypo
            name="cross"
            size={20}
            color="black"
            style={{ padding: 1 }}
            onPress={() => {
              props.setSearchPhrase(""), props.setSearchData("");
            }}
          />
        )}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {
        <View>
          <Pressable
            onPress={() => {
              Keyboard.dismiss();

              navigation.navigate("Scanner", {
                isAdd: props.isAdd,
                recipeName: props.recipeName,
                portions: props.portions,
              });
            }}
          >
            <View style={styles.scanbutton}>
              <FontAwesome
                name="barcode"
                size={45}
                color="#000"
                style={{ margin: 7 }}
              />
            </View>
          </Pressable>
        </View>
      }
    </View>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginLeft: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
  scanbutton: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 40,
    margin: 15,
    backgroundColor: "#fffdfa",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",

    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
});
