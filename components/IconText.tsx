import { Feather } from "@expo/vector-icons";
import {
	AspectRatio,
	Box,
	HStack,
	Icon,
	Text,
	useColorModeValue,
} from "native-base";

interface Props {
	text: string;
	as?: any;
	name: string;
}

export default function IconText(
	{ text, as, name }: Props = { text: "", as: Feather, name: "moon" }
) {
	const bg = useColorModeValue("brand-light", "brand-dark");
	const color = useColorModeValue("brand-dark", "brand-light");
	return (
		<HStack alignItems="center" space={2}>
			<AspectRatio w={8} ratio={1}>
				<Box alignItems="center" justifyContent="center" bg={color} rounded={8}>
					<Icon as={as || Feather} name={name} color={bg} size={4} />
				</Box>
			</AspectRatio>
			<Text>{text}</Text>
		</HStack>
	);
}
