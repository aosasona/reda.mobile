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
import * as SplashScreen from 'expo-splash-screen';
import {NativeBaseProvider} from "native-base";
import React, {useEffect} from "react";
import {extendedTheme} from "./config/theme";
import {GlobalContextProvider} from "./context/GlobalContext";
import MainStack from "./stacks/MainStack";
import {colorModeManager} from "./utils/color.util";

(async () => await SplashScreen.preventAutoHideAsync())();

export default function App() {
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
		(async () => {
			if (fontsLoaded) {
				await SplashScreen.hideAsync();
			}
		})()
	}, [fontsLoaded]);


	if (!fontsLoaded) {
		return null;
	}

	return (
	  <GlobalContextProvider>
		  <NativeBaseProvider theme={extendedTheme} colorModeManager={colorModeManager}>
			  <MainStack/>
		  </NativeBaseProvider>
	  </GlobalContextProvider>
	);
}