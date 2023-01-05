import {
	Feather,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import constants from "expo-constants";
import {
	Box,
	Divider,
	Heading,
	HStack,
	Icon,
	Pressable,
	ScrollView,
	Switch,
	Text,
	useColorMode,
	useColorModeValue,
} from "native-base";
import { ReactNode, useContext } from "react";
import { ActivityIndicator } from "react-native";
import CustomSafeAreaView from "../components/reusables/CustomSafeAreaView";
import IconText from "../components/reusables/IconText";
import { DividerProps, HStackProps, PressableProps } from "../constants/props";
import { REDA_URL } from "../constants/url";
import { AppContext } from "../context/app/AppContext";
import { AppActionType } from "../context/app/AppReducer";
import { default as SettingsUtil } from "../context/settings/settings";
import { SettingsContext } from "../context/settings/SettingsContext";
import { syncLocalData } from "../services/local/startup";
import { ScreenProps } from "../types/general";
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
					<HStack {...HStackProps}>
						<IconText
							name={colorMode == "dark" ? "sun" : "moon"}
							text="Dark mode"
						/>
						<Switch
							size="md"
							onTrackColor="green.500"
							onToggle={toggleColorMode}
							value={colorMode === "dark"}
						/>
					</HStack>
					<Box>
						<Divider {...DividerProps} />
					</Box>
					<HStack {...HStackProps}>
						<IconText name="book-open" text="Single page" />
						<Switch
							size="md"
							onTrackColor="green.500"
							onToggle={settings.toggleSinglePageLayout}
							value={state.useSinglePageLayout}
						/>
					</HStack>
				</SettingsSection>

				<SettingsSection title="About Reda">
					<Pressable
						onPress={() => openRedaServicePage("/releases")}
						{...PressableProps}
					>
						<HStack {...HStackProps}>
							<IconText
								as={MaterialCommunityIcons}
								name="new-box"
								text="Release notes"
							/>
							<Icon as={Feather} name="arrow-up-right" size={4} />
						</HStack>
					</Pressable>
					<Box>
						<Divider {...DividerProps} />
					</Box>
					<Pressable
						onPress={() => openRedaServicePage("/privacy")}
						{...PressableProps}
					>
						<HStack {...HStackProps}>
							<IconText
								as={MaterialIcons}
								name="privacy-tip"
								text="Privacy policy"
							/>
							<Icon as={Feather} name="arrow-up-right" size={4} />
						</HStack>
					</Pressable>
					<Box>
						<Divider {...DividerProps} />
					</Box>
					<Pressable
						onPress={() => openRedaServicePage("/terms")}
						{...PressableProps}
					>
						<HStack {...HStackProps}>
							<IconText name="book" text="Terms of service" />
							<Icon as={Feather} name="arrow-up-right" size={4} />
						</HStack>
					</Pressable>
				</SettingsSection>

				<SettingsSection title="App Controls">
					<Pressable
						onPress={handleSync}
						disabled={appState.isSyncing}
						_disabled={{ opacity: 0.6 }}
						{...PressableProps}
					>
						<HStack {...HStackProps}>
							<IconText name="refresh-cw" text="Sync" />
							{appState.isSyncing && <ActivityIndicator size="small" />}
						</HStack>
					</Pressable>
					<Box>
						<Divider {...DividerProps} />
					</Box>
					<Pressable onPress={handleSettingsReset} {...PressableProps}>
						<Box px={4} py={4}>
							<Text color="red.500">Reset settings</Text>
						</Box>
					</Pressable>
					<Box>
						<Divider {...DividerProps} />
					</Box>
					<Pressable onPress={settings.clearAllData} {...PressableProps}>
						<Box w="full" px={4} py={4}>
							<Text color="red.500">Clear data</Text>
						</Box>
					</Pressable>
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

const SettingsSection = ({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) => (
	<Box mt={6}>
		<Text mb={2} px={4} opacity={0.5}>
			{title}
		</Text>
		<Box
			_dark={{ bg: "muted.900", borderColor: "muted.800" }}
			_light={{ bg: "muted.100", borderColor: "muted.200" }}
		>
			<Box>{children}</Box>
		</Box>
	</Box>
);
