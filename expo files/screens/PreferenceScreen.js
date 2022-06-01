import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";

import FirstScreenContent from "../components/FirstScreenContent";
import { Text, View } from "../components/Themed";
import localStorage from "../utils/localStorage";
import preferences from "../utils/preferences";

import { useNavigation } from "@react-navigation/native";
import PrefsList from "../components/PrefsList";
import AppLoading from "expo-app-loading";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";
export default function PreferenceScreen() {
  const navigation = useNavigation();
  const [loadedPrefs, setIsEnabled] = useState(preferences.preferences());
  
  
  const toggleSwitch = async (newState, element) => {
    var newPrefs = { ...loadedPrefs, [element]: newState };
    setIsEnabled(newPrefs);
    await localStorage.storePreferences(newPrefs);
  };

  let loadFromStorage = async function () {
    var prefs = await localStorage.readPreferences();
    if (prefs) {
      setIsEnabled(prefs);
    }

    return prefs;
  };

  useEffect(() => {
    const loadPrefs = navigation.addListener("focus", () => {
      loadFromStorage();
    });
    return loadPrefs;
  }, [navigation]);

  
  
  return (
    <View style={styles.container}>
      <View style={styles.preferencesContainer}>
        <PrefsList data={loadedPrefs} toggleSwitch={toggleSwitch} />
      </View>
      <View
        style={styles.separator}
        lightColor="#000"
        darkColor="rgba(255,255,255,0.1)"
      />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9CFCAC",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  preferencesContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFDFA",
  },
  prefsList: {
    flex: 1,
    width: "100%",
  },
  image: {
    flex: 1,
    justifyContent: "center",

    height: "50%",
    width: "100%",
  },
});
