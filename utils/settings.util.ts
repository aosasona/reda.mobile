import {Alert} from "react-native";
import {ConfigKeys} from "../constants/config";
import {FontFamiliesEnum} from "../constants/fonts";
import {GlobalAction, GlobalActionType} from "../context/GlobalReducer";
import {getAsyncStorage} from "./storage.util";

export default class SettingsUtil {
	private readonly dispatch: (event: GlobalAction) => any;

	constructor(dispatch: any) {
		this.dispatch = dispatch;
	}

	public loadSettings = async () => {
		const fontSize = await getAsyncStorage(ConfigKeys.FONT_SIZE);
		const fontFamily = await getAsyncStorage(ConfigKeys.FONT_FAMILY);
		this.dispatch({type: GlobalActionType.LOAD_SETTINGS, payload: {fontSize, fontFamily}});
	}

	public setFontSize = (fontSize: string) => {
		if (!isNaN(parseInt(fontSize))) {
			this.dispatch({type: GlobalActionType.SET_FONT_SIZE, payload: parseInt(fontSize)})
		}
	}

	public setFontFamily = (fontFamily: FontFamiliesEnum) => {
		console.log(fontFamily);
		this.dispatch({type: GlobalActionType.SET_FONT_FAMILY, payload: fontFamily})
	}

	public resetSettings = () => {
		Alert.alert("Reset Settings", "Are you sure you want to reset all settings to default?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Reset",
				onPress: () => this.dispatch({type: GlobalActionType.RESET_SETTINGS}),
				style: "destructive",
			},
		])
	}
}