import {Entypo} from "@expo/vector-icons";
import constants from "expo-constants"
import {HStack, Icon, Pressable, ScrollView, Select, Switch, Text, useColorMode} from "native-base";
import {availableFontSizes} from "../constants/fonts";

export default function Settings() {
	const {toggleColorMode, colorMode} = useColorMode();
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
				variant="filled"
				selectedValue={"12"}
				_actionSheetContent={{
					_dark: {bg: "muted.900"},
					_light: {bg: "muted.100"},
				}}
				accessibilityLabel="Choose Font Size"
				_selectedItem={{
					bg: "muted.800",
				}}
				dropdownIcon={<Icon as={Entypo} name="chevron-small-down" size={5} color="muted.700"/>}
			  >
				  {availableFontSizes.map((size, index) => (
					<Select.Item bg="transparent" rounded={8} key={index} label={`${size}px`} value={`${size}`}/>
				  ))}
			  </Select>
		  </HStack>

		  <Text fontWeight={600} px={3} mt={6} mb={2}>Data</Text>
		  <Pressable
			w="100%"
			_dark={{bg: "muted.900", borderColor: "muted.800"}}
			_light={{bg: "muted.100", borderColor: "muted.200"}}
			borderTopWidth={1}
			borderBottomWidth={1}
			_pressed={{opacity: 0.5}}
			m={0} p={0}
		  >
			  <HStack alignItems="center" px={3} py={4}>
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