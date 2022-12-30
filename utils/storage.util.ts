import { ConfigKeys } from "../constants/config";
import defaultStorage from "../storage/default";

export const getAsyncStorage = (key: ConfigKeys) => {
	return defaultStorage.getString(key) || null;
};

export const setAsyncStorage = (key: ConfigKeys, value: string) => {
	defaultStorage.set(key, value);
};

export const removeAsyncStorage = (key: ConfigKeys) => {
	if (!defaultStorage.contains(key))
		throw new Error(`Key ${key} does not exist in AsyncStorage`);
	defaultStorage.delete(key);
};

export const clearAsyncStorage = () => {
	defaultStorage.clearAll();
};
