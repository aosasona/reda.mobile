import * as WebBrowser from "expo-web-browser";
import { colors } from "../config/theme";
import { showToast } from "./notification";

export default class Web {
	static async openBrowserPage(uri: string) {
		try {
			await WebBrowser.openBrowserAsync(uri, {
				controlsColor: colors.light["200"],
				toolbarColor: colors.dark["900"],
			});
		}
		catch (err: any) {
			showToast("Error", "Unable to open webpage!");
		}
	};
}
