import { ColorMode, StorageManager } from "native-base";
import { colors } from "../config/theme";
import { ConfigKeys } from "../constants/config";
import defaultStorage from "../storage/default";

export function getPrimaryColor(mode: ColorMode) {
	return mode === "dark" ? colors.brand.darker : colors.brand.light;
}

export function getSecondaryColor(mode: ColorMode) {
	return mode === "dark" ? colors.brand.light : colors.brand.darker;
}

export const colorModeManager: StorageManager = {
	get: async () => {
		try {
			if (!defaultStorage.contains(ConfigKeys.COLOR_MODE)) return "light";
			let val = defaultStorage.getString(ConfigKeys.COLOR_MODE);
			return val === "dark" ? "dark" : "light";
		} catch (e) {
			return "light";
		}
	},
	set: async (value: ColorMode) => {
		try {
			if (!value) return;
			defaultStorage.set(ConfigKeys.COLOR_MODE, value);
		} catch (e) {
			return;
		}
	},
};
