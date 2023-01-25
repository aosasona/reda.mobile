import {ColorMode, StorageManager} from "native-base";
import {colors} from "../config/theme";
import {Keys} from "../constants/keys";
import defaultStorage from "../storage/default";

export function getPrimaryColor(mode: ColorMode) {
	return mode === "dark" ? colors.dark["900"] : colors.light["200"];
}

export function getSecondaryColor(mode: ColorMode) {
	return mode === "dark" ? colors.light["200"] : colors.dark["900"];
}

export const colorModeManager: StorageManager = {
	get: async () => {
		try {
			if (!defaultStorage.contains(Keys.COLOR_MODE)) return "light";
			let val = defaultStorage.getString(Keys.COLOR_MODE);
			return val === "dark" ? "dark" : "light";
		}
		catch (e) {
			return "light";
		}
	},
	set: async (value: ColorMode) => {
		try {
			if (!value) return;
			defaultStorage.set(Keys.COLOR_MODE, value);
		}
		catch (e) {
			return;
		}
	},
};