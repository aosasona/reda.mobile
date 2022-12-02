import AsyncStorage from "@react-native-async-storage/async-storage";
import {ConfigKeys} from "../constants/config";

export const getAsyncStorage = async (key: ConfigKeys) => {
	return await AsyncStorage.getItem(key) || null;
}

export const setAsyncStorage = async (key: ConfigKeys, value: string) => {
	await AsyncStorage.setItem(key, value);
}

export const removeAsyncStorage = async (key: ConfigKeys) => {
	if (!await getAsyncStorage(key)) throw new Error(`Key ${key} does not exist in AsyncStorage`);
	await AsyncStorage.removeItem(key);
}

export const clearAsyncStorage = async () => {
	await AsyncStorage.clear();
}