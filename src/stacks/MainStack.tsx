import {AntDesign, Ionicons} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StatusBar} from "expo-status-bar";
import {Icon, useColorMode} from "native-base";
import React, {useContext, useEffect} from "react";
import {AppState} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {navigationConfig} from "../config/screens";
import {iconOptions, screenOptions} from "../config/tabs";
import screens from "../constants/screens";
import tabs from "../constants/tabs";
import {AppContext} from "../context/app/AppContext";
import LockScreen from "../screens/LockScreen";
import {syncLocalData} from "../services/local/startup";
import HomeStack from "./HomeStack";
import ImportStack from "./ImportStack";
import SettingsStack from "./SettingsStack";

interface MainStackProps {
	migrationComplete: boolean;
	onNavReady: () => void;
}

export default function MainStack({
	migrationComplete,
	onNavReady,
}: MainStackProps) {
	const {colorMode} = useColorMode();
	const {state} = useContext(AppContext);

	// Watch for app state and automatically sync data when in focus
	useEffect(() => {
		const appStateSubscription = AppState.addEventListener(
		  "change",
		  (appState) => {
			  if (appState == "active" && migrationComplete) {
				  syncLocalData().then().catch();
			  }
		  }
		);

		return () => {
			appStateSubscription.remove();
		};
	}, []);

	const Tab = createBottomTabNavigator();
	const Stack = createNativeStackNavigator();

	return (
	  <SafeAreaProvider>
		  <StatusBar
			animated={true}
			style={colorMode === "dark" ? "light" : "dark"}
		  />

		  <NavigationContainer onReady={onNavReady}>
			  {!state?.isSignedIn && state?.useBiometrics ? (
				<Stack.Navigator {...navigationConfig(colorMode)}>
					<Stack.Screen
					  name={screens.LOCKSCREEN.screenName}
					  component={LockScreen}
					  options={{
						  headerTitle: screens.LOCKSCREEN.screenTitle,
						  headerShown: false,
					  }}
					/>
				</Stack.Navigator>
			  ) : (
				<Tab.Navigator initialRouteName={tabs.HOME} backBehavior="history">
					<Tab.Screen
					  name={tabs.HOME}
					  component={HomeStack}
					  options={{
						  tabBarIcon: ({focused}) => (
							<Icon
							  as={AntDesign}
							  name="home"
							  size={6}
							  color={iconOptions(colorMode, focused)}
							/>
						  ),
						  ...(screenOptions(colorMode) as any),
					  }}
					/>
					<Tab.Screen
					  name={tabs.IMPORT}
					  component={ImportStack}
					  options={{
						  tabBarIcon: ({focused}) => (
							<Icon
							  as={AntDesign}
							  name="plussquareo"
							  size={6}
							  color={iconOptions(colorMode, focused)}
							/>
						  ),
						  ...(screenOptions(colorMode) as any),
					  }}
					/>
					<Tab.Screen
					  name={tabs.SETTINGS}
					  component={SettingsStack}
					  options={{
						  tabBarIcon: ({focused}) => (
							<Icon
							  as={Ionicons}
							  name="settings-outline"
							  size={6}
							  color={iconOptions(colorMode, focused)}
							/>
						  ),
						  ...(screenOptions(colorMode) as any),
					  }}
					/>
				</Tab.Navigator>
			  )}
		  </NavigationContainer>
	  </SafeAreaProvider>
	);
}