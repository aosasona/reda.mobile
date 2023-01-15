import {MaterialIcons} from "@expo/vector-icons";
import {Box, Flex, Icon, Text} from "native-base";
import {useWindowDimensions} from "react-native";

interface EmptySectionProps {
	title: string;
}

export default function EmptySection({title}: EmptySectionProps) {
	const {width} = useWindowDimensions();

	return (
	  <Flex
		w={width * 0.9}
		alignItems="center"
		justifyContent="center"
		mx="auto"
		my={16}
	  >
		  <Box alignItems="center">
			  <Icon
				as={MaterialIcons}
				name="folder"
				size={32}
				_dark={{color: "dark.700"}}
				_light={{color: "muted.300"}}
			  />
			  <Text
				fontSize={16}
				_dark={{color: "muted.800"}}
				_light={{color: "muted.400"}}
				mt={2}
			  >
				  Nothing to see here yet...
			  </Text>
		  </Box>
	  </Flex>
	);
}