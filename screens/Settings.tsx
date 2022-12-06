import {Entypo, Feather} from "@expo/vector-icons";
import constants from "expo-constants"
import {Box, HStack, Icon, Pressable, ScrollView, Select, Switch, Text, useColorMode} from "native-base";
import {ReactNode, useContext} from "react";
import {FontFamilies, FontFamiliesEnum, FontSizes} from "../constants/fonts";
import {HStackProps, PressableProps, SelectProps} from "../constants/props";
import {GlobalContext} from "../context/GlobalContext";
import SettingsUtil from "../utils/settings.util";

export default function Settings() {
	const {toggleColorMode, colorMode} = useColorMode();
	const {state, dispatch} = useContext(GlobalContext);


	const settingsUtil = new SettingsUtil(dispatch);

	const handleFontSizeChange = (value: string) => settingsUtil.setFontSize(value);

	const handleFontFamilyChange = (value: string) => settingsUtil.setFontFamily(value as FontFamiliesEnum);

	const handleSettingsReset = () => settingsUtil.resetSettings();

	return (
	  <ScrollView px={0}>

		  <SettingsSection title="Appearance">
			  <HStack borderTopWidth={1} {...HStackProps}>
				  <Text>Dark Mode</Text>
				  <Switch size="sm" onTrackColor="green.500" onToggle={toggleColorMode} value={(colorMode === "dark")}/>
			  </HStack>
			  <HStack {...HStackProps}>
				  <Text>Font Size</Text>
				  <Select
					selectedValue={state?.fontSize?.toString() || "14"}
					onValueChange={handleFontSizeChange}
					placeholder={state?.fontSize?.toString() || "14"}
					dropdownIcon={<Icon as={Entypo} name="chevron-small-down" size={5} color="muted.700"/>}
					{...SelectProps}
				  >
					  {FontSizes.map((size, index) => (
						<Select.Item bg="transparent" rounded={8} key={index} label={`${size}px`} value={`${size}`}/>
					  ))}
				  </Select>
			  </HStack>
			  <HStack {...HStackProps}>
				  <Text>Font Family</Text>
				  <Select
					{...SelectProps}
					minW={24}
					selectedValue={state?.fontFamily || FontFamiliesEnum.OUTFIT}
					onValueChange={handleFontFamilyChange}
					placeholder={state?.fontFamily || FontFamiliesEnum.OUTFIT}
					dropdownIcon={<Icon as={Entypo} name="chevron-small-down" size={5} color="muted.700"/>}
				  >
					  {FontFamilies.map((fontFamily, index) => (
						<Select.Item bg="transparent" rounded={8} key={index} label={fontFamily} value={fontFamily}/>
					  ))}
				  </Select>
			  </HStack>
		  </SettingsSection>

		  <SettingsSection title="User & App Data">
			  <Pressable
				onPress={handleSettingsReset}
				{...PressableProps}
			  >
				  <Box px={3} py={4}>
					  <Text color="red.500">Reset settings</Text>
				  </Box>
			  </Pressable>
			  <Pressable
				{...PressableProps}
				borderTopWidth={0}
			  >
				  <HStack alignItems="center" space={2} px={3} py={4}>
					  <Icon as={Feather} name="trash-2" size={4} color="red.500"/>
					  <Text color="red.500">Clear data</Text>
				  </HStack>
			  </Pressable>
		  </SettingsSection>


		  <Text textAlign="center" fontSize={13} color="gray.400" fontWeight={400} mt={10}>
			  &copy; {constants.manifest?.name} v{constants?.manifest?.version}
		  </Text>
	  </ScrollView>
	);
}

const SettingsSection = ({title, children}: { title: string, children: ReactNode }) => (
  <Box mt={6}>
	  <Text fontWeight={600} px={3}>{title}</Text>
	  <Box mt={2}>
		  {children}
	  </Box>
  </Box>
)