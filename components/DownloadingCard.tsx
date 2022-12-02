import {Feather} from "@expo/vector-icons";
import {AspectRatio, Box, Flex, HStack, Icon, Pressable, Text, View, VStack} from "native-base";
import {Animated} from "react-native";
import {Swipeable} from "react-native-gesture-handler";
import DownloadingAnim from "./DownloadingAnim";

interface DownloadingCardProps {
	item: any;
	index: number;
	onDelete: (data: any) => void;
}

export default function DownloadingCard({item, index, onDelete}: DownloadingCardProps) {

	const renderRightActions = (
	  progress: Animated.AnimatedInterpolation<any>,
	  dragX: Animated.AnimatedInterpolation<any>,
	) => {

		return (
		  <View>
			  <Animated.View>
				  <Pressable _pressed={{opacity: 0.5}} onPress={() => onDelete(index)}>
					  <AspectRatio w={10} h="full" bg="red.500" ratio={1} rounded={8}>
						  <Flex alignItems="center" justifyContent="center">
							  <Icon as={Feather} name="trash-2" size={5} color="white"/>
						  </Flex>
					  </AspectRatio>
				  </Pressable>
			  </Animated.View>
		  </View>
		);
	};

	return (
	  <Swipeable renderRightActions={renderRightActions} containerStyle={{marginBottom: 6}}>
		  <HStack w="full" _light={{bg: "muted.200"}} _dark={{bg: "muted.900"}} alignItems="center" space={3} rounded={8} px={3} py={3}>
			  <Box w={12} h={12} rounded="full">
				  <DownloadingAnim/>
			  </Box>
			  <VStack space={1} flex={1} alignItems="flex-start">
				  <Text fontSize={15} fontWeight={500}>{item.name}</Text>
				  <Text fontSize={13} color="muted.500">{item.progress}%</Text>
			  </VStack>
		  </HStack>
	  </Swipeable>
	)
}