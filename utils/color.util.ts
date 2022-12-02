import AsyncStorage from '@react-native-async-storage/async-storage';
import {ColorMode, StorageManager} from "native-base";
import {colors} from "../config/theme";
import {ConfigKeys} from "../constants/config";

export function getPrimaryColor(mode: ColorMode) {
	return mode === "dark" ? colors.brand.darker : colors.brand.light
}

export function getSecondaryColor(mode: ColorMode) {
	return mode === "dark" ? colors.brand.light : colors.brand.darker
}

export const colorModeManager: StorageManager = {
	get: async () => {
		try {
			let val = await AsyncStorage.getItem(ConfigKeys.COLOR_MODE);
			return val === 'dark' ? 'dark' : 'light';
		}
		catch (e) {
			return 'light';
		}
	},
	set: async (value: ColorMode) => {
		try {
			if (!value) return
			await AsyncStorage.setItem(ConfigKeys.COLOR_MODE, value);
		}
		catch (e) {
			console.log(e);
		}
	},
};