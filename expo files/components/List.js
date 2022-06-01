// List.js
import { useLinkProps, useNavigation } from "@react-navigation/native";
import React from "react";
import api from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";
import { Dimensions, ImageBackground } from "react-native";
import cache from "./Cache";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

let updateCache = async function (value) {
  const oldValue = await cache.get("scannedHistory");
  var list = [];
  for (var val in oldValue) {
    list.push(oldValue[val]);
  }

  list.push(value);
  await cache.set("scannedHistory", list);
};

function handleItemPressed(data, navigation, isAdd, recipeName, portions) {
  api
    .getData(data)
    .then((response) => {
      if (!response.data.success) {
        alert("Not found");
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

// definition of the Item, which will be rendered in the FlatList
const Item = ({
  name,
  details,
  brand,
  GTIN,
  link,
  navigation,
  isAdd,
  recipeName,
  portions,
}) => (
  <View style={styles.itemView}>
    <TouchableOpacity
      onPress={() =>
        handleItemPressed(GTIN, navigation, isAdd, recipeName, portions)
      }
    >
      <View style={styles.itemWithImage}>
        <View style={styles.item}>
          <Text style={styles.title}>{name}</Text>
          <View style={styles.subTitle}>
            <Text style={styles.brand}>{brand}</Text>
            <Text style={styles.details}>{details}</Text>
          </View>
        </View>
        <View style={styles.imageView}>
          {link !== "" && <Image style={styles.image} source={{ uri: link }} />}
        </View>
      </View>
    </TouchableOpacity>
  </View>
);
const RecipeItem = ({ id, name, description, tags, score, recipeImage, navigation}) => (
  
  <View style={styles.RecipeItemView}>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("RecipeScreen", { recipeID: id });
      }}
    >
      <View style={styles.recipeitem}>
        <ImageBackground
          source={{uri: "http://vegify-2.platform-spanning.systems:8080/"+recipeImage}}
          resizeMode="cover"
          imageStyle={{ borderRadius: 10}}
          style={styles.image}
        >
          <View style={styles.recipeTitleView}>
            <Text style={styles.recipeTitle}>{name}</Text>
          </View>
          <View style={styles.recipeSubTitleView}>
            <Text style={styles.recipeDetails}>
              Taggar: {JSON.stringify(tags) !== "[]" ? tags.join(", ") :  "Inga"}
            </Text>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.scoreView}>
        
        <ImageBackground 
         source={score >= 0.5 ? require("../assets/images/star_filled.png"): require("../assets/images/star_corner.png") }
         resizeMode="cover"
         
         style={{
          marginLeft: 5,
          padding: 3,
          flex: 1,
          width: "100%",
          height: "90%",
          resizeMode: "contain",
         
        }}/>
        <ImageBackground 
         source={score >= 1.5 ? require("../assets/images/star_filled.png"): require("../assets/images/star_corner.png") }
         resizeMode="cover"
         
         style={styles.starImage}/>
        <ImageBackground 
         source={score >= 2.5 ? require("../assets/images/star_filled.png"): require("../assets/images/star_corner.png") }
         resizeMode="cover"
         style={styles.starImage}/>
        <ImageBackground 
         source={score >= 3.5 ? require("../assets/images/star_filled.png"): require("../assets/images/star_corner.png") }
         resizeMode="cover"
         style={styles.starImage}/>
        <ImageBackground 
         source={score >= 4.5 ? require("../assets/images/star_filled.png") : require("../assets/images/star_corner.png") }
         resizeMode="cover"
         style={styles.starImage}/>
      </View>
    </TouchableOpacity>
  </View>
);
// the filter

const List = (props) => {
  const renderItem = ({ item }) => {
    if (props.function === "recipes") {
     if(item.tags.indexOf("nonvegan") > -1){
       item.tags.splice(item.tags.indexOf("nonvegan"))
       item.tags.push("vegan")
     }
     
     if(item.tags.indexOf("nonvegetarian") > -1){
      item.tags.splice(item.tags.indexOf("nonvegetarian"))
      item.tags.push("vegetarian")
    }
    
      return (
        <RecipeItem
          id={item._id}
          name={item.name}
          description={item.description}
          tags={item.tags}
          score={item.point/item.reviewers}
          recipeImage={item.recipeImage}
          navigation={props.navigation}
        />
      );
    } else {
      // when no input, show nothing
      if (item.Forpackningsstorlek == null) {
        item.Forpackningsstorlek = "-";
      }
      return (
        <Item
          name={item.namn}
          details={item.Forpackningsstorlek}
          brand={item.Varumarke}
          GTIN={item.GTIN}
          link={item.lank}
          navigation={props.navigation}
          isAdd={props.isAdd}
          recipeName={props.recipeName}
          portions={props.portions}
        />
      );
    }
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
      <SafeAreaView style={styles.list__container}>
        <View
          style={{ alignItems: "center", justifyContent: "center" }}
          onStartShouldSetResponder={() => {
            props.setClicked(false);
          }}
        >
          <FlatList
            numColumns={props.function === "recipes" ? 2 : 1}
            data={props.data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            //keyExtractor={(item) => item.id}
          />
        </View>
      </SafeAreaView>
    );
};

export default List;

const styles = StyleSheet.create({
  list__container: {
    margin: 10,
    height: "92%",
    width: "100%",
  },
  item: {
    flex: 1,
    width: "100%",
  },
  itemWithImage: {
    flexDirection: "row",
    width: windowWidth * 0.9,
    marginTop: 15,
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "lightgrey",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Lato_700Bold",
  },
  itemView: {
    flex: 15,
  },
  RecipeItemView: {
    margin: 10,
    width: windowWidth * 0.45,
    height: windowWidth * 0.45,
    
    borderRadius: 15,

    justifyContent: "center",
    alignItems: "center",
  },
  recipeitem: {
    flex: 4,
    width: windowWidth * 0.45,
    height: windowWidth * 0.45,
  },
  scoreView: {
    
    
    marginTop: windowWidth * -0.11,
    flex: 1,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
    width: "100%",
    backgroundColor: "#00000044",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10
  },
  recipeSubTitleView: {
    backgroundColor: "#00000099",
    justifyContent: "center",
    height: "15%",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },
  recipeDetails: {
    color: "#fffdfa",
    marginLeft: 10,
  },
  recipeTitle: {
    color: "#fffdfa",
    marginTop: 5,
    marginLeft: 10,
    fontSize: 20,
    
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
  },
  recipeTitleView: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#00000099",
    justifyContent: "center",
  },
  imageView: {
    alignItems: "center",
    flex: 1,
    
    marginBottom: "5%",
  },

  subTitle: {
    flexDirection: "column",
  },

  details: {
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Lato_700Bold",
    flex: 6,
  },
  brand: {
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Lato_700Bold",
    flex: 2,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    
  },
  starImage: {
    padding: 3,
    flex: 1,
    width: "100%",
    height: "90%",
    resizeMode: "contain",
  }
});
