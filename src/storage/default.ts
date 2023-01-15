import {MMKV} from "react-native-mmkv";
import {DEFAULT_REDA_DIRECTORY} from "../utils/file.util";

const path = `${DEFAULT_REDA_DIRECTORY}.store`?.substring(7);

const defaultStorage = new MMKV({
	id: "default-app-storage",
	path,
});

export default defaultStorage;