import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, HeaderBackButton } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../contexts/AppContext";
import OnboardingScreen from "../screens/OnboardingScreen";
import HomeScreen from "../screens/Home";
import SplashScreen from "../screens/Splash";
import ProfileScreen from "../screens/Profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header/Header";
import Avatar from "../components/Avatar/Avatar";
import Button from "../components/Button/Button";
import { checkMenuTableAndPopulateData, selectAllMenu } from "../database";
import * as Font from "expo-font";

const RootNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { globalState, setOnboardingCompleted, updateUser } = useContext(AppContext);
  const { isOnboardingCompleted } = globalState;
  const [isLoading, setIsLoading] = useState(true);
  const [fontLoaded] = Font.useFonts({
    Markazi: require("../assets/fonts/MarkaziText-Regular.ttf"),
    Karla: require("../assets/fonts/Karla-Regular.ttf"),
  });

  const loadApp = async () => {
    if (!fontLoaded) return;
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        setOnboardingCompleted(true);
      }
      updateUser(JSON.parse(user));
      const existingMenuItems = await selectAllMenu();
      if (user && existingMenuItems.length) {
        setIsLoading(false);
        return;
      }
      await checkMenuTableAndPopulateData();
      setIsLoading(false);
    } catch (error) {
      console.error("There was an error", error);
      setIsLoading(false);
    }
  };

  // When app opens run this code
  useEffect(() => {
    loadApp();
  }, [fontLoaded]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isOnboardingCompleted ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={({ navigation }) => ({
                headerTitle: (props) => <Header {...props} />,
                headerRight: () => (
                  <Avatar
                    onPress={() => navigation.navigate("Profile")}
                    onlyAvatar={true}
                  />
                ),
              })}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={({ navigation }) => ({
                gestureEnabled: false,
                headerShown: true,
                headerLeft: () => <></>,
                headerRight: (props) => (
                <Button
                   onPress={() => navigation.navigate("Home")}
                   onlyButton={true}
                 />
                ),
                })}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Onboard"
              component={OnboardingScreen}
             options={({ navigation }) => ({
                 headerTitle: (props) => <Header {...props} />,
                 gestureEnabled: false,
                 headerShown: true,
                 headerLeft: () => <></>,
                 headerRight:  (props) => <></>
                })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;