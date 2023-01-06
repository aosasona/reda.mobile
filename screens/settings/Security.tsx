import { ScrollView, Switch, Text } from "native-base";
import { useContext } from "react";
import PressableSettings from "../../components/page/settings/PressableSettings";
import SettingsSection from "../../components/page/settings/SettingsSection";
import StaticSettings from "../../components/page/settings/StaticSettings";
import { AppContext } from "../../context/app/AppContext";

export default function Security() {
	const { state: app } = useContext(AppContext);
	const setPasscode = () => { };

	const toggleFaceID = () => { };

	return (
		<ScrollView px={0}>
			<SettingsSection title="Security" hideTitle={true}>
				<PressableSettings onPress={setPasscode}>
					<Text color="primary" py={2}>
						{app.hasPassword ? "Change password" : "Set a new password..."}
					</Text>
				</PressableSettings>

				<StaticSettings hideDivider={true}>
					<Text>Require FaceID/Fingerprint</Text>
					<Switch size="md" onToggle={toggleFaceID} value={app.hasBiometrics} />
				</StaticSettings>
			</SettingsSection>
		</ScrollView>
	);
}
