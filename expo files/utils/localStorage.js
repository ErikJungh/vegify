import AsyncStorage from "@react-native-async-storage/async-storage";

export default {
  async storePreferences(preferencesJSON) {
    try {
      let dataSerial = JSON.stringify(preferencesJSON);

      await AsyncStorage.setItem("@preferences", dataSerial);
    } catch (e) {
      console.log(e);
    }
  },
  async readPreferences() {
    try {
      const value = await AsyncStorage.getItem("@preferences");
      if (value !== null) {
        return JSON.parse(value);
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
    }
  },
};
