import {Entypo} from "@expo/vector-icons";
import {Heading, HStack, Icon, Pressable} from "native-base";

interface HomeSectionTitleProps {
	title: string;
}

export default function HomeSectionTitle({title}: HomeSectionTitleProps) {
	return (
	  <Pressable _pressed={{opacity: 0.5}} p={0} mt={4} mb={4}>
		  <HStack alignItems="center" justifyContent="flex-start">
			  <Heading fontSize={26} fontWeight={600}>{title}</Heading>
			  <Icon as={Entypo} name="chevron-right" opacity={0.75} size={6}/>
		  </HStack>
	  </Pressable>
	)
}