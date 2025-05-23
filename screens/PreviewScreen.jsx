import { View, Text, StyleSheet } from "react-native";

const PreviewScreen = () => {
  return (
    <View style={styles.container}>
      <Text>DemoScreen</Text>
    </View>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
