import { Entypo } from "@expo/vector-icons";
import { AspectRatio, Flex, Icon } from "native-base";

export default function ImagePlaceholder() {
	return (
		<AspectRatio ratio={1}>
			<Flex w="full" _dark={{ bg: "muted.800" }} _light={{ bg: "muted.200" }} alignItems="center" justifyContent="center" rounded={8}>
				<Icon as={Entypo} name="book" size="4xl" _dark={{ color: "muted.700" }} _light={{ color: "muted.400" }} />
			</Flex>
		</AspectRatio>
	);
}
