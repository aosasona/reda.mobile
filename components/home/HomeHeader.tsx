import { Feather } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import {
	Heading,
	HStack,
	Icon,
	IconButton,
	useColorModeValue,
} from "native-base";
import screens from "../../constants/screens";

interface HeaderComponentProps {
	navigation: NavigationProp<any>;
}

export default function HomeHeader({ navigation }: HeaderComponentProps) {
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
			<Heading fontSize={44}>Home</Heading>

			<IconButton
				icon={<Icon as={Feather} name="search" color={color} size={6} />}
				onPress={goToSearchPage}
				_pressed={{ opacity: 0.5 }}
			/>
		</HStack>
	);
}