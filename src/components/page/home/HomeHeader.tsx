import { Feather } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import {
	Heading,
	HStack,
	Icon,
	IconButton,
	useColorModeValue,
} from "native-base";
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

	const color = useColorModeValue("brand-dark", "brand-light");

	return (
		<HStack
			w={"full"}
			_dark={{ bg: "brand-dark" }}
			_light={{ bg: "brand-light" }}
			justifyContent="space-between"
			alignItems="center"
			pb={3}
			px={4}
			py={4}
			safeAreaTop
		>
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
