import { Feather } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { Heading, HStack, Icon, IconButton, useColorModeValue, } from "native-base";
import { useContext } from "react";
import { ActivityIndicator } from "react-native";
import screens from "../../../constants/screens";
import { AppContext } from "../../../context/app/AppContext";

interface HeaderComponentProps {
	navigation: NavigationProp<any>;
}

export default function HomeHeader({ navigation }: HeaderComponentProps) {
	const { state } = useContext(AppContext);

	const goToSearchPage = () => navigation.navigate(screens.SEARCH.screenName);

	const color = useColorModeValue("dark.900", "light.200");

	return (
		<HStack w="full" _dark={{ bg: "dark.900" }} _light={{ bg: "light.200" }} justifyContent="space-between" alignItems="center" pb={3} px={4} py={4} safeAreaTop>
			<Heading fontSize={40}>Home</Heading>
			<HStack space={3}>
				<IconButton
					icon={<Icon as={Feather} name="search" color={color} size={6} />}
					onPress={goToSearchPage}
					_pressed={{ opacity: 0.5 }}
				/>
				{state.isSyncing && <ActivityIndicator size="small" />}
			</HStack>
		</HStack>
	);
}
