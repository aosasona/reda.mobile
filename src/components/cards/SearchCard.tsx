import { MenuView, NativeActionEvent } from "@react-native-menu/menu";
import { NavigationProp } from "@react-navigation/native";
import { AspectRatio, Box, Heading, HStack, Image, Pressable, Text, VStack } from "native-base";
import { useWindowDimensions } from "react-native";
import screens from "../../constants/screens";
import useThumbnail from "../../hooks/useThumbnail";
import { getActions, handleMenuEvent } from "../../lib/menus/preview";
import { CombinedFileResultType } from "../../types/database";

interface SearchCardProps {
	data: CombinedFileResultType;
	navigation: NavigationProp<any>;
}

export default function SearchCard({ data, navigation }: SearchCardProps) {
	const { width } = useWindowDimensions();

	const { thumb, fallback } = useThumbnail(data?.image, data.path);

	function navigateToDocumentPage() {
		navigation.navigate(screens.PREVIEW.screenName, { data });
	};

	const actions = getActions(data);

	async function handleMenuEventPress({ nativeEvent }: NativeActionEvent) {
		await handleMenuEvent(nativeEvent.event, data, navigation);
	};

	return (
		<Pressable w={width} _pressed={{ opacity: 0.6 }} onPress={navigateToDocumentPage}>
			<MenuView actions={actions} onPressAction={handleMenuEventPress} shouldOpenOnLongPress >
				<HStack w="full" bg="transparent" space={width * 0.02}>
					<Box w={width * 0.15}>
						<AspectRatio ratio={1}>
							<Image w="full" h="full" source={thumb} defaultSource={fallback} resizeMode="cover" alt={data?.name || ""} rounded={8} />
						</AspectRatio>
					</Box>
					<VStack w={width * 0.74} pt={0} px={1} py={1}>
						<Heading fontSize={20} noOfLines={1}>{data?.name}</Heading>
						<Text fontSize={14} opacity={0.3} noOfLines={1} mt="auto">{data?.author}</Text>
					</VStack>
				</HStack>
			</MenuView>
		</Pressable>
	);
}
