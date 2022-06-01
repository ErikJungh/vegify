import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import api from "../utils/api";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import RecipeScreenContent from "../components/RecipeScreenContent";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";

export default function ReviewScreen(props) {
  const [defaultRating, setdefaultRating] = useState(3);
  const [maxRating, setmaxRating] = useState([1, 2, 3, 4, 5]);
  const navigation = useNavigation();
  let [fontsLoaded, error] = useFonts({ Lato_700Bold });

  const data = navigation.getState();

  const saveReview = () => {
    //setRecipeID(data.routes[data.routes.length - 1].params.id);
    id = data.routes[data.routes.length - 1].params.id;
    postReview(id, defaultRating);
    console.log(id, defaultRating, "ID har skickats med rating");
    console.log(data.routes[data.routes.length - 1].params.id);
    Alert.alert(
      "Betyget har skickats!",
      "Tack för att du betygsatte detta recept, hoppas det smakade :)",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };
  function postReview(id, newPoints) {
    api.postReview(id, newPoints).catch((error) => {
      console.log(error);
    });
  }

  const RatingBar = () => {
    return (
      <View style={styles.ratingBarStyle}>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setdefaultRating(item)}
            >
              <Image
                style={styles.starImgStyle}
                source={
                  item <= defaultRating
                    ? require("../assets/images/star_filled.png")
                    : require("../assets/images/star_corner.png")
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.textStyle}>Vad tyckte du om det här receptet?</Text>
      <RatingBar />
      <Text style={styles.textStyle}>
        {defaultRating + "/" + maxRating.length}
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.buttonStyle}
        onPress={saveReview}
      >
        <Text>Spara betyg</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    margin: "5%", //10
  },
  starImgStyle: {
    width: 40, //"10%",
    height: 40, //"10%",
    resizeMode: "cover",
  },
  ratingBarStyle: {
    justifyContent: "center",
    flexDirection: "row",
    marginTop: "10%", //30
  },
  textStyle: {
    textAlign: "center",
    fontSize: 23,
    marginTop: "5%", //20
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30, //"15%",
    padding: 15, //"5%",
    backgroundColor: "#9CFCAC",
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderRadius: 10,
  },
});
