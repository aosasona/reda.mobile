import {Feather} from "@expo/vector-icons";
import {HStack, Icon, Text, useColorModeValue} from "native-base";

interface Props {
	text: string;
	as?: any;
	name: string;
	color?: string;
}

export default function IconText(
  {text, as, name, color}: Props = {text: "", as: Feather, name: "moon"},
) {
	const defaultColor = useColorModeValue("dark.900", "light.200");
	return (
	  <HStack alignItems="center" space={4}>
		  <Icon
			as={as || Feather}
			name={name}
			color={color || defaultColor}
			size={5}
			my={2}
		  />
		  <Text color={color || defaultColor}>{text}</Text>
	  </HStack>
	);
}