import {AntDesign, Ionicons} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import {Box, Icon, useColorMode} from "native-base";
import React from "react";
import {iconOptions, screenOptions} from "../config/tabs";
import tabs from "../constants/tabs";
import ImportStack from "../stacks/ImportStack";
import HomeStack from "./HomeStack";
import SettingsStack from "./SettingsStack";

export default function MainStack() {
	const {colorMode} = useColorMode();

	const Tab = createBottomTabNavigator();
	return (
	  <>
		  <StatusBar style={colorMode === "dark" ? "light" : "dark"}/>
		  <NavigationContainer>
			  <Tab.Navigator initialRouteName={tabs.HOME} backBehavior="history">
				  <Tab.Screen
					name={tabs.HOME}
					component={HomeStack}
					options={{
						tabBarIcon: ({focused}) => <Icon as={AntDesign} name="home" size={6} color={iconOptions(colorMode, focused)}/>,
						...screenOptions(colorMode),
					}}
				  />
				  <Tab.Screen
					name={tabs.IMPORT}
					component={ImportStack}
					options={{
						tabBarIcon: ({focused}) => (
						  <Box bg={colorMode == "dark" ? "white" : "muted.900"} p={4} rounded={8}>
							  <Icon as={AntDesign} name="plus" size={4} color={colorMode !== "dark" ? "white" : "muted.900"}/>
						  </Box>),
						...screenOptions(colorMode),
						tabBarLabelStyle: {display: "none"},
					}}
				  />
				  <Tab.Screen
					name={tabs.SETTINGS}
					component={SettingsStack}
					options={{
						tabBarIcon: ({focused}) => <Icon as={Ionicons} name="settings-outline" size={6} color={iconOptions(colorMode, focused)}/>,
						...screenOptions(colorMode),
					}}
				  />
			  </Tab.Navigator>
		  </NavigationContainer>
	  </>
	);
}