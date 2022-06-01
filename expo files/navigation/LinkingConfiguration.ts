/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: "one",
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: "two",
            },
          },
        },
      },

      Preferences: "preferences",
      NotFound: "*",
      Scanner: "scanner",
      Nutrition: "nutrition",
      Search: "search",
      RecipeCreation: "recipeCreation",
      RecipeSettings: "recipeSettings",
      RecipeDescription: "recipeDescription",
      RecipeSummary: "recipeSummary",
      RecipeScreen: "recipeScreen",
      CreateIngredient: "createIngredient",
      ReviewScreen: "reviewScreen",
    },
  },
};

export default linking;
