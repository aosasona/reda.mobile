import { MaterialIcons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import {
	Box,
	Heading,
	HStack,
	Icon,
	Input,
	Pressable,
	Text,
} from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InputProps } from "../constants/props";
import screens from "../constants/screens";
import LoadingHeader from "./LoadingHeader";

interface HeaderComponentProps {
	state: {
		loading: boolean;
		initialLoad: boolean;
	};
	navigation: NavigationProp<any>;
}

export default function HomeHeader({
	state,
	navigation,
}: HeaderComponentProps) {
	const { loading, initialLoad } = state;
	const goToSearchPage = () => navigation.navigate(screens.SEARCH.screenName);

	return (
		<Box
			w={"full"}
			_dark={{ bg: "brand-dark" }}
			_light={{ bg: "brand-light" }}
			pb={2}
			safeAreaTop
		>
			<Heading fontSize={44} mt={4} ml={2}>
				Home
			</Heading>
			<Pressable
				w="full"
				px={4}
				py={4}
				mt={3}
				rounded={8}
				_dark={{ bg: "muted.900" }}
				_light={{ bg: "muted.200" }}
				onPress={goToSearchPage}
			>
				<HStack alignItems="center" space={3}>
					<Icon
						as={MaterialIcons}
						name="search"
						size={5}
						_dark={{ color: "muted.600" }}
						_light={{ color: "muted.400" }}
					/>
					<Text _dark={{ color: "muted.600" }} _light={{ color: "muted.400" }}>
						Search...
					</Text>
				</HStack>
			</Pressable>

			{!initialLoad && loading && <LoadingHeader />}
		</Box>
	);
}
