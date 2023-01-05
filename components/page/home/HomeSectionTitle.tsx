import { Entypo } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Heading, HStack, Icon, Pressable } from "native-base";
import screens from "../../../constants/screens";
import { CategoryPageType } from "../../../types/general";

interface HomeSectionTitleProps {
	title: string;
	category: CategoryPageType;
}

export default function HomeSectionTitle({
	title,
	category,
}: HomeSectionTitleProps) {
	const navigation = useNavigation() as NavigationProp<any>;

	const goToCategoryPage = () => {
		navigation.navigate(screens.CATEGORY.screenName, { category });
	};

	return (
		<Pressable
			_pressed={{ opacity: 0.5 }}
			p={0}
			mt={6}
			mb={4}
			onPress={goToCategoryPage}
		>
			<HStack alignItems="center" justifyContent="flex-start">
				<Heading fontSize={26} fontWeight={600}>
					{title}
				</Heading>
				<Icon as={Entypo} name="chevron-right" opacity={0.75} size={6} />
			</HStack>
		</Pressable>
	);
}