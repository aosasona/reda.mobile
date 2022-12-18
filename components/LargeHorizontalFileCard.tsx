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
import screens from "../constants/screens";
import { CombinedFileResultType } from "../types/database";
import { getThumbnail } from "../utils/misc.util";
import ImagePlaceholder from "./ImagePlaceholder";

interface HorizontalFileCardProps {
	data: CombinedFileResultType;
	index: number;
	navigation: NavigationProp<any>;
}

export default function LargeHorizontalFileCard({
	data,
	index,
	navigation,
}: HorizontalFileCardProps) {
	const { width } = useWindowDimensions();
	const { thumb, fallback } = getThumbnail(data?.image);

	const navigateToDocumentPage = () => {
		navigation.navigate(screens.PREVIEW.screenName, { data });
	};
	return (
		<Pressable
			w={width * 0.7}
			_pressed={{ opacity: 0.6 }}
			mr={3}
			onPress={navigateToDocumentPage}
		>
			<VStack bg="transparent" space={3}>
				<AspectRatio ratio={1}>
					{data?.image ? (
						<Image
							w="full"
							h="full"
							source={thumb}
							defaultSource={fallback}
							resizeMode="cover"
							alt={data?.name || ""}
							rounded={8}
						/>
					) : (
						<ImagePlaceholder />
					)}
				</AspectRatio>
				<Box px={0.5}>
					<Heading fontSize={20} noOfLines={2}>
						{data?.name}
					</Heading>
					<Text fontSize={16} opacity={0.3} noOfLines={1} mt={1}>
						{data?.author}
					</Text>
				</Box>
			</VStack>
		</Pressable>
	);
}
