import { StatusBar } from "expo-status-bar";

import { useEffect, useState, React} from "react";
import { StyleSheet, Text, View, TouchableOpacity, Button, ImageBackground } from "react-native";
import { useNavigation, setParams} from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import AppLoading from "expo-app-loading";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";
import { FlatList, TextInput } from "react-native-gesture-handler";
import preferences from "../utils/preferences";
import PrefsList from "../components/PrefsList"
import { KeyboardAvoidingView } from "react-native";
import api from "../utils/api";


export default function CreateIngredientScreen({ navigation }) {
  let data = navigation.getState();
  let [fontsLoaded, error] = useFonts({Lato_700Bold,});
  const [itemName, setItemName] = useState()
  const [itemBrand, setItemBrand] = useState()
  const [packageSize, setPackageSize] = useState()
  const [ingredients, setIngredients] = useState()
  const [GTIN, setGTIN] = useState()
  
  let localPrefs = preferences.preferences()
  
  const [loadedPrefs, setIsEnabled] = useState(preferences.preferences());
  
  
  const toggleSwitch = async (newState, element) => {
    var newPrefs = { ...loadedPrefs, [element]: newState };
    setIsEnabled(newPrefs);
    
  };

  useEffect(() => {
    
    const updateList = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      setGTIN(data.routes[data.routes.length-1].params.GTIN)
      })

    return updateList
  }, [navigation]);

  const updateAndNavigate = (props) => {
      /*
       brand: props.brand,
        ingredients: props.ingredients,
        name: props.name,
        packagesize: props.packageSize,
        image: props.image,
        allergens: props.allergens */
      console.log("Props")
      console.log(props)
      let gtin = "0"+props.GTIN
      console.log(gtin)
    api.postProduct({'GTIN': gtin, 'name': props.name, 'brand': props.brand,'ingredients': props.ingredients, 'packagesize': props.packageSize,'image': props.image, 'allergens': JSON.stringify(props.allergens)})
      
    navigation.navigate("Root");
  }
  
  

  if (!fontsLoaded) {
    return (
      <AppLoading autoHideSplash /> //AppLoading will only be dispalyed while fonts loaded is false
    );
  } else
  
  return (
    <SafeAreaView style= {styles.root}>
      
        <View style={styles.itemHeaderView}>
            <View style={styles.itemTitleView}>
                <View style={{flex: 1}}>
                    <TextInput style= {styles.smallInfoInput}
                    value={itemName}
                    onChangeText={setItemName}
                    placeholder={"Artikelnamn..."}
                    blurOnSubmit={true}>

                    </TextInput>
                </View>
                
                <View style={{flex: 1}}>
                    <TextInput style= {styles.smallInfoInput}
                    value={itemBrand}
                    onChangeText={setItemBrand}
                    placeholder={"Varumärke..."}
                    blurOnSubmit={true}>

                    </TextInput>
                </View>
                
                <View style={{flex: 1}}>
                    <TextInput style= {styles.smallInfoInput}
                    value={packageSize}
                    onChangeText={setPackageSize}
                    placeholder={"Förpackningsstorlek..."}
                    blurOnSubmit={true}>

                    </TextInput>
                </View>
                
            </View>
            
            <ImageBackground source={require('../assets/images/falafelsallad.jpg')} resizeMode="cover" style={styles.cameraButtonView}>
                
            </ImageBackground>
        </View>
        <View style={styles.itemIngredientsView}>
            <TextInput 
            style={styles.infoInput}
            placeholder={"Ingredienser..."}
            value={ingredients}
            onChangeText={setIngredients}
            multiline={true}
            blurOnSubmit={true}/>
        </View>
        <View style={styles.itemallergensView}>
            <PrefsList data={loadedPrefs} toggleSwitch={toggleSwitch} columns = {2}>

            </PrefsList>
        </View>
        
        <View style={styles.continueButtonView}>
        <TouchableOpacity style={styles.continueButton}
        onPress= {() => {updateAndNavigate({'GTIN': GTIN, 'name': itemName, 'brand': itemBrand,'packageSize': packageSize,'ingredients': ingredients,'allergens': loadedPrefs, 'image': ""})}}>
          <Text style={styles.continueButtontext}>
            Fortsätt
          </Text>
        </TouchableOpacity>
      </View>
     
    

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex:1,
    
    
  },
  container: {
      flex: 1,
  },
  itemHeaderView: {
      flexDirection: "row",
      flex:1.5,
      justifyContent: 'center',
      borderBottomWidth: 2,
      borderStyle: "solid",
      borderBottomColor: "#aaa",
      margin: 10,
      
  },
  itemTitleView: {
      flex: 1.5,
      margin: 10,
      
      
  },
  cameraButtonView: {
      flex:1,
      margin: 10,
      
      shadowOffset: {
        width: 2,
        height: 5,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2,
       
      
  },
  itemIngredientsView: {
   flex: 1,
   margin: 10,
   shadowOffset: {
    width: 2,
    height: 5,
  },
  shadowOpacity: 0.3,
  shadowRadius: 2,
   
  },
  itemallergensView: {
      flex:3,
      margin: 10,
      
  },
  ingredientTitleView: {
    flex:1,
    margin: 10,
    backgroundColor: "#eee", 
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  infoInput: {
      flex: 1, 
      margin:10,
      padding: 10,
      backgroundColor: "#d5d5d5",
      borderRadius: 2,
  },
  smallInfoInput: {
      flex: 1, 
      margin:2,
      
      backgroundColor: "#d5d5d5",
      borderRadius: 2,
      padding: 10,
      shadowOffset: {
        width: 2,
        height: 5,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2,
  },
  continueButtonView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: 'center',
  },
  continueButton: {
    backgroundColor: "#9CFCAC",
    width: '40%',
    height: 40,
    borderRadius: 10,
    margin: 20,        
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin:40,
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,

  },
  continueButtontext: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lato_700Bold'
  },
});
