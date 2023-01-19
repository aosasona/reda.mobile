import * as WebBrowser from "expo-web-browser";
import { colors } from "../config/theme";
import { showToast } from "./notification.util";

export default class WebUtil {
	public static openBrowserPage = async (uri: string) => {
		try {
			await WebBrowser.openBrowserAsync(uri, {
				controlsColor: colors.light["200"],
				toolbarColor: colors.dark["900"],
			});
		} catch (err: any) {
			showToast("Error", "Unable to open webpage!");
		}
	};
}
