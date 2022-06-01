import { StyleSheet } from 'react-native';
import FirstScreenContent from '../components/FirstScreenContent';
import { Text, View } from '../components/Themed';


export default function TabOneScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FirstScreenContent path="/screens/TabOneScreen.js" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
