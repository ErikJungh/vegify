import { useIsFocused } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import AppLoading from "expo-app-loading";
import cache from "../components/Cache";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import api from "../utils/api";
import { TouchableOpacity } from "react-native-gesture-handler";
export default function BarcodeScanner({ navigation }) {
  const isFocused = useIsFocused();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashActive, setFlash] = useState(Camera.Constants.FlashMode.off);

  const [isAdd, setIsAdd] = useState(false);
  let data = navigation.getState();
  let recipeName = data.routes[data.routes.length - 1].params.recipeName;
  let portions = data.routes[data.routes.length - 1].params.portions;

  //const navigation = useNavigation();
  let [fontsLoaded, error] = useFonts({
    Lato_700Bold,
  });

  let updateCache = async function (value) {
    const oldValue = await cache.get("scannedHistory");
    var list = [];
    for (var val in oldValue) {
      list.push(oldValue[val]);
    }

    list.push(value);
    await cache.set("scannedHistory", list);
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    const updateScreen = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action

      let data = navigation.getState();

      setIsAdd(data.routes[data.routes.length - 1].params.isAdd);
      setScanned(false);
      console.log(scanned);
    });
    return updateScreen;
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    
    if(!scanned){
    setScanned(true);
    
    api
      .getData("0" + data)
      .then((response) => {
        console.log(response.data)
        if (!response.data.success) {
          Alert.alert(
            "Varan hittades inte",
            "Varan finns inte i vår databas ännu :(\n VIll du lägga till denna vara i vår databas? ",
            [
              { text: "Nej", onPress: () => setScanned(false) },
              {
                text: "Ja",
                onPress: () => {
                  navigation.navigate("CreateIngredient", { GTIN: data });
                },
              },
            ]
          );
        } else {
          updateCache(response);
          navigation.navigate("Nutrition", {
            ScannedData: response.data,
            addToRecipe: isAdd,
            recipeName: recipeName,
            portions: portions,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (!fontsLoaded) {
    return (
      <AppLoading autoHideSplash /> //AppLoading will only be dispalyed while fonts loaded is false
    );
  } else
    return (
      <View style={styles.container}>
        {isFocused && (
          <Camera
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
            flashMode={flashActive}
          ></Camera>
        )}
        <SafeAreaView style={styles.root}>
          <View style={styles.root}>
            <View style={{ flex: 2 }}></View>
            <View style={styles.scanContainer}></View>

            <View style={styles.scanDescriptionView}>
              <Text style={styles.scanText}>
                Skanna en streckkod för att få innehållsförteckningen
              </Text>
            </View>
            <View style={styles.FlashLightBtnView}>
              <Pressable
                title={"Flashlight"}
                style={styles.flashLightBtn}
                onPress={() => {
                  setFlash(
                    flashActive === Camera.Constants.FlashMode.torch
                      ? Camera.Constants.FlashMode.off
                      : Camera.Constants.FlashMode.torch
                  );
                }}
              >
                <Text style={styles.closeText}>Ficklampa</Text>
              </Pressable>
            </View>
            <View style={styles.closeBtnView}>
              {
                <Pressable
                  style={styles.backButton}
                  title={"Close"}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.closeText}>Stäng</Text>
                </Pressable>
              }
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    height: "100%",
    width: "100%",
  },
  text: {
    textAlignVertical: "bottom",
    color: "red",
  },
  switchButton: {
    width: "70%",
  },
  backButton: {
    backgroundColor: "#454545",
    width: "70%",
    height: "5%",
    borderRadius: 10,
    margin: 20,
    shadowColor: "black",
    shadowRadius: 10,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  flashLightBtn: {
    backgroundColor: "#454545",
    width: "70%",
    height: "5%",
    borderRadius: 10,
    shadowColor: "black",
    shadowRadius: 10,
    shadowOpacity: 1,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  closeText: {
    fontFamily: "Lato_700Bold",
    color: "#fff",
    fontSize: 35,
    textAlign: "center",
  },
  scanText: {
    fontFamily: "Lato_700Bold",
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
  },
  closeBtnView: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  FlashLightBtnView: {
    width: "100%",
    alignItems: "center",
    flex: 0.6,
  },
  scanDescriptionView: {
    width: "100%",
    alignItems: "center",
    flex: 2,
  },

  scanContainer: {
    flex: 1.5,
    borderColor: "#fff",
    width: "80%",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 1,
  },
});
