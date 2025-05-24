import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";

const PDF_URL =
  "https://drive.google.com/file/d/1eZ5lY-1LnG0uuGSJHsCsTOk1bEbuAB_t/view?usp=sharing";

const PreviewScreen = () => {
  return (
    <WebView
      style={styles.container}
      source={{
        uri: PDF_URL,
      }}
    />
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
