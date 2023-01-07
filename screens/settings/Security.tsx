import { ScrollView, Switch, Text } from "native-base";
import { useContext, useEffect, useState } from "react";
import SettingsSection from "../../components/page/settings/SettingsSection";
import StaticSettings from "../../components/page/settings/StaticSettings";
import AppUtil from "../../context/app/app";
import { AppContext } from "../../context/app/AppContext";
import { supportsBiometrics } from "../../utils/security.util";

export default function Security() {
	const { state: appState, dispatch } = useContext(AppContext);

	const [supportsBio, setSupportsBio] = useState(false);

	useEffect(() => {
		(async () => {
			const supportsBioValue = await supportsBiometrics();
			setSupportsBio(supportsBioValue);
		})();
	}, []);

	const appUtil = new AppUtil(dispatch);

	return (
		<ScrollView px={0}>
			<SettingsSection title="Security" hideTitle={true}>
				{supportsBio ? (
					<StaticSettings>
						<Text>Require FaceID/Fingerprint</Text>
						<Switch
							size="md"
							onToggle={appUtil.toggleBiometrics}
							value={appState.useBiometrics}
						/>
					</StaticSettings>
				) : (
					<Text opacity={0.5} px={3} py={4}>
						Your device does not support FaceID or Fingerprint authentication,
						or you do not have any biometric authentication methods configured
						on it.
					</Text>
				)}
			</SettingsSection>
		</ScrollView>
	);
}
