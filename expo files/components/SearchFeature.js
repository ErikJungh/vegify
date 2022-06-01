// searchFeature.js
import React, { useState, useEffect } from "react";
import { useLinkProps, useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import List from "./List";
import SearchBar from "./SearchBar";
import fetchProductsFromDB from "./SearchBar";

const SearchFeature = (props) => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [searchData, setSearchData] = useState();
  // Initiate search data as empy list
  //console.log(props)
  const navigation = useNavigation();
  useEffect(() => {
    setSearchData([]);
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      {!clicked}

      <SearchBar
        isAdd={props.isAdd}
        recipeName={props.recipeName}
        portions={props.portions}
        searchData={searchData}
        setSearchData={setSearchData}
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked}
        function={props.function}
      />
      {
        <List
          isAdd={props.isAdd}
          recipeName={props.recipeName}
          portions={props.portions}
          navigation={navigation}
          searchPhrase={searchPhrase}
          data={searchData}
          
          setClicked={setClicked}
          function={props.function}
        />
      }
    </SafeAreaView>
  );
};

export default SearchFeature;

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    width: "100%",
    marginTop: 20,
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: "10%",
  },
});
