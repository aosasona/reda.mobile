import {
	AspectRatio,
	Box,
	Flex,
	Heading,
	Progress,
	Text,
	VStack,
} from "native-base";
import { ImageBackground } from "react-native";
import { CombinedFileResultType } from "../../../types/database";

interface PreviewHeaderProps {
	source: any;
	defaultSource: any;
	data: CombinedFileResultType;
}

export default function PreviewHeader({ data, source, defaultSource, }: PreviewHeaderProps) {
	const progress = Number((data?.total_pages ? ((data?.current_page || 1) / data?.total_pages) * 100 : 0)?.toFixed(0)
	);

	return (
		<AspectRatio w="full" ratio={0.95}>
			<ImageBackground source={source} defaultSource={defaultSource} resizeMode="cover">
				<Box position="absolute" top={0} bottom={0} left={0} right={0} bg="rgba(0,0,0,0.75)" />

				<Flex flex={1} justifyContent="space-between" alignItems="flex-start" px={4} pb={4}>
					<Box mt="auto">
						<VStack space={1}>
							<Heading color="white" fontSize={40} noOfLines={3} shadow={4}>
								{data?.name}
							</Heading>
							<Text color="muted.400" fontSize={13} fontWeight="medium" noOfLines={2} shadow={4}>
								{data?.author?.toUpperCase() || ""}
								{data?.first_publish_year ? `, ${data?.first_publish_year}` : ""}
							</Text>
						</VStack>
					</Box>
				</Flex>

				<Progress value={progress} rounded={0} colorScheme="emerald" _filledTrack={{ rounded: 0 }} />
			</ImageBackground>
		</AspectRatio>
	);
}
