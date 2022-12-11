import {AntDesign, Entypo} from "@expo/vector-icons";
import {NavigationProp} from "@react-navigation/native";
import {AspectRatio, Box, Flex, Heading, HStack, Icon, IconButton, Progress, Text} from "native-base";
import {ImageBackground} from "react-native";
import {CombinedFileResultType} from "../types/database";
import Back from "./Back";

interface PreviewHeaderProps {
	source: any,
	loadingIndicatorSource: any,
	navigation: NavigationProp<any>,
	data: CombinedFileResultType,
	onPress: () => Promise<void>
}

export default function PreviewHeader({data, source, loadingIndicatorSource, onPress, navigation}: PreviewHeaderProps) {

	const progress = Number((data?.total_pages ? ((data?.current_page || 1) / data?.total_pages) * 100 : 0)?.toFixed(0));


	return <AspectRatio w="full" position="relative" ratio={1}>
		<ImageBackground source={source} loadingIndicatorSource={loadingIndicatorSource} defaultSource={loadingIndicatorSource} resizeMode="cover">
			<Box position="absolute" top={0} bottom={0} left={0} right={0} bg="rgba(0,0,0,0.65)"/>

			<Flex flex={1} justifyContent="space-between" alignItems="flex-start" px={4} pb={4}>
				<HStack w="full" justifyContent="space-between" alignItems="center" py={0} my={0} safeAreaTop>
					<Back navigation={navigation} page="Home"/>
					<HStack space={2} alignItems="center">
						<IconButton
						  icon={<Icon as={AntDesign} name={data?.is_starred ? "star" : "staro"}/>}
						  _icon={{
							  color: "yellow.400",
							  size: 6,
						  }}
						  _pressed={{
							  bg: "transparent",
							  _icon: {
								  opacity: 0.5,
							  },
						  }}
						  p={2}
						  m={0}
						  onPress={onPress}
						/>
						<IconButton
						  icon={<Icon as={Entypo} name="dots-three-horizontal"/>}
						  _icon={{
							  color: "muted.100",
							  size: 5,
						  }}
						  _pressed={{
							  bg: "transparent",
							  _icon: {
								  opacity: 0.5,
							  },
						  }}
						  p={2}
						  m={0}
						/>
					</HStack>
				</HStack>
				<Box>
					<Box>
						<Heading color="white" fontSize={48} noOfLines={4} shadow={3}>{data?.name}</Heading>
						<Text color="white" fontSize={16} noOfLines={2} shadow={3} opacity={0.8} mt={2}>{data?.author}</Text>
					</Box>
				</Box>
			</Flex>

			<Progress value={progress} rounded={0} colorScheme="emerald" _filledTrack={{rounded: 0}}/>
		</ImageBackground>
	</AspectRatio>;
}