import constants from "expo-constants"
import {HStack, ScrollView, Switch, Text, useColorMode, VStack} from "native-base";

export default function Settings() {
	const {toggleColorMode, colorMode} = useColorMode();
	return (
	  <ScrollView>

		  <VStack rounded={10} mt={6}>
			  <HStack justifyContent="space-between" alignItems="center" px={3} py={2.5}>
				  <Text>Dark Mode</Text>
				  <Switch size="sm" onTrackColor="green.500" onToggle={toggleColorMode} value={(colorMode === "dark")}/>
			  </HStack>
		  </VStack>

		  <Text textAlign="center" fontSize={13} color="gray.400" fontWeight={400} mt={10}>
			  Version {constants?.manifest?.version}
		  </Text>
	  </ScrollView>
	);
}

// <Switch size="sm" onTrackColor="brand.dark" onToggle={toggleColorMode} value={(colorMode === "dark")}/>