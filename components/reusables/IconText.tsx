import { Feather } from "@expo/vector-icons";
import { Box, HStack, Icon, Text, useColorModeValue } from "native-base";

interface Props {
	text: string;
	as?: any;
	name: string;
}

export default function IconText(
	{ text, as, name }: Props = { text: "", as: Feather, name: "moon" }
) {
	const color = useColorModeValue("brand-dark", "brand-light");
	return (
		<HStack alignItems="center" space={3}>
			<Box py={2}>
				<Icon as={as || Feather} name={name} color={color} size={4} />
			</Box>
			<Text>{text}</Text>
		</HStack>
	);
}
