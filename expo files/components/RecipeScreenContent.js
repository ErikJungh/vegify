import {
  StyleSheet,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActionSheetIOS,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { View } from "./Themed";
import { ScrollView } from "react-native-gesture-handler";
import api from "../utils/api";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-elements";
import useColorScheme from "../hooks/useColorScheme";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";
import AppLoading from "expo-app-loading";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
export default function RecipeScreenContent(props) {
  const navigation = useNavigation();
  
  
  let [fontsLoaded, error] = useFonts({ Lato_700Bold });

  const [recipe, setRecipe] = useState({
    _id: "",
    name: "",
    description: "",
    ingredients: [],
    steps: [],
    tags: [],
    point: 0,
    reviewers: 0,
    __v: 0,
  });
  const [currentPortions, setResult] = useState(4);

  const [vegTag, setVegTag] = useState("");

  function getRecipebyId(data) {
    api
      .getRecipebyId(data)
      .then((response) => {
        setRecipe(JSON.parse(response.data));
        //setResult(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  

  useEffect(() => {
    const updateList = navigation.addListener(
      "focus",
      () => {
        getRecipebyId(props.recipeID);
        setVegTag(null);
        console.log(vegTag, "VEGTAAAAAAAAAAAAAAAAAG BEOFRE \n \n \n \n");
        var tag = "";
        if (
          recipe.tags.includes("nonvegan") &&
          !recipe.tags.includes("nonvegetarian")
        ) {
          // vegetarisk
          tag = "Vegetarisk";
        } else if (
          recipe.tags.includes("nonvegan") &&
          recipe.tags.includes("nonvegetarian")
        ) {
          // vegansk
          tag = "Vegansk";
        } //kött
        else {
        }
        console.log(recipe, "TAGS");
        setVegTag(tag);
        console.log("AFTER \n \n \n", vegTag);

        return updateList;
      },
      [navigation]
    );
  });

  
  const TagItem = ({ item }) => (
    <View>
      <Text style={styles.tags}>{item.step}</Text>
    </View>
  );
  const onPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Avbryt", "1", "2", "4", "6", "8", "10", "12"],
        destructiveButtonIndex: 10,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setResult(1);
        } else if (buttonIndex === 2) {
          setResult(2);
        } else if (buttonIndex === 3) {
          setResult(4);
        } else if (buttonIndex === 4) {
          setResult(6);
        } else if (buttonIndex === 5) {
          setResult(8);
        } else if (buttonIndex === 6) {
          setResult(10);
        } else if (buttonIndex === 7) {
          setResult(12);
        }
      }
    );
  
  const DATA_ingredients = [];
  for (let i = 0; i < recipe.ingredients.length; i++) {
    DATA_ingredients.push({
      key: i,
      ingredient: recipe.ingredients[i].ingredient,
      amount: recipe.ingredients[i].amount / recipe.portions,
      unit: recipe.ingredients[i].unit,
    });
  }
  const DATA_instructions = [];
  for (let i = 0; i < recipe.steps.length; i++) {
    DATA_instructions.push({
      key: i,
      step: recipe.steps[i],
    });
  }
  const DATA_tags = [];
  for (let i = 0; i < recipe.tags.length; i++) {
    DATA_tags.push({
      key: i,
      tag: recipe.tags[i],
    });
  }
  for (let i = 0; i < DATA_tags.length; i++) {
    //DATA_tags[i].tag = DATA_tags[i].tag;
    if (
      DATA_tags[i].tag === "nonvegetarian" 
      
    ) {
      DATA_tags.splice(i);
      DATA_tags.push({key: 0, "tag": "vegetarian"})
      
      
    }
    if (
      
      DATA_tags[i].tag === "nonvegan"
    ) {
      DATA_tags.splice(i);
      DATA_tags.push({key: 0, "tag": "vegan"})
      
      
    }
    //DATA_tags.remove(i);
  }

  const renderItemTags = ({ item }) => (
    console.log(item), (<TagItem item={item}></TagItem>)
  );
  function review() {
    //Navigate to functionality for reviewing a recipe.....
    //
    navigation.navigate("ReviewScreen", { id: props.recipeID });
  }

  if (!fontsLoaded) {
    return (
      <AppLoading autoHideSplash /> //AppLoading will only be dispalyed while fonts loaded is false
    );
  } else
    return (
      <View style={styles.screen}>
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <View style={styles.picture}>
              <ImageBackground
                //style={styles.overlayImage}
                resizeMode="cover"
                style={styles.recipePicture}
                imageStyle= {{borderRadius: 10}}
                source={{uri:"http://vegify-2.platform-spanning.systems:8080/"+recipe.recipeImage}}
              >
                <View style={styles.overlayView}>
                  <Text style={styles.overlayText}>
                    {console.log("IN COMPONENT", recipe.tags)}
                    {!recipe.tags.includes("nonvegetarian") &&
                    !recipe.tags.includes("nonvegan")
                      ? "Vegansk"
                      : !recipe.tags.includes("nonvegetarian") &&
                        recipe.tags.includes("nonvegan")
                      ? "Vegetarisk"
                      : ""}
                  </Text>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.recipeName}>
              <Text style={styles.recipeTitle}>{recipe.name}</Text>
              <Text style={styles.recipeDescription}>{recipe.description}</Text>
              <View style={styles.tagView}>
                <Text style={styles.tags}>Innehåller: </Text>
                {DATA_tags.map((item) => {
                  return (
                    <View key={item.key}>
                      <Text style={styles.tags}>
                        {console.log(item.tag)}
                        {DATA_tags.indexOf(item) === DATA_tags.length - 1
                          ? item.tag
                          : item.tag + ", "}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View
                style={{
                  alignSelf: "baseline",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              ></View>
            </View>
            <View style={styles.review}>
              <View style={styles.reviewMark}>
                <Image
                  style={styles.starLogo}
                  source={require("../assets/images/star_filled.png")}
                />
                <Text style={styles.recipeGrade}>
                  {recipe.reviewers != 0
                    ? (recipe.point / recipe.reviewers).toFixed(1) + "/5"
                    : "-/5"}
                </Text>
              </View>
              <View style={styles.amountReviews}>
                <Text>Betygsatt av {recipe.reviewers} st</Text>
              </View>
            </View>
            <View style={styles.portions}>
              <TouchableOpacity style={styles.portionButton} onPress={onPress}>
                <Text style={styles.portionButtonText}>{currentPortions}</Text>
              </TouchableOpacity>
              <Text style={styles.portionText}>{"portioner"}</Text>
            </View>
          </View>
          <View style={styles.listIngredients}>
            <Text style={styles.heading}>Ingredienser</Text>
            {DATA_ingredients.map((item) => {
              return (
                <View key={item.key}>
                  <Text style={styles.ingredients}>
                    {((item.amount * currentPortions) % 1 != 0
                      ? (item.amount * currentPortions).toFixed(1)
                      : item.amount * currentPortions) +
                      " " +
                      item.unit +
                      " " +
                      item.ingredient}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.listInstructions}>
            <Text style={styles.heading}>Gör så här:</Text>
            {DATA_instructions.map((item) => {
              return (
                <View key={DATA_instructions.indexOf(item)}>
                  <Text style={styles.instructions}>
                    {DATA_instructions.indexOf(item) + 1 + ". " + item.step}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.reviewView}>
            <TouchableOpacity style={styles.reviewButton} onPress={review}>
              <Text style={styles.reviewButtonText}>
                Betygsätt detta recept
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
}
const styles = StyleSheet.create({
  recipePicture: {
    width: windowWidth * 0.9,
    height: windowWidth * 0.9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#EEE",
    flexDirection: "column",
    marginTop: windowWidth*0.05,
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center'

    //borderWidth: 15,
  },

  ingredients: {
    color: "black",
    fontSize: 18,
  },
  instructions: {
    color: "black",
    fontSize: 18,
    paddingVertical: 5,
  },
  item: {
    textAlign: "left",
    borderColor: "black",
    color: "#fffdfa",
  },
  heading: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "Lato_700Bold",
    
  },
  title: {
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Lato_700Bold",
    
  },
  picture: {
    //alignItems: "center",
    //justifyContent: "center",
    //padding: 5
  },
  listIngredients: {
    paddingVertical: 10,
    //paddingLeft: 15,
    paddingLeft: "5%",
  },
  listInstructions: {
    paddingVertical: 15,
    paddingLeft: "5%",
  },
  recipeTitle: {
    fontSize: 30,
    fontWeight: "bold",
    paddingVertical: 5,
    fontFamily: "Lato_700Bold",
  },
  recipeDescription: {
    fontSize: 18,
    paddingVertical: 5,
    //fontFamily: "Lato_700Bold",
  },
  recipeName: {
    fontSize: 14,
    
    paddingVertical: 10,
    backgroundColor: 'transparent',
    width: "90%"
  },
  tags: {
    fontSize: 16,
    
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },
  tagView: {
    borderWidth: 1,
    //alignContent: "center",
    //justifyContent: "center",
    paddingLeft: "2%",
    paddingVertical: "2%",
    borderRadius: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagList: {},
  buttonText: {
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },
  reviewButton: {
    backgroundColor: "#9CFCAC",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: "5%",
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderRadius: 10,
    //height: "10%",
    //color: "#9CFCAC",
  },
  reviewView: {
    paddingVertical: "5%",
    paddingHorizontal: "5%",
  },
  reviewButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  review: {
    flexDirection: "row",
    marginLeft: "10%",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
  },
  starLogo: {
    width: 25,
    height: 25,
    //borderWidth: 1,
  },
  amountReviews: {
    fontSize: 14,
    paddingVertical: 10,
    //paddingHorizontal: 5,
    //borderWidth: 1,
  },
  portions: {
    marginTop: windowWidth * 0.05,
    marginLeft: "10%",
    flexDirection: "row",
    width: "100%"
  },
  reviewMark: {
    //alignContent: "flex-end",
    flexDirection: "row",
    flex: 1
  },
  amountReviews: {
    //borderWidth: 1,
    marginTop: "auto",
    flex: 4
  },
  recipeGrade: {
    fontSize: 20,
    marginTop: "auto",
    //paddingVertical: 5,
  },
  screen: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center'
  },
  scroll: {
    flex: 1,
    width: "100%",
    
  },
  portionButton: {
    paddingHorizontal: 5,
    
    borderWidth: 2,
    borderRadius: 10,
  },
  portionButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  portionText: {
    fontSize: 20,
    paddingVertical: 3,
    paddingLeft: 5,
  },
  overlayText: {
    color: "white",
    fontSize: 24,
    lineHeight: 25,
    fontWeight: "bold",
    textAlign: "right",
    fontFamily: "Lato_700Bold",
  },
  overlayImage: {
    flex: 1,
    
  },
  overlayView: {
    alignItems: "flex-end",
    marginLeft: "auto",
    marginBottom: "auto",
    backgroundColor: "#00000050",
    borderRadius: 10,
    paddingVertical: "1%",
    paddingHorizontal: "1%",
    
  },
});
