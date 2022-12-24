import { Feather } from "@expo/vector-icons";
import constants from "expo-constants";
import {
	AspectRatio,
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
import { DividerProps, HStackProps, PressableProps } from "../constants/props";
import { GlobalContext } from "../context/GlobalContext";
import SettingsUtil from "../utils/settings.util";

export default function Settings() {
	const { toggleColorMode, colorMode } = useColorMode();
	const { state, dispatch } = useContext(GlobalContext);

	const settingsUtil = new SettingsUtil(dispatch);

	const handleSettingsReset = () => settingsUtil.resetSettings();

	const bg = useColorModeValue("brand-light", "brand-dark");
	const color = useColorModeValue("brand-dark", "brand-light");

	return (
		<ScrollView px={3} stickyHeaderIndices={[0]}>
			<Box bg={bg} py={3} safeAreaTop>
				<Heading fontSize={44} ml={2}>
					Settings
				</Heading>
			</Box>
			<SettingsSection title="Appearance">
				<HStack {...HStackProps}>
					<HStack alignItems="center" space={2}>
						<AspectRatio w={8} ratio={1}>
							<Box bg={color} p={2} rounded={8}>
								<Icon
									as={Feather}
									name={colorMode == "dark" ? "sun" : "moon"}
									color={bg}
									size={4}
								/>
							</Box>
						</AspectRatio>
						<Text>Dark Mode</Text>
					</HStack>
					<Switch
						size="md"
						_android={{ size: "lg" }}
						onTrackColor="green.500"
						onToggle={toggleColorMode}
						value={colorMode === "dark"}
					/>
				</HStack>
				<Box pl={4}>
					<Divider {...DividerProps} />
				</Box>
				<HStack {...HStackProps}>
					<Text>Single-page Layout</Text>
					<Switch
						size="md"
						_android={{ size: "lg" }}
						onTrackColor="green.500"
						onToggle={settingsUtil.toggleSinglePageLayout}
						value={state.useSinglePageLayout}
					/>
				</HStack>
			</SettingsSection>

			<SettingsSection title="User & App Data">
				<Pressable onPress={handleSettingsReset} {...PressableProps}>
					<Box px={4} py={4}>
						<Text color="red.500">Reset settings</Text>
					</Box>
				</Pressable>
				<Box pl={4}>
					<Divider {...DividerProps} />
				</Box>
				<Pressable onPress={settingsUtil.clearAllData} {...PressableProps}>
					<HStack alignItems="center" space={2} px={4} py={4}>
						<Icon as={Feather} name="trash-2" size={4} color="red.500" />
						<Text color="red.500">Clear data</Text>
					</HStack>
				</Pressable>
			</SettingsSection>

			<Text
				textAlign="center"
				fontSize={13}
				color="gray.400"
				fontWeight={400}
				mt={10}
			>
				v{constants?.manifest?.version}{" "}
				{Number(constants?.manifest?.version || "1") >= 1.0
					? "-stable"
					: "-beta"}
			</Text>
		</ScrollView>
	);
}

const SettingsSection = ({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) => (
	<Box
		_dark={{ bg: "muted.900", borderColor: "muted.800" }}
		_light={{ bg: "muted.100", borderColor: "muted.200" }}
		mt={6}
		rounded={10}
	>
		<Box>{children}</Box>
	</Box>
);
