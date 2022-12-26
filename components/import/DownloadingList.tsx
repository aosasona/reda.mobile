import {Entypo, Feather} from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Lottie from "lottie-react-native";
import {AspectRatio, Box, FlatList, Flex, HStack, Icon, Pressable, Text, useColorMode, View, VStack} from "native-base";
import {useEffect, useState} from "react";
import {Alert, Animated, Platform, RefreshControl, useWindowDimensions} from "react-native";
import {Swipeable} from "react-native-gesture-handler";
import {DownloadingCardProps, DownloadingListProps, ImportStatesProps} from "../../types/import";

const DownloadingAnimation = require('../../assets/animations/downloading.json');

export default function DownloadingList({state, setState, reset, HeaderComponent}: DownloadingListProps) {

	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		if (Platform.OS === "ios") {
			Clipboard.hasUrlAsync().then((hasUrl) => {
				if (hasUrl) {
					Clipboard.getStringAsync().then((url) => {
						if (url) {
							setState((prevState) => (
							  {
								  ...prevState,
								  URL: url,
							  }
							))
						}
					})
				}
			})
		}
	}, []);

	const onRefresh = () => {
		Alert.alert("Reset page", "Are you sure you want to reset the page content?", [
			{
				text: "Cancel",
				onPress: () => setRefreshing(false),
			},
			{
				text: "Reset",
				onPress: () => {
					setRefreshing(true);
					reset();
					setRefreshing(false);
				},
			},
		])
	}

	const onDelete = (i: number) => {
		Alert.alert("Remove", "Are you sure you want to cancel this download?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "OK",
				style: "destructive",
				onPress: () => {
					setState((current: ImportStatesProps) => ({
						...current,
						downloadingList: state.downloadingList.filter((_, index) => index !== i),
					}));
				},
			},
		]);

	}

	return (
	  <FlatList
		data={state.downloadingList}
		renderItem={({item, index}) => <DownloadingCard item={item} index={index} onDelete={onDelete}/>}
		keyExtractor={(item, index) => index.toString()}
		ListHeaderComponent={HeaderComponent}
		ListEmptyComponent={DownloadingListEmpty}
		refreshControl={<RefreshControl
		  refreshing={refreshing}
		  onRefresh={onRefresh}
		  progressViewOffset={50}
		/>}
		px={3}
	  />
	)
}


export function DownloadingAnim() {
	const {colorMode} = useColorMode();
	const isDark = colorMode === "dark";

	return (
	  <Lottie source={DownloadingAnimation} colorFilters={[
		  {
			  keypath: 'Arrow',
			  color: isDark ? "#FAFAFA" : "#101010",
		  },
		  {
			  keypath: 'Outline',
			  color: isDark ? "#FAFAFA" : "#101010",
		  },
		  {
			  keypath: 'Outline 2',
			  color: isDark ? "#FAFAFA20" : "#3A3A3A20",
		  },
	  ]} autoPlay loop/>
	)
}

export function DownloadingListEmpty() {

	const {height} = useWindowDimensions();

	return (
	  <Box h={height * 0.5} flex={1} alignItems="center" justifyContent="center">
		  <Icon as={Entypo} name="download" size={20} _dark={{color: "muted.800"}} _light={{color: "muted.300"}}/>
		  <Text _dark={{color: "muted.700"}} _light={{color: "muted.300"}} mt={3}>
			  No ongoing downloads
		  </Text>
	  </Box>
	)
}

export function DownloadingCard({item, index, onDelete}: DownloadingCardProps) {


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
	  <Swipeable renderRightActions={renderRightActions} containerStyle={{marginBottom: 10}}>
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