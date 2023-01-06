import { MenuView, NativeActionEvent } from "@react-native-menu/menu";
import { NavigationProp } from "@react-navigation/native";
import {
	AspectRatio,
	Box,
	Heading,
	Image,
	Pressable,
	Text,
	VStack,
} from "native-base";
import { useWindowDimensions } from "react-native";
import screens from "../../constants/screens";
import { useThumbnail } from "../../hooks/useThumbnail";
import { CombinedFileResultType } from "../../types/database";
import { getActions, handleMenuEvent } from "../../utils/preview.util";

interface HorizontalFileCardProps {
	data: CombinedFileResultType;
	index: number;
	navigation: NavigationProp<any>;
}

export default function HorizontalFileCard({
	data,
	index,
	navigation,
}: HorizontalFileCardProps) {
	const { width } = useWindowDimensions();
	const { thumb, fallback } = useThumbnail(data?.image, data.path);

	const navigateToDocumentPage = () => {
		navigation.navigate(screens.PREVIEW.screenName, { data });
	};

	const actions = getActions(data);

	const handleMenuEventPress = async ({ nativeEvent }: NativeActionEvent) => {
		await handleMenuEvent(nativeEvent.event, data, navigation);
	};

	return (
		<Pressable
			w={width * 0.45}
			_pressed={{ opacity: 0.6 }}
			mr={3}
			onPress={navigateToDocumentPage}
		>
			<VStack bg="transparent" space={3}>
				<MenuView
					actions={actions}
					onPressAction={handleMenuEventPress}
					shouldOpenOnLongPress
				>
					<AspectRatio ratio={1}>
						<Image
							w="full"
							h="full"
							source={thumb}
							defaultSource={fallback}
							resizeMode="cover"
							alt={data?.name || ""}
							rounded={8}
						/>
					</AspectRatio>
				</MenuView>
				<Box px={0.5}>
					<Heading fontSize={18} noOfLines={2}>
						{data?.name}
					</Heading>
					<Text fontSize={14} opacity={0.3} noOfLines={1} mt={1}>
						{data?.author}
					</Text>
				</Box>
			</VStack>
		</Pressable>
	);
}
