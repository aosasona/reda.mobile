import {AspectRatio, Flex, Heading, HStack, Image, Pressable, Text, VStack} from "native-base";
import {useEffect, useState} from "react";
import {ActivityIndicator, useWindowDimensions} from "react-native";
import {OpenLibraryService} from "../utils/request.util";

export default function MetaListCard({data, index, onPress}: { data: any, index: number, onPress: (index: number) => void }) {
	const [img, setImg] = useState("");

	const {width} = useWindowDimensions();

	useEffect(() => {
		if (data?.cover_i) {
			setImg(OpenLibraryService.getImageByID(data.cover_i, "M"));
		}
	}, [data]);

	return (
	  <Pressable _pressed={{opacity: 0.6}} onPress={() => onPress(index)} my={2}>
		  <HStack space={2} alignItems="stretch">
			  <AspectRatio w={width * 0.25} ratio={1} alignSelf="center">
				  {img
					? <Image resizeMode="cover" source={{uri: img}} alt={data?.title} rounded={10}/>
					: <Flex
					  _dark={{bg: "muted.800"}}
					  _light={{bg: "muted.200"}}
					  alignItems="center"
					  justifyContent="center"
					  rounded={8}
					>
						<ActivityIndicator size="small"/>
					</Flex>
				  }
			  </AspectRatio>
			  <VStack
				w={width * 0.65}
				bg="transparent"
				borderBottomWidth={1}
				_dark={{borderBottomColor: "muted.800"}}
				_light={{borderBottomColor: "muted.200"}}
				justifyContent="space-between"
				space={3}
				px={1}
				py={2}
			  >
				  <Heading fontSize={24} noOfLines={2}>{data?.title}</Heading>
				  <HStack justifyContent="space-between" space={1}>
					  {data?.author_name && <Text opacity={0.9} fontWeight={600}>{data?.author_name}</Text>}
					  {data?.publish_year && <Text opacity={0.3} fontSize={12} fontWeight={600}>Published {data?.publish_year[0]}</Text>}
				  </HStack>
			  </VStack>
		  </HStack>
	  </Pressable>
	)
}