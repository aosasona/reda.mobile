import {
	Poppins_100Thin,
	Poppins_100Thin_Italic,
	Poppins_200ExtraLight,
	Poppins_200ExtraLight_Italic,
	Poppins_300Light,
	Poppins_300Light_Italic,
	Poppins_400Regular,
	Poppins_400Regular_Italic,
	Poppins_500Medium,
	Poppins_500Medium_Italic,
	Poppins_600SemiBold,
	Poppins_600SemiBold_Italic,
	Poppins_700Bold,
	Poppins_700Bold_Italic,
	Poppins_800ExtraBold,
	Poppins_800ExtraBold_Italic,
	Poppins_900Black,
	Poppins_900Black_Italic,
	useFonts,
} from '@expo-google-fonts/poppins';
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from "expo-status-bar";
import {Icon, NativeBaseProvider, useColorMode} from "native-base";
import React, {useEffect, useState} from "react";
import {iconOptions, screenOptions} from "./config/tabs";
import {extendedTheme} from "./config/theme";
import tabs from "./constants/tabs";
import DownloadsStack from "./stacks/Downloads";
import HomeStack from "./stacks/Home";
import SettingsStack from "./stacks/Settings";
import {colorModeManager} from "./utils/color";

(async () => await SplashScreen.preventAutoHideAsync())();


const Tab = createBottomTabNavigator();

export default function App() {
	const {colorMode} = useColorMode();
	const [appIsReady, setAppIsReady] = useState(false);
	let [fontsLoaded] = useFonts({
		Poppins_100Thin,
		Poppins_100Thin_Italic,
		Poppins_200ExtraLight,
		Poppins_200ExtraLight_Italic,
		Poppins_300Light,
		Poppins_300Light_Italic,
		Poppins_400Regular,
		Poppins_400Regular_Italic,
		Poppins_500Medium,
		Poppins_500Medium_Italic,
		Poppins_600SemiBold,
		Poppins_600SemiBold_Italic,
		Poppins_700Bold,
		Poppins_700Bold_Italic,
		Poppins_800ExtraBold,
		Poppins_800ExtraBold_Italic,
		Poppins_900Black,
		Poppins_900Black_Italic,
	});

	useEffect(() => {
		if (fontsLoaded) {
			setAppIsReady(true);
		}
	}, [fontsLoaded]);

	useEffect(() => {
		(async () => {
			if (appIsReady) {
				await SplashScreen.hideAsync();
			}
		})();
	}, [appIsReady]);


	if (!fontsLoaded) {
		return null;
	}

	return (
	  <NativeBaseProvider theme={extendedTheme} colorModeManager={colorModeManager}>
		  <StatusBar style={colorMode === "dark" ? "light" : "dark"}/>
		  <NavigationContainer>
			  <Tab.Navigator>
				  <Tab.Screen
					name={tabs.HOME}
					component={HomeStack}
					options={{
						tabBarIcon: ({focused}) => <Icon as={AntDesign} name="home" size={6} color={iconOptions(colorMode, focused)}/>,
						...screenOptions(colorMode),
					}}
				  />
				  <Tab.Screen
					name={tabs.DOWNLOADS}
					component={DownloadsStack}
					options={{
						tabBarIcon: ({focused}) => <Icon as={AntDesign} name="download" size={6} color={iconOptions(colorMode, focused)}/>,
						...screenOptions(colorMode),
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
	  </NativeBaseProvider>
	);
}