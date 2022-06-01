import {
  StyleSheet,
  TouchableOpacity,
  safeAreaView,
  Button,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import SearchFeature from "../../components/SearchFeature";
import { Text, View } from "../../components/Themed";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppLoading from "expo-app-loading";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";
export default function RecipeSettingsScreen() {
  const navigation = useNavigation();
  const [recipeName, setRecipeName] = useState();
  const [portions, setPortions] = useState();
  const [description, setDescription] = useState();
  const [errorMessage, setErrorMessage] = useState();

  let [fontsLoaded, error] = useFonts({
    Lato_700Bold,
  });
  function recipeCreate() {
    if (
      recipeName != undefined &&
      portions != undefined &&
      description != undefined &&
      recipeName.length > 0 &&
      portions.length > 0 &&
      description.length > 0
    ) {
      setErrorMessage(null);
      navigation.navigate("RecipeCreation", {
        recipeName: recipeName,
        portions: portions,
        returnedIngredient: "",
        recipeDescription: description,
        newRecipe: true,
      });
    } else {
      console.log("TEST, ATLEAST ONE EMPTY FIELD");
      setErrorMessage("Inga fält får vara tomma!");
    }
  }
  if (!fontsLoaded) {
    return (
      <AppLoading autoHideSplash /> //AppLoading will only be dispalyed while fonts loaded is false
    );
  } else
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <View style={styles.recipeNameView}>
              <View style={styles.recipeNameTitleView}>
                <Text style={styles.nameTitle}>Vad Heter Receptet?</Text>
              </View>
              <View style={styles.recipeNameInputView}>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Namn..."
                  keyboardType="default"
                  value={recipeName}
                  onChangeText={setRecipeName}
                />
              </View>
            </View>
            <View style={styles.portionsView}>
              <View style={styles.portionTitleView}>
                <Text style={styles.nameTitle}>Hur Många Portioner?</Text>
              </View>
              <View style={styles.portionInputView}>
                <TextInput
                  style={styles.portionInput}
                  placeholder="Portioner..."
                  keyboardType="number-pad"
                  value={portions}
                  onChangeText={setPortions}
                />
              </View>
            </View>
            <View style={styles.descriptionView}>
              <View style={styles.descriptionTitleView}>
                <Text style={styles.nameTitle}>Berätta om receptet</Text>
              </View>
              <View style={styles.descriptionInputView}>
                <TextInput
                  style={styles.descriptionInput}
                  blurOnSubmit={true}
                  placeholder="Beskrivning..."
                  multiline={true}
                  numberOfLines={10}
                  maxLength={200}
                  keyboardType="default"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>
            {errorMessage == undefined ? null : (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
            <View style={styles.continueButtonView}>
              {
                <Pressable
                  style={styles.continueButton}
                  onPress={() => recipeCreate()}
                >
                  <Text style={styles.buttonText}>Fortsätt</Text>
                </Pressable>
              }
            </View>
          </View>
          <View style={styles.bottom}></View>
        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#FFFDFA",
    flex: 1,
    width: "100%",
  },
  scroll: {
    flex: 1,
  },
  container: {
    flex: 4,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  recipeNameView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  portionsView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  recipeNameTitleView: {
    flex: 3,
    width: "100%",
    //backgroundColor: "pink",
    justifyContent: "center",
    alignItems: "center",
  },
  recipeNameInputView: {
    flex: 2,
    width: "60%",
    //backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "5%",
  },
  portionTitleView: {
    flex: 3,
    width: "100%",
    //backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionTitleView: {
    flex: 2,
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  portionInputView: {
    flex: 2,
    width: "60%",
    paddingVertical: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionInputView: {
    flex: 2,
    width: "60%",
    paddingVertical: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  nameTitle: {
    fontSize: 24,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
  portionTitle: {
    fontSize: 24,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
  descriptionTitle: {
    fontSize: 24,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
  nameInput: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  portionInput: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  descriptionInput: {
    padding: 10,
    paddingTop: 10,
    height: 100,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  continueButtonView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "1%",
  },

  continueButton: {
    backgroundColor: "#9CFCAC",
    width: "50%",
    height: "30%",
    borderRadius: 10,
    margin: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },

  bottom: {
    flex: 1,
    height: 280,
  },
  errorMessage: {
    marginTop: "5%",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
    fontFamily: "Lato_700Bold",
    padding: "1%",
    color: "black",
    fontSize: 16,
  },
});
