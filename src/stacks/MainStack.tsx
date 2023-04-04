import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useColorMode } from "native-base";
import React, { useContext, useEffect } from "react";
import { AppState } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { navigationConfig } from "../config/screens";
import { isAndroid } from "../constants/core";
import screens from "../constants/screens";
import { AppContext } from "../context/app/AppContext";
import Read from "../screens/docs/Read";
import LockScreen from "../screens/LockScreen";
import { syncLocalData } from "../services/local/startup";
import TabsStack from "./TabsStack";

interface MainStackProps {
  migrationComplete: boolean;
  onNavReady: () => void;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldSetBadge: true,
    shouldPlaySound: true,
  }),
});

export default function MainStack({ migrationComplete, onNavReady }: MainStackProps) {
  const { colorMode } = useColorMode();
  const { state } = useContext(AppContext);

  // Watch for app state and notifications and automatically sync data when in focus
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener("change", (appState) => {
      if (appState == "active" && migrationComplete && !isAndroid) {
        syncLocalData().then().catch();
      }
    }
    );

    return () => { appStateSubscription.remove(); };
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaProvider>
      <StatusBar animated={true} style={colorMode === "dark" ? "light" : "dark"} />
      <NavigationContainer onReady={onNavReady}>
        {!state?.isSignedIn && state?.useBiometrics ?
          <Stack.Navigator {...navigationConfig(colorMode)}>
            <Stack.Screen name={screens.LOCKSCREEN.screenName} component={LockScreen} options={{ headerTitle: screens.LOCKSCREEN.screenTitle, headerShown: false }} />
          </Stack.Navigator>
          :
          <Stack.Navigator {...navigationConfig(colorMode)}>
            <Stack.Screen name="Tabs" component={TabsStack} options={{ headerShown: false }} />
            <Stack.Screen name={screens.READ_DOCUMENT.screenName} component={Read} options={{ headerShown: false }} />
          </Stack.Navigator>
        }
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
