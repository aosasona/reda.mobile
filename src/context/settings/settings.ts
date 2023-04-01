import { Alert } from "react-native";
import { Keys } from "../../constants/keys";
import { clearDatabase } from "../../lib/database/core";
import { deleteAll } from "../../lib/file/ops";
import { seekPermission } from "../../lib/notification";
import defaultStorage from "../../storage/default";
import { SettingsActionType, SettingsDispatchAction } from "./SettingsReducer";

export default class Settings {
	private readonly dispatch: (event: SettingsDispatchAction) => any;

	constructor(dispatch: any) {
		this.dispatch = dispatch;
	}

	async load() {
		const useSinglePageLayout = defaultStorage.getBoolean(Keys.SINGLE_PAGE_LAYOUT);
		const allowNotifications = defaultStorage.getBoolean(Keys.ALLOW_NOTIFICATIONS);
		this.dispatch({
			type: SettingsActionType.LOAD_SETTINGS,
			payload: { useSinglePageLayout, allowNotifications },
		});
	};

	toggleSinglePageLayout(value: boolean) {
		this.dispatch({ type: SettingsActionType.SET_SINGLE_PAGE_LAYOUT_OPTION, payload: value });
	};

	async toggleAllowNotifications(value: boolean) {
		if (value) { await seekPermission(); }
		defaultStorage.set(Keys.ALLOW_NOTIFICATIONS, value);
		this.dispatch({
			type: SettingsActionType.TOGGLE_ALLOW_NOTIFICATIONS,
			payload: value,
		});
	};

	resetSettings() {
		Alert.alert("Reset Settings", "Are you sure you want to reset all settings to default?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Reset",
					onPress: () => this.dispatch({ type: SettingsActionType.RESET_SETTINGS }),
					style: "destructive",
				},
			],
		);
	};

	clearAllData() {
		Alert.alert(
			"Clear Data",
			"This will delete all files and app data, are you sure?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Continue",
					onPress: async () => {
						try {
							await Promise.all([deleteAll(), clearDatabase()]);
							Alert.alert("Success", "Data cleared! You may need to restart app to see changes.",);
						}
						catch (e) {
							Alert.alert("Error", "An error occurred");
						}
					},
					style: "destructive",
				},
			],
		);
	};
}
