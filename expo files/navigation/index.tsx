/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import {
  StyleSheet,
  ColorSchemeName,
  Pressable,
  View,
  LogBox,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import NotFoundScreen from "../screens/NotFoundScreen";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import BarcodeScannerScreen from "../screens/BarcodeScannerScreen";
import NutritionScreen from "../screens/NutritionScreen";
import RecipeCreationScreen from "../screens/recipeScreenComponents/RecipeCreationScreen";
import RecipeSettingsScreen from "../screens/recipeScreenComponents/RecipeSettingsScreen";
import RecipeDescriptionScreen from "../screens/recipeScreenComponents/RecipeDescriptionScreen";
import RecipeSummaryScreen from "../screens/recipeScreenComponents/RecipeSummaryScreen";
import SearchScreen from "../screens/SearchScreen";
import PreferenceScreen from "../screens/PreferenceScreen";
import CreateIngredientScreen from "../screens/CreateIngredientScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { Header } from "react-native/Libraries/NewAppScreen";
import RecipeScreen from "../screens/RecipeScreen";
import ReviewScreen from "../screens/ReviewScreen";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  LogBox.ignoreLogs(["Remote debugger"]);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: "#9CFCAC" },
        }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Screen
        name="Scanner"
        component={BarcodeScannerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: true,
          title: "Sök",
          headerStyle: { backgroundColor: "#9CFCAC" },
        }}
      />
      <Stack.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{
          headerShown: true,
          title: "Innehållsförteckning",
          headerStyle: { backgroundColor: "#9CFCAC" },
        }}
      />
      <Stack.Screen
        name="RecipeSettings"
        component={RecipeSettingsScreen}
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: "#9CFCAC" },
        }}
      />
      <Stack.Screen
        name="RecipeCreation"
        component={RecipeCreationScreen}
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: "#9CFCAC" },
        }}
      />
      <Stack.Screen
        name="RecipeDescription"
        component={RecipeDescriptionScreen}
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: "#9CFCAC" },
        }}
      />
      <Stack.Screen
        name="RecipeSummary"
        component={RecipeSummaryScreen}
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: "#9CFCAC" },
        }}
      />
      <Stack.Screen
        name="CreateIngredient"
        component={CreateIngredientScreen}
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: "#9CFCAC" },
        }}
      />

      <Stack.Screen
        name="RecipeScreen"
        component={RecipeScreen}
        options={{
          headerShown: true,
          title: "Recept",
          headerStyle: { backgroundColor: "#9CFCAC" },
        }}
      />

      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="Preferences"
          component={PreferenceScreen}
          options={{
            headerStyle: { backgroundColor: "#9CFCAC" },
            title: "Preferenser",
          }}
        />
        <Stack.Screen
          name="ReviewScreen"
          component={ReviewScreen}
          options={{
            headerStyle: { backgroundColor: "#9CFCAC" },
            title: "Betygsätt recept",
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

StyleSheet.create({
  oval: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFDFA",
    transform: [{ scaleX: 2 }],
  },
});

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].text,
        tabBarActiveBackgroundColor: Colors[colorScheme].tint,
        tabBarInactiveBackgroundColor: Colors[colorScheme].tint,
        tabBarStyle: { height: 150, marginBottom: -30, borderRadius: 1000 },
      }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<"TabOne">) => ({
          title: "Skanna",
          headerTitle: "",
          headerStyle: { backgroundColor: "#9CFCAC" },
          tabBarLabelStyle: { fontSize: 20, marginBottom: 40 },
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="barcode" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Preferences")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="cog"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={({ navigation }: RootTabScreenProps<"TabTwo">) => ({
          tabBarLabelStyle: { fontSize: 20, marginBottom: 40 },
          headerStyle: { backgroundColor: "#9CFCAC" }, //9CFCAC

          title: "Recept",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="food-variant"
              size={40}
              style={{ marginBottom: -30 }}
              color={color}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Preferences")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="cog"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={40} style={{ marginBottom: -30 }} {...props} />;
}

const styles = StyleSheet.create({
  oval: {
    flex: 1,
    color: "#FFFDFA",
    alignItems: "center",
    justifyContent: "center",
  },
  navbar: {
    flex: 1,
    color: "#FFFDFA",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    flex: 1,
  },
});
