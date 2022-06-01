import { StatusBar } from "expo-status-bar";

import React from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import RecipeScreenContent from "../components/RecipeScreenContent";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
} from "@react-navigation/native";
import { SearchBar } from "react-native-screens";
import SearchFeature from "../components/SearchFeature";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";
import AppLoading from "expo-app-loading";

export default function TabTwoScreen({ colorScheme }) {
  let [fontsLoaded, error] = useFonts({
    Lato_700Bold,
  });

  const navigation = useNavigation();
  if (!fontsLoaded) {
    return (
      <AppLoading autoHideSplash /> //AppLoading will only be dispalyed while fonts loaded is false
    );
  } else
    return (
      <View style={styles.container}>
        <View style={styles.searchBarView}>
          <SearchFeature function={"recipes"}></SearchFeature>
        </View>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={styles.buttonTouchable}
            onPress={() => navigation.navigate("RecipeSettings")}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>Skapa Ett Recept</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffdfa",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBarView: {
    flex: 5,

    marginTop: "4%",
  },
  button: {
    width: "100%",
    height: "50%",
    backgroundColor: "#9CFCAC",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,

    marginBottom: 10,
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonView: {
    flex: 1,
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    backgroundColor: "#fffdfa",
  },
  buttonTouchable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
});
