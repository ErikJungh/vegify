import { StyleSheet, TouchableOpacity } from "react-native";
import SearchFeature from "../components/SearchFeature";
import { Text, View } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import AppLoading from "expo-app-loading";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";
import { useNavigation } from "@react-navigation/native";

export default function SearchScreen() {
  const navigation = useNavigation();
  let data = navigation.getState();
  var isAddToRecipe = false;
  let recipeName;
  let portions;
  try {
    isAddToRecipe = data.routes[data.routes.length - 1].params.addToRecipe;
    recipeName = data.routes[data.routes.length - 1].params.recipeName;
    portions = data.routes[data.routes.length - 1].params.portions;
    
  }
  catch (error) {
    console.log(error)
  }
  
  return (
    <View style={styles.container}>
        <SearchFeature 
        function = {'products'}
        style = {styles.searchBar} 
        isAdd = {isAddToRecipe}
        recipeName = {recipeName}
        portions = {portions}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
