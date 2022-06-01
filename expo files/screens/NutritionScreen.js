import { StatusBar } from "expo-status-bar";

import { useEffect, useState, React } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useNavigation, setParams } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import AppLoading from "expo-app-loading";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";
import { FlatList, TextInput } from "react-native-gesture-handler";
import localStorage from "../utils/localStorage";
import preferences from "../utils/preferences";

export default function NutritionScreen({ navigation }) {
  const [loadedPrefs, setPrefs] = useState(preferences.preferences());
  const [amount, setAmount] = useState();
  const [unit, setUnit] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  let data = navigation.getState();

  let [fontsLoaded, error] = useFonts({
    Lato_700Bold,
  });

  let loadFromStorage = async function () {
    var prefs = await localStorage.readPreferences();
    return prefs;
  };

  useEffect(() => {
    const updateList = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      loadFromStorage().then((preferences) => {
        setPrefs(preferences);
      });
    });

    return updateList;
  }, [navigation]);

  let isAddToRecipe = data.routes[data.routes.length - 1].params.addToRecipe;
  let recipeName = data.routes[data.routes.length - 1].params.recipeName;
  let portions = data.routes[data.routes.length - 1].params.portions;
  data = data.routes[data.routes.length - 1].params.ScannedData;
  let prefs = data.preferenser;

  //Boolean to determine if we are viewing the item to add it to a recipe or not
  //let isAddToRecipe = data.routes[data.routes.length - 1].params.addToRecipe;

  let ingredienser = [];
  let allergens = [];
  let alleregenesPresent = [];
  for (const key in prefs) {
    if (prefs[key] || key === "Vegetarian" || key === "Vegan") {
      allergens.push(key);
    }
    if (prefs[key]) {
      alleregenesPresent.push(key);
    }
  }
  let ingredienserArray = [];
  if (data.ingredienser !== null) {
    ingredienserArray = data.ingredienser;
  } else {
    ingredienserArray = [];
  }
  for (const key in data.ingredienser) {
    ingredienser.push(data.ingredienser[key]);
  }

  const AllergeneItemVeg = ({ item }) => (
    <View style={styles.allergeneItem}>
      {!alleregenesPresent.some((v) => v === item) ? (
        <Text style={styles.allergeneWarning}>{item}</Text>
      ) : (
        <Text style={styles.allergeneTitleVeg}>{item}</Text>
      )}
      {!alleregenesPresent.some((v) => v === item) && (
        <Text style={styles.allergeneWarningSub}>Ej Lämplig För En {item}</Text>
      )}
    </View>
  );

  const AllergeneItem = ({ item }) => (
    <View style={styles.allergeneItem}>
      {!loadedPrefs[item] ? (
        <Text style={styles.allergeneTitle}>{item}</Text>
      ) : (
        <Text style={styles.allergeneWarning}>{item}</Text>
      )}
      {loadedPrefs[item] && (
        <Text style={styles.allergeneWarningSub}>
          Denna vara innehåller {item}
        </Text>
      )}
    </View>
  );
  const IngredientItem = ({ item }) => (
    <View style={styles.ingredientItem}>
      <Text style={styles.ingredientTitle}>{item}</Text>
    </View>
  );

  const renderAllergeneItem = ({ item }) => {
    if (loadedPrefs == null) {
      loadFromStorage().then((preferences) => {
        setPrefs(preferences);
      });
    }
    if (item === "Vegan" || item === "Vegetarian") {
      return <AllergeneItemVeg item={item} />;
    } else {
      return <AllergeneItem item={item} />;
    }
  };

  const renderIngredientItem = ({ item }) => {
    //item = item.replace("", "");
    item = item.split("_").join("");
    item = item.charAt(0).toUpperCase() + item.slice(1);

    return <IngredientItem item={item} />;
  };

  function navigateAndUpdate() {
    if (
      amount != undefined &&
      amount.length > 0 &&
      unit != undefined &&
      unit.length > 0
    ) {
      setErrorMessage(null);
      navigation.navigate("RecipeCreation", {
        returnedIngredient: data,
        returnedAmount: amount,
        returnedUnit: unit,
        recipeName: recipeName,
        portions: portions,
        allergens: prefs,
      });
    } else {
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
        <View style={styles.container}>
          {isAddToRecipe && (
            <View style={styles.amountInputView}>
              <View style={styles.amountTitleView}>
                <Text style={styles.amountTitleText}>
                  Hur mycket {data.namn}?
                </Text>
                <Button
                  style={styles.cntButton}
                  title="Lägg till"
                  onPress={() => navigateAndUpdate()}
                ></Button>
              </View>
              <View style={styles.amountUnitInput}>
                <View style={{ flex: 3 }}>
                  <TextInput
                    style={styles.amountInput}
                    onChangeText={setAmount}
                    keyboardType={"number-pad"}
                  />
                </View>
                <View style={{ flex: 7 }}>
                  <TextInput
                    style={styles.amountInput}
                    onChangeText={setUnit}
                  />
                </View>
              </View>
            </View>
          )}
          {errorMessage == undefined ? null : (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          )}
          <View style={styles.titleView}>
            <Text style={styles.title}>{data.namn}</Text>
            {!isAddToRecipe && (
              <Text style={styles.forpackningsstorlek}>
                {data.Forpackningsstorlek}
              </Text>
            )}
          </View>

          <View style={styles.allergensView}>
            <FlatList
              style={styles.allergens}
              data={allergens}
              renderItem={renderAllergeneItem}
              keyExtractor={(item, index) => index.toString()}
            ></FlatList>
          </View>
          <View style={styles.ingredienserView}>
            <View style={styles.ingredienserTitleView}>
              <Text style={styles.ingredienserTitle}>Ingredienser</Text>
            </View>
            <FlatList
              style={styles.ingredienser}
              data={ingredienserArray}
              renderItem={renderIngredientItem}
              keyExtractor={(item, index) => index.toString()}
            ></FlatList>
          </View>
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFDFA",
  },
  container: {
    flex: 1,
  },
  titleView: {
    flex: 2,
    borderBottomWidth: 2,
  },
  allergensView: {
    flex: 3,
    marginBottom: "10%",
  },
  ingredienserView: {
    flex: 5,
  },
  ingredienserTitleView: {
    borderBottomWidth: 2,
    borderBottomColor: "#aaa",
    marginHorizontal: "20%",
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: RFPercentage(3),
    borderBottomWidth: 2,
    borderBottomColor: "#aaa",
  },
  forpackningsstorlek: {
    flex: 1,
    marginLeft: 10,
    fontSize: RFPercentage(3),
  },
  allergens: {
    flex: 1,
    marginHorizontal: 10,
  },
  ingredienser: {
    flex: 1,
    marginHorizontal: 10,
  },
  allergeneTitle: {
    fontSize: 25,
    marginTop: 10,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
    marginBottom: 2,
  },
  allergeneTitleVeg: {
    fontSize: 25,
    marginTop: 10,
    marginBottom: 2,
    color: "green",
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
  allergeneWarning: {
    fontSize: 25,
    marginTop: 10,
    marginBottom: 2,
    color: "red",
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
  allergeneWarningSub: {
    fontSize: 15,
    marginTop: 5,
    color: "#222",
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
  allergeneItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#aaa",
  },
  ingredientItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#aaa",
  },
  ingredientTitle: {
    // The name of the ingredient in the Flatlist
    fontSize: 20,
    marginTop: 15,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
  ingredienserTitle: {
    //The title with the the "Ingredients"
    fontSize: 25,
    marginBottom: 10,
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
  },
  amountInputView: {
    flex: 1.5,
    height: "100%",
    marginHorizontal: 10,
    marginBottom: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  amountInput: {
    height: "95%",

    padding: 10,
    flexDirection: "row",
    width: "90%",
    backgroundColor: "#eee",
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
  amountTitleView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  amountTitleText: {
    flex: 3,
    fontSize: 15,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  cntButton: {
    flex: 1,
    fontSize: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  amountUnitInput: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
  errorMessage: {
    paddingLeft: "25%",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
    fontFamily: "Lato_700Bold",
    padding: "1%",
    color: "black",
    fontSize: 16,
  },
});
