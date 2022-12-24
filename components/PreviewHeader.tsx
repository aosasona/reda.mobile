import { AntDesign, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import {
	AspectRatio,
	Box,
	Flex,
	Heading,
	HStack,
	Icon,
	IconButton,
	Menu,
	Pressable,
	Progress,
	Text,
} from "native-base";
import { ImageBackground } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CombinedFileResultType } from "../types/database";
import Back from "./Back";

interface PreviewHeaderProps {
	source: any;
	defaultSource: any;
	data: CombinedFileResultType;
}

interface PreviewNavigationHeaderProps {
	data: CombinedFileResultType;
	navigation: NavigationProp<any>;
	onPress: () => Promise<void>;
	onDelete: () => Promise<void>;
}

export default function PreviewHeader({
	data,
	source,
	defaultSource,
}: PreviewHeaderProps) {
	const { top } = useSafeAreaInsets();
	const progress = Number(
		(data?.total_pages
			? ((data?.current_page || 1) / data?.total_pages) * 100
			: 0
		)?.toFixed(0)
	);

	return (
		<AspectRatio w="full" position="relative" mt={-top * 2} ratio={0.9}>
			<ImageBackground
				source={source}
				defaultSource={defaultSource}
				resizeMode="cover"
			>
				<Box
					position="absolute"
					top={0}
					bottom={0}
					left={0}
					right={0}
					bg="rgba(0,0,0,0.7)"
				/>

				<Flex
					flex={1}
					justifyContent="space-between"
					alignItems="flex-start"
					px={4}
					pb={4}
				>
					<Box mt="auto">
						<Box>
							<Heading color="white" fontSize={42} noOfLines={4} shadow={3}>
								{data?.name}
							</Heading>
							<Text
								color="white"
								fontSize={16}
								noOfLines={2}
								shadow={3}
								opacity={0.8}
								mt={2}
							>
								{data?.author}, {data?.first_publish_year || "2022"}
							</Text>
						</Box>
					</Box>
				</Flex>

				<Progress
					value={progress}
					rounded={0}
					colorScheme="emerald"
					_filledTrack={{ rounded: 0 }}
				/>
			</ImageBackground>
		</AspectRatio>
	);
}

export const PreviewNavigationHeader = ({
	data,
	navigation,
	onPress,
	onDelete,
}: PreviewNavigationHeaderProps) => {
	const { top } = useSafeAreaInsets();
	return (
		<HStack
			w="full"
			justifyContent="space-between"
			alignItems="center"
			px={3}
			pt={top}
			py={1}
			my={0}
		>
			<Back navigation={navigation} page="Home" />
			<HStack space={2} alignItems="center">
				<IconButton
					icon={
						<Icon as={AntDesign} name={data?.is_starred ? "star" : "staro"} />
					}
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
				<Menu
					w={200}
					trigger={(props) => (
						<IconButton
							icon={<Icon as={Entypo} name="dots-three-horizontal" />}
							_icon={{ color: "muted.100", size: 5 }}
							_pressed={{ bg: "transparent", _icon: { opacity: 0.5 } }}
							p={2}
							m={0}
							{...props}
						/>
					)}
				>
					<Menu.Item>
						<Pressable w="full" _pressed={{ opacity: 0.5 }} onPress={onDelete}>
							<HStack space={2}>
								<Icon
									as={Feather}
									name={data?.has_started ? "eye-off" : "eye"}
									size={4}
								/>
								<Text>
									Mark as {data?.has_started ? "unread" : "completed"}
								</Text>
							</HStack>
						</Pressable>
					</Menu.Item>
					<Menu.Item>
						<Pressable w="full" _pressed={{ opacity: 0.5 }} onPress={onDelete}>
							<HStack space={2}>
								<Icon as={Feather} name="trash" size={4} color="red.500" />
								<Text color="red.500">Delete</Text>
							</HStack>
						</Pressable>
					</Menu.Item>
				</Menu>
			</HStack>
		</HStack>
	);
};
