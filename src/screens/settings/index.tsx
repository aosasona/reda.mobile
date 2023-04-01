import { Entypo, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import constants from "expo-constants";
import {
	Box,
	Heading,
	Icon,
	ScrollView,
	Text,
	useColorModeValue,
	VStack,
} from "native-base";
import { useContext, useLayoutEffect } from "react";
import { ActivityIndicator } from "react-native";
import CustomDivider from "../../components/custom/CustomDivider";
import CustomSafeAreaView from "../../components/custom/CustomSafeAreaView";
import PressableSettings from "../../components/page/settings/PressableSettings";
import SettingsSection from "../../components/page/settings/SettingsSection";
import IconText from "../../components/reusables/IconText";
import screens from "../../constants/screens";
import { REDA_URL } from "../../constants/url";
import { AppContext } from "../../context/app/AppContext";
import { AppActionType } from "../../context/app/AppReducer";
import { default as SettingsUtil } from "../../context/settings/settings";
import { SettingsContext } from "../../context/settings/SettingsContext";
import useScrollThreshold from "../../hooks/useScroll";
import Web from "../../lib/web";
import { syncLocalData } from "../../services/local/startup";
import { ScreenProps } from "../../types/general";

export default function Settings({ navigation }: ScreenProps) {
	const { dispatch } = useContext(SettingsContext);
	const { state: appState, dispatch: appDispatch } = useContext(AppContext);


	const [page, onScroll] = useScrollThreshold(15);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: page.hasReachedThreshold ? "Settings" : ""
		})
	}, [page])

	const settings = new SettingsUtil(dispatch);
	const handleSettingsReset = () => settings.resetSettings();

	async function handleSync() {
		appDispatch({ type: AppActionType.TOGGLE_IS_SYNCING });
		await syncLocalData();
		appDispatch({ type: AppActionType.TOGGLE_IS_SYNCING });
	};

	function openRedaServicePage(url: string) {
		const uri = REDA_URL + url;
		Web.openBrowserPage(uri).then();
	};

	const bg = useColorModeValue("light.200", "dark.900");

	return (
		<CustomSafeAreaView forceInset={{ top: "never" }}>
			<ScrollView px={0} onScroll={onScroll} scrollEventThrottle={30} showsVerticalScrollIndicator={false}>
				<Box bg={bg} px={3}>
					<Heading fontSize={40}>Settings</Heading>
				</Box>

				<VStack mt={1} space={8} divider={<CustomDivider />}>
					<SettingsSection title="Configure Reda">
						<PressableSettings onPress={() => navigation.navigate(screens.APPEARANCE_SETTINGS.screenName)}>
							<IconText as={Entypo} name="palette" text="Appearance" />
							<Icon as={Feather} name="chevron-right" size={4} />
						</PressableSettings>

						<PressableSettings onPress={() => navigation.navigate(screens.SECURITY_SETTINGS.screenName)}>
							<IconText name="lock" text="Security" />
							<Icon as={Feather} name="chevron-right" size={4} />
						</PressableSettings>

						<PressableSettings onPress={() => navigation.navigate(screens.NOTIFICATIONS_SETTINGS.screenName)}>
							<IconText as={Ionicons} name="ios-notifications-outline" text="Notifications" />
							<Icon as={Feather} name="chevron-right" size={4} />
						</PressableSettings>
					</SettingsSection>

					<SettingsSection title="About Reda">
						<PressableSettings onPress={() => openRedaServicePage("/privacy")}>
							<IconText as={MaterialIcons} name="privacy-tip" text="Privacy policy" />
							<Icon as={Feather} name="arrow-up-right" size={4} />
						</PressableSettings>

						<PressableSettings onPress={() => openRedaServicePage("/terms")}>
							<IconText name="book" text="Terms of service" />
							<Icon as={Feather} name="arrow-up-right" size={4} />
						</PressableSettings>

						<PressableSettings onPress={() => Web.openBrowserPage("https://github.com/aosasona/reda-mobile").then()}>
							<IconText as={Ionicons} name="logo-github" text="GitHub" />
							<Icon as={Feather} name="arrow-up-right" size={4} />
						</PressableSettings>

						<PressableSettings onPress={() => Web.openBrowserPage("https://twitter.com/useredaapp").then()}>
							<IconText as={Ionicons} name="help-outline" text="Help" />
							<Icon as={Feather} name="arrow-up-right" size={4} />
						</PressableSettings>
					</SettingsSection>

					<SettingsSection title="App Controls">
						<PressableSettings onPress={handleSync} disabled={appState.isSyncing} >
							<IconText as={Ionicons} name="ios-sync" text="Sync data" />
							{appState.isSyncing && <ActivityIndicator size="small" />}
						</PressableSettings>

						<PressableSettings onPress={handleSettingsReset}>
							<IconText as={MaterialIcons} name="settings-backup-restore" color="red.500" text="Reset settings" />
						</PressableSettings>

						<PressableSettings onPress={settings.clearAllData}>
							<IconText name="trash" color="red.500" text="Clear data" />
						</PressableSettings>
					</SettingsSection>
				</VStack>

				<Text textAlign="center" fontSize={13} color="gray.400" fontWeight={400} my={10} >
					Reda {constants?.manifest?.version}
				</Text>
			</ScrollView>
		</CustomSafeAreaView>
	);
}
