import { ScrollView, Switch, useColorMode } from "native-base";
import { useContext } from "react";
import SettingsSection from "../../components/page/settings/SettingsSection";
import StaticSettings from "../../components/page/settings/StaticSettings";
import IconText from "../../components/reusables/IconText";
import { default as SettingsUtil } from "../../context/settings/settings";
import { SettingsContext } from "../../context/settings/SettingsContext";

export default function Appearance() {
	const { state, dispatch } = useContext(SettingsContext);
	const { toggleColorMode, colorMode } = useColorMode();

	const settings = new SettingsUtil(dispatch);

	return (
		<ScrollView px={0}>
			<SettingsSection title="Security" hideTitle={true}>
				<StaticSettings>
					<IconText name={colorMode == "dark" ? "sun" : "moon"} text="Dark mode" />
					<Switch onToggle={toggleColorMode} value={colorMode === "dark"} />
				</StaticSettings>

				<StaticSettings>
					<IconText name="book-open" text="Single page" />
					<Switch onToggle={() => settings.toggleSinglePageLayout(!state.useSinglePageLayout)} value={state.useSinglePageLayout} />
				</StaticSettings>
			</SettingsSection>
		</ScrollView>
	);
}
