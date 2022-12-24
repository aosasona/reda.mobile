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
import IconText from "../components/IconText";
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
					<IconText
						name={colorMode == "dark" ? "sun" : "moon"}
						text="Dark mode"
					/>
					<Switch
						size="md"
						_android={{ size: "lg" }}
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
				<Box>
					<Divider {...DividerProps} />
				</Box>
				<Pressable onPress={settingsUtil.clearAllData} {...PressableProps}>
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
