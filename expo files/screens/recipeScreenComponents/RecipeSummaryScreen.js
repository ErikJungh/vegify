import {
  StyleSheet,
  TouchableOpacity,
  safeAreaView,
  Button,
  Pressable,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SectionList,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { useNavigation } from "@react-navigation/native";
import api from "../../utils/api";
import AppLoading from "expo-app-loading";
import { Camera } from "expo-camera";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";
import { FlatList, ScrollView } from "react-native-gesture-handler";

let stepList = [];

export default function RecipeSummaryScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const navigation = useNavigation();

  let data = navigation.getState();
  let recipeData = data.routes[data.routes.length - 1].params;
  let recipeName = recipeData.name;
  let description = recipeData.description;
  let ingredientsList = recipeData.ingredients;
  let portions = recipeData.portions;
  let stepList = recipeData.steps;
  let allergensList = recipeData.tags;

  const [photoTaken, setPhotoTaken] = useState(false);
  const [cameraView, setCameraView] = useState(false);
  const [photo, setPhoto] = useState({
    height: 100,
    uri: "../../assets/images/icon.png",
    width: 100,
  });
  const CamView = () => (
    <View style={styles.camContainer}>
      <Camera
        style={styles.camera}
        flashMode={"auto"}
        ratio={"1:1"}
        ref={(ref) => {
          this.camera = ref;
        }}
      >
        <View style={styles.buttonContainer}>
          <View style={styles.shutterButtonContainer}>
            <TouchableOpacity
              style={styles.shutterButton}
              onPress={() => snap()}
            ></TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );

  const snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();

      setPhoto(photo);
      setPhotoTaken(true);
      setCameraView(!cameraView);
    }
  };

  const toggleCam = (isOn) => {
    setCameraView(!isOn);
  };
  const IngredientItem = (props) => (
    <View style={styles.ingredientItemView}>
      <View style={styles.ingredientItem}>
        <Text style={styles.ingredientTitle}>{props.item.ingredient}</Text>
        <Text style={styles.ingredientBrand}>
          {props.item.brand} - {props.item.amount} {props.item.unit}
        </Text>
      </View>
    </View>
  );
  const StepItem = (props) => (
    <View style={styles.listItem}>
      <View style={styles.stepNrView}>
        <Text style={styles.listIndexText}>
          {props.index - ingredientsList.length + 1}
        </Text>
      </View>
      <View style={styles.describeRecipeBox}>
        <Text style={styles.stepTitle}>
          {stepList[props.index - ingredientsList.length]}
        </Text>
      </View>
    </View>
  );

  const renderItem = ({ item, index }) => {
    if (index < ingredientsList.length) {
      return <IngredientItem item={item} index={index} />;
    } else {
      return <StepItem index={index} />;
    }
  };
  console.log(photo.uri, "PHOTO, URI");
  const handleRecipeDone = () => {
    var imageData = new FormData((enctype = "multipart/form-data"));
    const ext = photo.uri.substring(photo.uri.lastIndexOf(".") + 1);
    let photoData = photo;

    photoData.uri =photo.uri
    
    
    imageData.append('recipeImage', {
      uri: photoData.uri, 
      name:'recipePic.jpg',
      type: `image/${ext}` });
    
    
    
    api.postImage(imageData, function(returnedImage){
      api.postRecipe({'name': recipeName,'description':description,'ingredients':ingredientsList,'portions':portions,'steps':stepList,'tags':allergensList, 'recipeImage':returnedImage})    
  })
      navigation.navigate("Root")
      
      
    
  
  }
 


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    const updateList = navigation.addListener(
      "focus",
      () => {
        let data = navigation.getState();
        try {
          let recipeData = data.routes[data.routes.length - 1].params;
          let recipeName = recipeData.name;
          let description = recipeData.description;
          let ingredientsList = recipeData.ingredients;
          let portions = recipeData.portions;
          let stepList = recipeData.steps;
          let allergensList = recipeData.tags;
          console.log(
            recipeName,
            recipeName,
            description,
            ingredientsList,
            portions,
            stepList,
            allergensList
          );
        } catch (e) {}

        return updateList;
      },
      [navigation]
    );
  });

  let [fontsLoaded, error] = useFonts({
    Lato_700Bold,
  });

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (!fontsLoaded) {
    return (
      <AppLoading autoHideSplash /> //AppLoading will only be dispalyed while fonts loaded is false
    );
  } else
    return cameraView ? (
      <CamView />
    ) : (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 5 }}>
          <FlatList
            style={{ flex: 5 }}
            ListHeaderComponent={
              <View style={styles.header}>
                <View style={styles.nameView}>
                  <Text style={styles.name}>{recipeName}</Text>

                  <Text style={styles.portions}>{portions} Portioner</Text>

                  <Text style={styles.description}>{description}</Text>
                </View>

                {photoTaken ? (
                  <ImageBackground
                    source={{ uri: photo.uri }}
                    resizeMode="cover"
                    style={styles.pictureView}
                  >
                    <TouchableOpacity
                      onPressIn={() => setPhotoTaken(false)}
                      style={{ flex: 1 }}
                    >
                      <View
                        style={{
                          backgroundColor: "#00000099",
                          width: "20%",
                          height: "20%",
                          borderRadius: 30,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: "white" }}>X</Text>
                      </View>
                    </TouchableOpacity>
                  </ImageBackground>
                ) : (
                  <ImageBackground
                    source={require("../../assets/images/camera.jpeg")}
                    resizeMode="cover"
                    style={styles.pictureView}
                  >
                    <TouchableOpacity
                      style={styles.pictureView}
                      onPress={() => toggleCam(cameraView)}
                    ></TouchableOpacity>
                  </ImageBackground>
                )}
              </View>
            }
            data={ingredientsList.concat(stepList)}
            renderItem={(item, index) => {
              {
                return renderItem(item, index);
              }
            }}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={<View />}
          />
        </View>
        <View style={styles.continueButtonView}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => handleRecipeDone()}
          >
            <Text style={styles.continueButtontext}>Färdig</Text>
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
    width: "100%",
  },
  nameView: {
    flex: 2,
    width: "100%",
    backgroundColor: "#00000000",
  },
  stepsListView: {
    marginTop: 10,
    flex: 7,

    width: "100%",

    justifyContent: "center",
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
  listItem: {
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    margin: 10,
    //marginRight: 20,
    flexDirection: "row",
  },
  stepItem: {
    height: 50,

    marginBottom: 15,
  },
  ingredientTitle: {
    // The name of the ingredient in the Flatlist
    fontSize: 20,
    marginLeft: 5,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
  stepTitle: {
    // The name of the ingredient in the Flatlist
    fontSize: 20,
    margin: 5,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
  ingredientBrand: {
    fontSize: 12,
    marginLeft: 5,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
  header: {
    marginLeft: 10,
    flexDirection: "row",
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000000",
  },
  pictureView: {
    width: 100,
    height: 100,
    margin: 5,
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
  stepNrView: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    marginRight: 5,
    backgroundColor: "#9CFCAC",
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
  listIndexText: {
    fontSize: 24,
    fontWeight: "bold",
  },

  describeRecipeBox: {
    flex: 1,

    backgroundColor: "#d9dbda",

    borderRadius: 5,

    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },

  camContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
    height: 100,
  },
  button: {
    flex: 0.1,
    backgroundColor: "red",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#eee",
  },
  shutterButtonContainer: {
    width: "100%",
    height: "20%",

    borderRadius: 50,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "#00000000",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },

  description: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
    fontFamily: "Lato_700Bold",
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
});
