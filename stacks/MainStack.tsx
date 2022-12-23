import {AntDesign, Ionicons} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import {Icon, useColorMode} from "native-base";
import React from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {iconOptions, screenOptions} from "../config/tabs";
import tabs from "../constants/tabs";
import ImportStack from "../stacks/ImportStack";
import HomeStack from "./HomeStack";
import SettingsStack from "./SettingsStack";

export default function MainStack() {
	const {colorMode} = useColorMode();

	const Tab = createBottomTabNavigator();
	return (
	  <SafeAreaProvider>
		  <StatusBar animated={true} style={colorMode === "dark" ? "light" : "dark"} translucent={true}/>
		  <NavigationContainer>
			  <Tab.Navigator initialRouteName={tabs.HOME} backBehavior="history">
				  <Tab.Screen
					name={tabs.HOME}
					component={HomeStack}
					options={{
						tabBarIcon: ({focused}) => <Icon as={AntDesign} name="home" size={6} color={iconOptions(colorMode, focused)}/>,
						...screenOptions(colorMode) as any,
					}}
				  />
				  <Tab.Screen
					name={tabs.IMPORT}
					component={ImportStack}
					options={{
						tabBarIcon: ({focused}) => <Icon as={Ionicons} name="download-outline" size={6} color={iconOptions(colorMode, focused)}/>,
						...screenOptions(colorMode) as any,
					}}
				  />
				  <Tab.Screen
					name={tabs.SETTINGS}
					component={SettingsStack}
					options={{
						tabBarIcon: ({focused}) => <Icon as={Ionicons} name="settings-outline" size={6} color={iconOptions(colorMode, focused)}/>,
						...screenOptions(colorMode) as any,
					}}
				  />
			  </Tab.Navigator>
		  </NavigationContainer>
	  </SafeAreaProvider>
	);
}