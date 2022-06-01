import React, { Component, useState } from "react";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from "../utils/api";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

let stepList = ["Steg 1"];

export class StepListFeature extends Component {
  state = {
    textInputs: [],
  };

  addStep = (index) => {
    let stepIndex = index + 1;
    stepList.push("Steg-" + stepIndex + " : ");
  };

  handleRecipeDone() {
    this.props.navigation.navigate(
      "RecipeSummary",
      (recipeData = {
        name: this.props.name,
        description: this.props.description,
        ingredients: this.props.ingredients,
        portions: this.props.portions,
        steps: this.state.textInputs,
        tags: JSON.stringify(this.props.allergens),
      })
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.stepListView}>
          <Text>Instruktioner</Text>
          <FlatList
            style={styles.stepList}
            data={stepList}
            extraData={this.textInputs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.listItem}>
                  <View style={styles.stepNrView}>
                    <Text style={styles.listIndexText}>{index + 1}</Text>
                  </View>

                  <TextInput
                    style={styles.describeRecipeInput}
                    placeholder="Beskriv Steg..."
                    multiline={true}
                    blurOnSubmit={true}
                    numberOfLines={2}
                    keyboardType="default"
                    onChangeText={(text) => {
                      let { textInputs } = this.state;
                      textInputs[index] = text;
                      this.setState({
                        textInputs,
                      });
                    }}
                    value={this.state.textInputs[index]}
                  />

                  {index == stepList.length - 1 ? (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => {
                        let { textInputs } = this.state;
                        textInputs[index] = "";
                        if (stepList.length > 1) {
                          stepList.splice(this.state.index, 1);
                        }
                        this.setState({
                          textInputs,
                        });
                      }}
                    >
                      <FontAwesome
                        name="remove"
                        size={25}
                        color={"#000"}
                        style={{ marginLeft: 2 }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={{ height: 40, width: 40, marginLeft: 5 }} />
                  )}
                </View>
              );
            }}
          />
        </View>
        <View style={styles.addStepBtnView}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              this.addStep(stepList.length);
              let { textInputs } = this.state;
              this.setState({
                textInputs,
              });
            }}
          >
            <Text style={styles.addButtontext}>Lägg Till Steg</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.continueButtonView}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => this.handleRecipeDone()}
          >
            <Text style={styles.continueButtontext}>Fortsätt</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepListView: {
    marginTop: 10,
    flex: 4,

    width: "100%",
  },
  stepList: {},
  listItem: {
    height: 40,

    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    margin: 10,
    //marginRight: 20,
    flexDirection: "row",
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

  describeRecipeInput: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#d9dbda",
    borderRadius: 5,

    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  clearButton: {
    height: 40,
    width: 40,
    marginLeft: 5,
    backgroundColor: "#F47174",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",

    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  addStepBtnView: {
    flex: 1.5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#9CFCAC",
    width: "50%",
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
  addButtontext: {
    fontSize: 18,
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

  describeRecipeInput: {
    height: "100%",
    padding: 10,

    width: "80%",
    backgroundColor: "#d9dbda",
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
  stepItem: {
    height: 50,

    marginBottom: 15,
  },
});
