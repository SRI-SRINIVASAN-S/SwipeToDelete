import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SwipeListScreen from "./screens/SwipeListScreen";
import PreviewScreen from "./screens/PreviewScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalStyles } from "./constants/colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const BottomTabs = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <GestureHandlerRootView>
          <BottomTabs.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
              headerTintColor: "white",
              tabBarActiveTintColor: GlobalStyles.colors.accent500,
              tabBarStyle: {
                backgroundColor: GlobalStyles.colors.primary500,
                padding: 30,
              },
              tabBarLabelStyle: {
                fontSize: 13,
                fontFamily: "Georgia",
                fontWeight: 200,
              },
              tabBarActiveTintColor: GlobalStyles.colors.accent500,
            }}
          >
            <BottomTabs.Screen
              name="SwipeList"
              component={SwipeListScreen}
              options={{
                title: "Swipe to Delete",
                tabBarLabel: "Tasks",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="trash-bin" size={28} color="white" />
                ),
              }}
            />
            <BottomTabs.Screen
              name="Preview"
              component={PreviewScreen}
              options={{
                title: "Feature Preview",
                tabBarLabel: "Preview",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="play-circle" size={28} color="white" />
                ),
              }}
            />
          </BottomTabs.Navigator>
        </GestureHandlerRootView>
      </NavigationContainer>
    </>
  );
}
