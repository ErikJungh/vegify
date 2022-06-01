import * as WebBrowser from "expo-web-browser";
import { StyleSheet, Image, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../constants/Colors";
import { Text, View } from "./Themed";
import { useNavigation } from "@react-navigation/native";
import HistoryList from "./HistoryList";
import AppLoading from "expo-app-loading";
import { SafeAreaView } from "react-native-safe-area-context";
import cache from "./Cache";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";
import { Button } from "react-native-elements/dist/buttons/Button";
export default function FirstScreenContent({ path }) {
  const navigation = useNavigation();
  const [historyData, setHistoryData] = useState();
  let [fontsLoaded, error] = useFonts({
    Lato_700Bold,
  });

  let retrieveCache = async function () {
    var value = await cache.get("scannedHistory");
    setHistoryData(value);
  };

  let clearFoodHistory = async function () {
    await cache.clearAll();
    const value = await cache.get("scannedHistory");

    setHistoryData(value);
  };

  useEffect(() => {
    const updateList = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      retrieveCache();
    });

    return updateList;
  }, [navigation]);

  if (!fontsLoaded) {
    return (
      <AppLoading autoHideSplash /> //AppLoading will only be dispalyed while fonts loaded is false
    );
  } else
    return (
      <View style={styles.container}>
        <View style={styles.clearBtnView}>
          {historyData !== undefined && (
            <TouchableOpacity
              style={styles.clearBtnOpacity}
              onPress={() => clearFoodHistory()}
            >
              <View style={styles.clearBtn}>
                <Text>Rensa historik</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.historyView}>
          <SafeAreaView>
            <HistoryList navigation={navigation} data={historyData} />
          </SafeAreaView>
        </View>
        <View style={styles.scanButtonView}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Scanner", {
                isAdd: false,
                recipeName: "",
                portions: "",
              })
            }
          >
            <Image
              style={styles.scanButton}
              source={require("../assets/images/barcode.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.searchButtonView}>
          {
            <Pressable
              style={styles.searchButton}
              title={"Search"}
              onPress={() =>
                navigation.navigate("Search", { addToRecipe: false })
              }
            >
              <Text style={styles.searchText}>Sök Vara</Text>
            </Pressable>
          }
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",

    backgroundColor: "#FFFDFA",
    alignItems: "center",
  },
  scanButtonView: {
    width: 150,
    height: 79,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#EEE",
    marginBottom: 10,
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  historyView: {
    flex: 8,
    width: "100%",
    height: "100%",
    marginLeft: 20,
    marginRight: 20,

    alignItems: "center",
  },
  searchButtonView: {
    flex: 1,

    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtnView: {
    flex: 1,
    marginTop: "1%",
    width: "100%",
  },
  clearBtnOpacity: {
    flex: 1,
    margin: 5,
  },
  clearBtn: {
    width: "35%",
    height: "80%",
    backgroundColor: "#9CFCAC",
    marginBottom: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
  },
  scanButton: {
    resizeMode: "contain",
    width: 150,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  searchButton: {
    backgroundColor: "#9CFCAC",
    width: "70%",
    height: "60%",
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 40,
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  searchText: {
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
});
