import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, FlatList, View, Text, Switch } from "react-native";
import { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import { useFonts, Lato_700Bold } from "@expo-google-fonts/lato";

const Item = (props) => (
  <View key={props.element} style={styles.preference}>
    <View style={styles.preferenceText}>
      <Text style={styles.text}>{props.element}</Text>
    </View>
    <View style={styles.preferenceSwitch}>
      <Switch
        trackColor={{ false: "transparent", true: "transparent" }}
        thumbColor={props.isEnabled ? "darkgreen" : "gray"}
        ios_backgroundColor="white"
        onValueChange={(newState) =>
          props.toggleSwitch(newState, props.element)
        }
        value={props.isEnabled}
      />
    </View>
  </View>
);

const DynamicItem = (props) => (
  <View key={props.element} style={styles.dynPreference}>
    <View style={styles.dynPreferenceText}>
      <Text style={styles.dynText}>{props.element}</Text>
    </View>
    <View style={styles.dynPreferenceSwitch}>
      <Switch
        trackColor={{ false: "transparent", true: "transparent" }}
        thumbColor={props.isEnabled ? "darkgreen" : "gray"}
        ios_backgroundColor="white"
        onValueChange={(newState) =>
          props.toggleSwitch(newState, props.element)
        }
        value={props.isEnabled}
      />
    </View>
  </View>
);

const PrefsList = (props) => {
  let [fontsLoaded, error] = useFonts({
    Lato_700Bold,
  });
  const renderItem = ({ item }) => {
    return (
      <Item
        isEnabled={props.data[item]}
        toggleSwitch={props.toggleSwitch}
        element={item}
      />
    );
  };
  const renderDynamicItem = ({ item }) => {
    return (
      <DynamicItem
        isEnabled={props.data[item]}
        toggleSwitch={props.toggleSwitch}
        element={item}
      />
    );
  };
  var prefsData = [];
  if (Object.keys(props.data) != null) {
    prefsData = Object.keys(props.data).sort();
  }
  if (!fontsLoaded) {
    return (
      <AppLoading autoHideSplash /> //AppLoading will only be dispalyed while fonts loaded is false
    );
  } else
    return (
      <SafeAreaView style={({ height: "100%" }, { flex: 1 })}>
        <View style={{ width: "100%" }}>
          <FlatList
            data={prefsData}
            numColumns={props.columns ? props.columns: 1}
            renderItem={props.columns ?renderDynamicItem:  renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
    );
};

export default PrefsList;

const styles = StyleSheet.create({
  preference: {
    borderBottomWidth: 2,
    borderStyle: "solid",
    borderBottomColor: "#aaa",
    marginHorizontal: 10,
    marginBottom: 10,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
    fontSize: 35,
    marginLeft: 10,
  },
  preferenceText: {
    flex: 6,
  },
  preferenceSwitch: {
    flex: 1,
    marginRight: 10,
  },
  prefsList: {
    flex: 1,
    width: "100%",
  },
  dynPreference: {
    
    
    borderBottomWidth: 2,
    borderStyle: "solid",
    borderBottomColor: "#aaa",
    marginHorizontal: 10,
    marginBottom: 10,
    
    width: "45%",
    flexDirection: "row",
    alignItems: "center",
  },
  dynText: {
    fontFamily: "Lato_700Bold",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 10,
  },
  dynPreferenceText: {
    flex: 2,
  },
  dynPreferenceSwitch: {
    flex: 1,
    marginRight: 10,
  },
  dynPrefsList: {
    flex: 1,
    width: "100%",
  },

});
