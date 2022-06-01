import { StyleSheet, TouchableOpacity, safeAreaView, Button, Pressable} from 'react-native';
import React, { useState, useEffect } from "react";

import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, SectionList  } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useNavigation } from "@react-navigation/native"

import AppLoading from "expo-app-loading";
import { StepListFeature } from "../../components/StepListFeature"
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";


let stepList = []


export default function RecipeDescriptionScreen() {
  
  
  const navigation = useNavigation();
  
  
  let data = navigation.getState();
  
  let recipeName = data.routes[data.routes.length - 1].params.recipeName;
  let portions = data.routes[data.routes.length - 1].params.portions;
  let ingredientsList = data.routes[data.routes.length - 1].params.ingredients;
  let allergensList =  data.routes[data.routes.length - 1].params.allergens;
  let description =  data.routes[data.routes.length - 1].params.description;
  console.log("Decsription is", description)
  var ingredient = ""
  var amount = ""
  
  
 

  useEffect(() => {
    
    const updateList = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      
      
      
      if(stepList.length === 0){
       stepList.push("First step")}
              })

      data = navigation.getState();
      
      
   
      

    return updateList
  }, [navigation]);




 
    
  

    


  let [fontsLoaded, error] = useFonts({
    Lato_700Bold,
  });
  if (!fontsLoaded) {
    return (
      <AppLoading autoHideSplash /> //AppLoading will only be dispalyed while fonts loaded is false
    );
  } else
  
  return (
    
    
    <KeyboardAvoidingView style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={100}>
    
    
      <View style={styles.nameView}>
        <Text style={styles.name}>{recipeName}</Text>
      
        <Text style={styles.portions}>{portions} Portioner</Text>
      </View>
      <View style={styles.stepsListView}>
        
        <StepListFeature ingredients = {ingredientsList} allergens = {allergensList} name= {recipeName} portions = {portions} navigation={navigation} description={description}></StepListFeature>
        
      </View>
      
     

    </KeyboardAvoidingView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: "#FFFDFA",
    width: "100%"
  },
  nameView: {
    flex:1.5,
    width: "100%",
    borderBottomColor: "#bbb",
    borderBottomWidth: 2
  },
  stepsListView: {
    marginTop: 10,
    flex: 7,
    
    width: "100%",
    
    justifyContent: 'center'
  },
 
  name: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: "Lato_700Bold"
  },
  portions: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: "Lato_700Bold"
  },
  stepItem: {
    height: 50,
    
    
    marginBottom: 15,
  },
  ingredientTitle: { // The name of the ingredient in the Flatlist
    fontSize: 20,
    marginTop: 20,
    fontFamily: 'Lato_700Bold',
    fontWeight: "bold",
  },

  
});
