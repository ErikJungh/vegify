import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import RecipeScreenContent from "../components/RecipeScreenContent";

export default function RecipeScreen({ colorScheme }) {
  const navigate = useNavigation();
  var routes = navigate.getState().routes;
  var recipeID = routes[routes.length - 1].params.recipeID;
  return (
    <View style={styles.container}>
      <RecipeScreenContent recipeID={recipeID}></RecipeScreenContent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9CFCAC",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    paddingVertical: 10,
  },
});
