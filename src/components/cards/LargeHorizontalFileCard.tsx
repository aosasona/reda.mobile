import { MenuView, NativeActionEvent } from "@react-native-menu/menu";
import { NavigationProp } from "@react-navigation/native";
import { AspectRatio, Box, Heading, Image, PresenceTransition, Pressable, Text, VStack } from "native-base";
import { useWindowDimensions } from "react-native";
import screens from "../../constants/screens";
import useThumbnail from "../../hooks/useThumbnail";
import { getActions, handleMenuEvent } from "../../lib/menus/preview";
import { CombinedFileResultType } from "../../types/database";

interface HorizontalFileCardProps {
	data: CombinedFileResultType;
	index: number;
	navigation: NavigationProp<any>;
}

export default function LargeHorizontalFileCard({
	data,
	navigation,
}: HorizontalFileCardProps) {
	const { width } = useWindowDimensions();
	const { thumb, fallback } = useThumbnail(data?.image, data.path);
	const actions = getActions(data);

	function navigateToDocumentPage() {
		navigation.navigate(screens.PREVIEW.screenName, { data });
	};

	async function handleMenuEventPress({ nativeEvent }: NativeActionEvent) {
		await handleMenuEvent(nativeEvent.event, data, navigation);
	};

	return (
		<PresenceTransition visible={data != null} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<Pressable w={width * 0.78} _pressed={{ opacity: 0.6 }} mr={4} mt={4} onPress={navigateToDocumentPage}>
				<VStack bg="transparent" space={3}>
					<MenuView actions={actions} onPressAction={handleMenuEventPress} shouldOpenOnLongPress>
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
						<Heading fontSize={22} noOfLines={2}>{data?.name}</Heading>
						<Text fontSize={16} opacity={0.3} noOfLines={1} mt={1}>{data?.author}</Text>
					</Box>
				</VStack>
			</Pressable>
		</PresenceTransition>
	);
}
