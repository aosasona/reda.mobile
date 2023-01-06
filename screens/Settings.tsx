import {Feather, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import constants from "expo-constants";
import {Box, Divider, Heading, HStack, Icon, Pressable, ScrollView, Switch, Text, useColorMode, useColorModeValue} from "native-base";
import {useContext} from "react";
import {ActivityIndicator} from "react-native";
import SettingsSection from "../components/page/settings/SettingsSection";
import StaticSettings from "../components/page/settings/StaticSettings";
import CustomDivider from "../components/reusables/custom/CustomDivider";
import PressableSettings from "../components/page/settings/PressableSettings";
import CustomSafeAreaView from "../components/reusables/custom/CustomSafeAreaView";
import IconText from "../components/reusables/IconText";
import {DividerProps, HStackProps, PressableProps} from "../constants/props";
import screens from "../constants/screens";
import {REDA_URL} from "../constants/url";
import {AppContext} from "../context/app/AppContext";
import {AppActionType} from "../context/app/AppReducer";
import {default as SettingsUtil} from "../context/settings/settings";
import {SettingsContext} from "../context/settings/SettingsContext";
import {syncLocalData} from "../services/local/startup";
import {ScreenProps} from "../types/general";
import WebUtil from "../utils/web.util";

export default function Settings({ navigation }: ScreenProps) {
	const { toggleColorMode, colorMode } = useColorMode();
	const { state, dispatch } = useContext(SettingsContext);
	const { state: appState, dispatch: appDispatch } = useContext(AppContext);

	const settings = new SettingsUtil(dispatch);

	const handleSettingsReset = () => settings.resetSettings();

	const handleSync = async () => {
		appDispatch({ type: AppActionType.TOGGLE_IS_SYNCING });
		await syncLocalData();
		appDispatch({ type: AppActionType.TOGGLE_IS_SYNCING });
	};

	const openRedaServicePage = (url: string) => {
		const uri = REDA_URL + url;
		WebUtil.openBrowserPage(navigation, uri).then();
	};
	const bg = useColorModeValue("brand-light", "brand-dark");

	return (
		<CustomSafeAreaView>
			<ScrollView px={0}>
				<Box bg={bg} px={3} mt={2}>
					<Heading fontSize={40}>Settings</Heading>
				</Box>

				<SettingsSection title="Configure Reda">
					<StaticSettings>
						<IconText
							name={colorMode == "dark" ? "sun" : "moon"}
							text="Dark mode"
						/>
						<Switch
							size="md"
							onToggle={toggleColorMode}
							value={colorMode === "dark"}
						/>
					</StaticSettings>
					<StaticSettings>
						<IconText name="book-open" text="Single page" />
						<Switch
							size="md"
							onToggle={settings.toggleSinglePageLayout}
							value={state.useSinglePageLayout}
						/>
					</StaticSettings>
					<PressableSettings onPress={() => navigation.navigate(screens.SECURITY_SETTINGS.screenName)} hideDivider={true}>
						<IconText name="lock" text="Security" />
						<Icon as={Feather} name="chevron-right" size={4} />
					</PressableSettings>
				</SettingsSection>

				<SettingsSection title="About Reda">
					<PressableSettings onPress={() => openRedaServicePage("/releases")}>
							<IconText
								as={MaterialCommunityIcons}
								name="new-box"
								text="Release notes"
							/>
							<Icon as={Feather} name="arrow-up-right" size={4} />
					</PressableSettings>

					<PressableSettings onPress={() => openRedaServicePage("/privacy")}>
							<IconText
								as={MaterialIcons}
								name="privacy-tip"
								text="Privacy policy"
							/>
							<Icon as={Feather} name="arrow-up-right" size={4} />
					</PressableSettings>

					<PressableSettings onPress={() => openRedaServicePage("/terms")} hideDivider={true}>
							<IconText name="book" text="Terms of service" />
							<Icon as={Feather} name="arrow-up-right" size={4} />
					</PressableSettings>
				</SettingsSection>

				<SettingsSection title="App Controls">
					<PressableSettings onPress={handleSync} disabled={appState.isSyncing}>
							<IconText name="refresh-cw" text="Sync" />
							{appState.isSyncing && <ActivityIndicator size="small" />}
					</PressableSettings>

					<PressableSettings  onPress={handleSettingsReset}>
						<Box py={2}>
							<Text color="red.500">Reset settings</Text>
						</Box>
					</PressableSettings>

					<PressableSettings  onPress={settings.clearAllData} hideDivider={true}>
						<Box w="full" py={2}>
							<Text color="red.500">Clear data</Text>
						</Box>
					</PressableSettings >
				</SettingsSection>

				<Text
					textAlign="center"
					fontSize={13}
					color="gray.400"
					fontWeight={400}
					mt={10}
				>
					Version {constants?.manifest?.version}
				</Text>
			</ScrollView>
		</CustomSafeAreaView>
	);
}