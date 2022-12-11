import {Heading, HStack, Pressable, Text} from "native-base";

interface HomeSectionTitleProps {
	title: string;
}

export default function HomeSectionTitle({title}: HomeSectionTitleProps) {
	return (
	  <HStack alignItems="flex-end" justifyContent="space-between" space={4} px={2} mt={4} mb={4}>
		  <Heading fontSize={28}>{title}</Heading>
		  <Pressable _pressed={{opacity: 0.5}} p={0} m={0}>
			  <Text fontSize={13} color="blue.500">Show All</Text>
		  </Pressable>
	  </HStack>
	)
}