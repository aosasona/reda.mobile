import {
	AzeretMono_100Thin,
	AzeretMono_200ExtraLight,
	AzeretMono_300Light,
	AzeretMono_400Regular,
	AzeretMono_500Medium,
	AzeretMono_600SemiBold,
	AzeretMono_700Bold,
	AzeretMono_800ExtraBold,
	AzeretMono_900Black,
} from "@expo-google-fonts/azeret-mono";
import {
	Inter_100Thin,
	Inter_200ExtraLight,
	Inter_300Light,
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	Inter_800ExtraBold,
	Inter_900Black,
} from "@expo-google-fonts/inter";
import {
	Outfit_100Thin,
	Outfit_200ExtraLight,
	Outfit_300Light,
	Outfit_400Regular,
	Outfit_500Medium,
	Outfit_600SemiBold,
	Outfit_700Bold,
	Outfit_800ExtraBold,
	Outfit_900Black,
	useFonts,
} from "@expo-google-fonts/outfit";
import {
	Poppins_100Thin,
	Poppins_200ExtraLight,
	Poppins_300Light,
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
	Poppins_800ExtraBold,
	Poppins_900Black,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { NativeBaseProvider } from "native-base";
import React, { useEffect, useState } from "react";
import { View, Appearance } from "react-native";
import { extendedTheme } from "./config/theme";
import { GlobalContextProvider } from "./context/GlobalContext";
import MainStack from "./stacks/MainStack";
import { colorModeManager } from "./utils/color.util";
import { runMigration } from "./utils/database.util";

(async () => await SplashScreen.preventAutoHideAsync())();

export default function App() {
	const [navReady, setNavReady] = useState(false);
	const [appReady, setAppReady] = useState(false);

	let [fontsLoaded] = useFonts({
		Outfit_100Thin,
		Outfit_200ExtraLight,
		Outfit_300Light,
		Outfit_400Regular,
		Outfit_500Medium,
		Outfit_600SemiBold,
		Outfit_700Bold,
		Outfit_800ExtraBold,
		Outfit_900Black,

		Poppins_100Thin,
		Poppins_200ExtraLight,
		Poppins_300Light,
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_600SemiBold,
		Poppins_700Bold,
		Poppins_800ExtraBold,
		Poppins_900Black,

		Inter_100Thin,
		Inter_200ExtraLight,
		Inter_300Light,
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
		Inter_800ExtraBold,
		Inter_900Black,

		AzeretMono_100Thin,
		AzeretMono_200ExtraLight,
		AzeretMono_300Light,
		AzeretMono_400Regular,
		AzeretMono_500Medium,
		AzeretMono_600SemiBold,
		AzeretMono_700Bold,
		AzeretMono_800ExtraBold,
		AzeretMono_900Black,
	});

	useEffect(() => {
		(async () => {
			if (fontsLoaded && navReady && appReady) {
				await SplashScreen.hideAsync();
			}
		})();
	}, [fontsLoaded, navReady, appReady]);

	if (typeof window !== "undefined") {
		Appearance.addChangeListener(({ colorScheme }) => {
			colorModeManager.set(colorScheme);
		});
		(async () => await runMigration())();
	}

	if (!fontsLoaded) {
		return null;
	}

	return (
		<View style={{ flex: 1 }} onLayout={() => setAppReady(true)}>
			<GlobalContextProvider>
				<NativeBaseProvider
					theme={extendedTheme}
					colorModeManager={colorModeManager}
				>
					<MainStack onNavReady={() => setNavReady(true)} />
				</NativeBaseProvider>
			</GlobalContextProvider>
		</View>
	);
}
