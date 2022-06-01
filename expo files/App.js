import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  Alert,
} from "react-native";
import iconSet from "@expo/vector-icons/build/Fontisto";
import TabOneScreen from "./screens/TabOneScreen";
import api from "./utils/api";
import BarcodeScanner from "./screens/BarcodeScannerScreen";
import NutritionScreen from "./screens/NutritionScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const handlePress = () => console.log("test");

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDFA",
    alignItems: "center",
    justifyContent: "center",
  },
});
