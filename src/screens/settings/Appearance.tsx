import { Feather } from "@expo/vector-icons";
import { HStack, Icon, Radio, ScrollView, Switch, Text, useColorMode, VStack } from "native-base";
import { useContext, useLayoutEffect, useState } from "react";
import SettingsSection from "../../components/page/settings/SettingsSection";
import StaticSettings from "../../components/page/settings/StaticSettings";
import IconText from "../../components/reusables/IconText";
import { FontFamiliesEnum } from "../../constants/fonts";
import { Keys } from "../../constants/keys";
import { default as SettingsUtil } from "../../context/settings/settings";
import { SettingsContext } from "../../context/settings/SettingsContext";
import defaultStorage from "../../storage/default";

export default function Appearance() {
	const { state, dispatch } = useContext(SettingsContext);
	const { toggleColorMode, colorMode } = useColorMode();
	const [currentFont, setCurrentFont] = useState<FontFamiliesEnum>(FontFamiliesEnum.INTER)

	useLayoutEffect(() => {
		const font = defaultStorage.getString(Keys.FONT_FAMILY) || FontFamiliesEnum.INTER
		setCurrentFont(font as FontFamiliesEnum)
	}, [])

	function onFontChange(font: any) {
		defaultStorage.set(Keys.FONT_FAMILY, font)
		setCurrentFont(font)
	}

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


			<SettingsSection title="Font" hideTitle={true}>
				<VStack px={3} space={5}>
					<Text opacity={0.5}>Font</Text>

					<Radio.Group name="font" value={currentFont} onChange={onFontChange}>
						<VStack space={4}>
							<Radio size="sm" value={FontFamiliesEnum.OUTFIT}>{FontFamiliesEnum.OUTFIT}</Radio>
							<Radio size="sm" value={FontFamiliesEnum.INTER}>{FontFamiliesEnum.INTER}</Radio>
							<Radio size="sm" value={FontFamiliesEnum.POPPINS}>{FontFamiliesEnum.POPPINS}</Radio>
						</VStack>
					</Radio.Group>

					<HStack bg="red.900" alignItems="center" borderRadius={10} px={3} py={4} space={1.5}>
						<Icon as={Feather} name="info" color="red.300" />
						<Text color="red.300">You will need to restart the app to see font changes</Text>
					</HStack>
				</VStack>
			</SettingsSection>
		</ScrollView>
	);
}
