import {AspectRatio, Box, Flex, Heading, Image, ScrollView} from "native-base";
import {useEffect} from "react";
import {ImageBackground} from "react-native";
import ImagePlaceholder from "../components/ImagePlaceholder";
import {ScreenProps} from "../types/general";
import {getThumbnail} from "../utils/misc.util";

export default function Preview({ route, navigation }: ScreenProps) {

	const { data } = route.params;

	if(!data) {
		navigation.goBack();
	}

	useEffect(() => {
		navigation.setOptions({ title: data?.name || "Preview" });
	} , []);

	const {thumb, fallback} = getThumbnail(data?.image);

	return (
	  <ScrollView px={0}>
		  <AspectRatio w="full" position="relative" ratio={1}>
			  <ImageBackground source={thumb} loadingIndicatorSource={fallback} defaultSource={fallback} resizeMode="cover">
				  <Box position="absolute" top={0} bottom={0} left={0} right={0} bg="rgba(0,0,0,0.6)" />
				  <Flex flex={1} justifyContent="flex-end" alignItems="flex-start" p={4}>
				    <Heading fontSize={48} noOfLines={4} shadow={3}>{data?.name}</Heading>
				  </Flex>
			  </ImageBackground>
		  </AspectRatio>
		  <Box px={4} py={4}>

		  </Box>
	  </ScrollView>
	)
}