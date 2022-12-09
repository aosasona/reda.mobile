import {AspectRatio, Box, Heading, Image, Pressable, Text, VStack} from "native-base";
import {useWindowDimensions} from "react-native";
import {CombinedFileResultType} from "../utils/database.util";
import ImagePlaceholder from "./ImagePlaceholder";

interface HorizontalFileCardProps {
	data: CombinedFileResultType;
	index: number;
}

export default function HorizontalFileCard({data, index}: HorizontalFileCardProps) {

	const {width} = useWindowDimensions();

	return (
	  <Pressable w={width * 0.42} _pressed={{opacity: 0.6}}>
		  <VStack bg="transparent" space={3} mr={3}>
			  <AspectRatio ratio={1}>
				  {data?.image
					? <Image resizeMode="cover" source={{uri: data?.image}} alt={data?.name || ""} rounded={8}/>
					: <ImagePlaceholder/>
				  }
			  </AspectRatio>
			  <Box px={0.5}>
				  <Heading fontSize={18} noOfLines={2}>{data?.name}</Heading>
				  <Text fontSize={14} opacity={0.4} noOfLines={1} mt={1}>{data?.author}</Text>
			  </Box>
		  </VStack>
	  </Pressable>
	)
}