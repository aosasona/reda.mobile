import {MaterialIcons} from "@expo/vector-icons";
import {Box, Flex, Heading, Icon} from "native-base";
import {useWindowDimensions} from "react-native";

	 export default function EmptyLibrary() {
	const {height, width} = useWindowDimensions();

	return (
	  <Flex w={width * 0.9} h={height * 0.6} alignItems="center" justifyContent="center">
		  <Box alignItems="center">
			  <Icon as={MaterialIcons} name="folder" size={48} _dark={{color: "muted.800"}} _light={{color: "muted.300"}}/>
			  <Heading _dark={{color: "muted.800"}} _light={{color: "muted.300"}} mt={3}>
				  Oops! Empty library
			  </Heading>
		  </Box>
	  </Flex>
	)
}