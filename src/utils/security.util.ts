import * as LocalAuthentication from "expo-local-authentication";
import {Keys} from "../constants/keys";
import defaultStorage from "../storage/default";

export const supportsBiometrics = async (): Promise<boolean> => {
	try {
		const hasHardware = await LocalAuthentication.hasHardwareAsync();
		const isEnrolled = await LocalAuthentication.isEnrolledAsync();
		return hasHardware && isEnrolled;
	}
	catch (e) {
		return false;
	}
};

export const useBiometrics = (): boolean => {
	try {
		const hasKey = defaultStorage.contains(Keys.USE_BIOMETRICS);
		if (!hasKey) return false;
		const useBioValue = defaultStorage.getBoolean(Keys.USE_BIOMETRICS);
		return useBioValue as boolean;
	}
	catch (e) {
		return false;
	}
};