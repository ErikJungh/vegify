import {
  StyleSheet,
  TouchableOpacity,
  safeAreaView,
  Button,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FlatList, TextInput } from "react-native-gesture-handler";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SectionList,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import preferences from "../../utils/preferences";
import api from "../../utils/api";

let ingredientsList = [];
let GTINList = [];
let allergeneList = preferences.preferences();
let allergensPresent = [];
let description = [];

export default function RecipeCreationScreen() {
  const navigation = useNavigation();

  let data = navigation.getState();

  let recipeName = data.routes[data.routes.length - 1].params.recipeName;
  let portions = data.routes[data.routes.length - 1].params.portions;
  const [ingredients, setIngredients] = useState([]);
  const [list, setListSate] = useState(true);
  var ingredient = "";
  var amount = "";
  var unit = "";

  useEffect(() => {
    const updateList = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      setListSate(!list);

      try {
        data = navigation.getState();

        ingredient =
          data.routes[data.routes.length - 1].params.returnedIngredient;
        amount = data.routes[data.routes.length - 1].params.returnedAmount;
        unit = data.routes[data.routes.length - 1].params.returnedUnit;
        recipeName = data.routes[data.routes.length - 1].params.recipeName;
        portions = data.routes[data.routes.length - 1].params.portions;

        if (data.routes[data.routes.length - 1].params.newRecipe) {
          GTINList = [];
          ingredientsList = [];
          setIngredients([]);
        }
        description.push(
          data.routes[data.routes.length - 1].params.recipeDescription
        );

        allergensPresent = data.routes[data.routes.length - 1].params.allergens;

        if ((ingredient !== "") & (GTINList.indexOf(ingredient.GTIN) === -1)) {
          ingredientsList.push({
            ingredient: ingredient.namn,
            brand: ingredient.Varumarke,
            GTIN: ingredient.GTIN,
            amount: amount,
            unit: unit,
            allergens: allergensPresent,
          });
          GTINList.push(ingredient.GTIN);
          setIngredients(ingredientsList);
        }

        if (ingredientsList.length === 0) {
          GTINList = [];
        }

        ingredient = "";
      } catch (error) {
        console.log(error);
      }
    });

    return updateList;
  }, [navigation]);

  function handleItemPressed(data, isAdd) {
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

  function combineallergens() {
    let finalallergens = preferences.preferences();
    finalallergens["Vegan"] = true;
    finalallergens["Vegetarian"] = true;
    for (var index in ingredients) {
      for (var key in ingredients[index].allergens) {
        if (key !== "Vegan" && key !== "Vegetarian") {
          finalallergens[key] =
            finalallergens[key] || ingredients[index].allergens[key];
        } else {
          finalallergens[key] =
            finalallergens[key] && ingredients[index].allergens[key];
        }
      }
    }
    return finalallergens;
  }

  const IngredientItem = (props) => (
    <View style={styles.ingredientItemView}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => handleItemPressed(props.item.GTIN, false)}
      >
        <View style={styles.ingredientItem}>
          <Text style={styles.ingredientTitle}>{props.item.ingredient}</Text>
          <Text style={styles.ingredientBrand}>
            {props.item.brand} - {props.item.amount} {props.item.unit}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => {
          ingredientsList.splice(props.index, 1);
          setIngredients(ingredientsList);
          setListSate(!list);

          GTINList.splice(GTINList.indexOf(props.GTIN), 1);
        }}
      >
        <FontAwesome
          name="remove"
          size={25}
          color={"#000"}
          style={{ marginLeft: 2 }}
        />
      </TouchableOpacity>
    </View>
  );

  const renderIngredientItem = ({ item, index }) => {
    return <IngredientItem item={item} index={index} />;
  };

  let [fontsLoaded, error] = useFonts({
    Lato_700Bold,
  });
  if (!fontsLoaded) {
    return (
      <AppLoading autoHideSplash /> //AppLoading will only be dispalyed while fonts loaded is false
    );
  } else
    return (
      <View style={styles.container}>
        <View style={styles.nameView}>
          <Text style={styles.name}>{recipeName}</Text>

          <Text style={styles.portions}>{portions} Portioner</Text>
        </View>
        <View style={styles.ingredientsListView}>
          <Text>Ingredienser</Text>
          <FlatList
            style={styles.ingredientsList}
            data={ingredients}
            renderItem={(item, index) => {
              {
                return renderIngredientItem(item, index);
              }
            }}
            keyExtractor={(item, index) => index.toString()}
            extraData={list}
          ></FlatList>
        </View>
        <View style={styles.addIngredientButtonView}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate("Search", {
                addToRecipe: true,
                recipeName: recipeName,
                portions: portions,
              })
            }
          >
            <Text style={styles.addButtontext}>Lägg Till Ingrediens</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.continueButtonView}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              navigation.navigate(
                "RecipeDescription",
                {
                  recipeName: recipeName,
                  portions: portions,
                  ingredients: ingredients,
                  allergens: combineallergens(),
                  description: description[0],
                },
                console.log("description = ", description)
              );
            }}
          >
            <Text style={styles.continueButtontext}>Fortsätt</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFFDFA",
    width: "100%",
  },
  nameView: {
    flex: 1.5,
    width: "100%",
    borderBottomColor: "#bbb",
    borderBottomWidth: 2,
  },
  ingredientsListView: {
    marginTop: 10,
    flex: 4,

    width: "100%",
  },
  addIngredientButtonView: {
    flex: 1.5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#9CFCAC",
    width: "50%",
    height: "50%",
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
  addButtontext: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",

    textAlign: "center",
  },

  continueButtonView: {
    flex: 1.5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  continueButton: {
    backgroundColor: "#9CFCAC",
    width: "40%",
    height: 40,
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
  continueButtontext: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },

  name: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },
  portions: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },
  ingredientItemView: {
    flexDirection: "row",
  },
  ingredientItem: {
    height: 60,
    margin: 10,
    width: "95%",
    justifyContent: "center",

    backgroundColor: "#d9dbda",
    borderRadius: 5,
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  clearButton: {
    height: 60,
    width: 60,
    margin: 10,
    marginLeft: 5,
    backgroundColor: "#F47174",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",

    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  ingredientTitle: {
    // The name of the ingredient in the Flatlist
    fontSize: RFPercentage(2),
    marginLeft: 5,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
  ingredientBrand: {
    fontSize: 12,
    marginLeft: 5,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
});
