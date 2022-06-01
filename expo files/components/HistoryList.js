// List.js
import { useLinkProps, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";

import { Dimensions } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

function handleItemPressed(data, navigation, isAdd) {
  console.log(data)
  api
    .getData(data)
    .then((response) => {
      if (!response.data.success) {
        alert("Not found");
      } else {
        navigation.navigate("Nutrition", {
          ScannedData: response.data,
          isAdd: isAdd,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// definition of the Item, which will be rendered in the FlatList
const Item = ({ name, details, GTIN, navigation, isAdd }) => (
  <TouchableOpacity onPress={() => handleItemPressed(GTIN, navigation, isAdd)}>
    <View style={styles.item}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.details} numberOfLines={1}>
        {details}{" "}
      </Text>
    </View>
  </TouchableOpacity>
);

const NoItem = ({ name, details }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{name}</Text>
    <Text style={styles.details}>{details}</Text>
  </View>
);

// the filter

const HistoryList = (props) => {
  let [fontsLoaded, error] = useFonts({
    Lato_700Bold,
  });

  const renderItem = ({ item }) => {
    console.log("item", item.data);
    return (
      <Item
        name={item.data.namn}
        details={item.data.Varumarke}
        GTIN={item.data.GTIN}
        navigation={props.navigation}
        isAdd={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.list__container}>
      <View style={{ width: "100%" }}>
        <FlatList
          data={props.data ? props.data.reverse() : []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HistoryList;

const styles = StyleSheet.create({
  list__container: {
    //margin: 10,
    flex: 1,
    width: windowWidth * 0.9,
    height: "100%",
  },
  item: {
    flex: 1,
    marginLeft: 0,
    marginRight: 30,
    marginBottom: 20,
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "lightgrey",
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Lato_700Bold",
  },
});
