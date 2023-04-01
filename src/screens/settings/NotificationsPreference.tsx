import { ScrollView, Switch, Text } from "native-base";
import { useContext } from "react";
import PressableSettings from "../../components/page/settings/PressableSettings";
import StaticSettings from "../../components/page/settings/StaticSettings";
import Settings from "../../context/settings/settings";
import { SettingsContext } from "../../context/settings/SettingsContext";
import { sendNotification } from "../../lib/notification";

export default function NotificationsPreference() {
	const { state: settingsState, dispatch } = useContext(SettingsContext);

	const settingsUtil = new Settings(dispatch);

	async function handleNotificationsToggle(value: boolean) {
		await settingsUtil.toggleAllowNotifications(value);
	};

	return (
		<ScrollView px={0}>
			<StaticSettings>
				<Text>Allow notifications</Text>
				<Switch onToggle={async (val) => await handleNotificationsToggle(val)} value={settingsState.allowNotifications} />
			</StaticSettings>

			<PressableSettings onPress={async () => await sendNotification("Yayy! 🎉", "You can receive push notifications")} >
				<Text color="primary">Test notifications</Text>
			</PressableSettings>
		</ScrollView>
	);
}
