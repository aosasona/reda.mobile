import {Entypo, Feather} from "@expo/vector-icons";
import constants from "expo-constants"
import {HStack, Icon, Pressable, ScrollView, Select, Switch, Text, useColorMode} from "native-base";
import {useContext} from "react";
import {availableFontSizes} from "../constants/fonts";
import {GlobalContext} from "../context/GlobalContext";
import SettingsUtil from "../utils/settings.util";

export default function Settings() {
	const {toggleColorMode, colorMode} = useColorMode();
	const {state, dispatch} = useContext(GlobalContext);

	const settingsUtil = new SettingsUtil(dispatch);

	const handleFontSizeChange = (value: string) => settingsUtil.setFontSize(value);

	const handleSettingsReset = () => settingsUtil.resetSettings();

	return (
	  <ScrollView px={0}>

		  <Text fontWeight={600} px={3} mt={6} mb={2}>Appearance</Text>
		  <HStack
			_dark={{bg: "muted.900", borderColor: "muted.800"}}
			_light={{bg: "muted.100", borderColor: "muted.200"}}
			justifyContent="space-between"
			alignItems="center"
			borderTopWidth={1}
			borderBottomWidth={1}
			px={3}
			py={2.5}
		  >
			  <Text>Dark Mode</Text>
			  <Switch size="sm" onTrackColor="green.500" onToggle={toggleColorMode} value={(colorMode === "dark")}/>
		  </HStack>
		  <HStack
			_dark={{bg: "muted.900", borderColor: "muted.800"}}
			_light={{bg: "muted.100", borderColor: "muted.200"}}
			justifyContent="space-between"
			alignItems="center"
			borderBottomWidth={1}
			px={3}
			py={2.5}
		  >
			  <Text>Font Size</Text>
			  <Select
				minW={20}
				variant="filled"
				selectedValue={state?.fontSize?.toString() || "14"}
				onValueChange={handleFontSizeChange}
				placeholder={state?.fontSize?.toString() || "14"}
				_dark={{
					bg: "muted.900",
					color: "white",
					placeholderTextColor: "muted.400",
					_selectedItem: {
						bg: "muted.800",
					},
				}}
				_light={{
					bg: "muted.100",
					color: "black",
					placeholderTextColor: "muted.900",
					_selectedItem: {
						bg: "muted.200",
					},
				}}
				_actionSheetContent={{
					_dark: {bg: "muted.900"},
					_light: {bg: "muted.100"},
				}}
				_actionSheetBody={{
					_dark: {bg: "muted.900"},
					_light: {bg: "muted.100"},
				}}
				accessibilityLabel="Choose Font Size"
				dropdownIcon={<Icon as={Entypo} name="chevron-small-down" size={5} color="muted.700"/>}
			  >
				  {availableFontSizes.map((size, index) => (
					<Select.Item bg="transparent" rounded={8} key={index} label={`${size}px`} value={`${size}`}/>
				  ))}
			  </Select>
		  </HStack>

		  <Text fontWeight={600} px={3} mt={6} mb={2}>User & App Data</Text>
		  <Pressable
			w="100%"
			_dark={{bg: "muted.900", borderColor: "muted.800"}}
			_light={{bg: "muted.100", borderColor: "muted.200"}}
			borderTopWidth={1}
			borderBottomWidth={1}
			_pressed={{opacity: 0.5}}
			m={0} p={0}
			onPress={handleSettingsReset}
		  >
			  <HStack alignItems="center" px={3} py={4}>
				  <Text color="red.500">Reset settings</Text>
			  </HStack>
		  </Pressable>
		  <Pressable
			w="100%"
			_dark={{bg: "muted.900", borderColor: "muted.800"}}
			_light={{bg: "muted.100", borderColor: "muted.200"}}
			borderBottomWidth={1}
			_pressed={{opacity: 0.5}}
			m={0} p={0}
		  >
			  <HStack alignItems="center" space={2} px={3} py={4}>
				  <Icon as={Feather} name="trash-2" size={4} color="red.500"/>
				  <Text color="red.500">Clear data</Text>
			  </HStack>
		  </Pressable>


		  <Text textAlign="center" fontSize={13} color="gray.400" fontWeight={400} mt={10}>
			  Version {constants?.manifest?.version}
		  </Text>
	  </ScrollView>
	);
}

// <Switch size="sm" onTrackColor="brand.dark" onToggle={toggleColorMode} value={(colorMode === "dark")}/>