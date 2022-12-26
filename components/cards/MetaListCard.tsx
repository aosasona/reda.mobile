import { AntDesign } from "@expo/vector-icons";
import {
	AspectRatio,
	Box,
	Flex,
	Heading,
	HStack,
	Icon,
	Image,
	Pressable,
	Text,
	VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { MetaCardProps } from "../../types/import";
import { getThumbnail } from "../../utils/misc.util";
import { OpenLibraryService } from "../../utils/request.util";
import ImagePlaceholder from "../reusables/ImagePlaceholder";

export default function MetaListCard({ state, functions }: MetaCardProps) {
	const [img, setImg] = useState("");

	const { width } = useWindowDimensions();
	const { meta, data, index } = state;
	const { onPress } = functions;

	useEffect(() => {
		if (data?.cover_i) {
			setImg(OpenLibraryService.getImageByID(data.cover_i, "M"));
		}
	}, [data]);

	const { thumb, fallback } = getThumbnail(img);

	return (
		<Pressable
			_pressed={{ opacity: 0.6 }}
			onPress={() => onPress(data, index)}
			my={2}
		>
			<HStack space={2} alignItems="stretch">
				<Box w={width * 0.25} position="relative">
					<AspectRatio w="full" ratio={1} alignSelf="center">
						{img ? (
							<Image
								w="full"
								h="auto"
								resizeMode="cover"
								source={thumb}
								defaultSource={fallback}
								alt={data?.title || ""}
								rounded={10}
							/>
						) : (
							<ImagePlaceholder />
						)}
					</AspectRatio>
					{meta?.currentIndex === index && (
						<VStack
							position="absolute"
							top={0}
							left={0}
							right={0}
							justifyContent="center"
							alignItems="center"
						>
							<AspectRatio
								ratio={1}
								w="full"
								bg="muted.900"
								opacity={0.8}
								justifyContent="center"
								alignItems="center"
								rounded={10}
							>
								<Flex
									w="full"
									h="full"
									justifyContent="center"
									alignItems="center"
								>
									<Icon
										as={AntDesign}
										name="checkcircle"
										size="xl"
										color="green.500"
									/>
								</Flex>
							</AspectRatio>
						</VStack>
					)}
				</Box>
				<VStack
					w={width * 0.64}
					bg="transparent"
					borderBottomWidth={1}
					_dark={{ borderBottomColor: "muted.800" }}
					_light={{ borderBottomColor: "muted.200" }}
					justifyContent="space-between"
					space={3}
					px={1}
					py={2}
				>
					<Heading fontSize={20} noOfLines={2}>
						{data?.title}
					</Heading>
					<HStack justifyContent="space-between" space={1}>
						{data?.author_name && (
							<Text opacity={0.9} fontWeight={600} noOfLines={1}>
								{data?.author_name[0]}
							</Text>
						)}
						{data?.publish_year && (
							<Text opacity={0.3} fontSize={12} fontWeight={600}>
								{data?.publish_year[0]}
							</Text>
						)}
					</HStack>
				</VStack>
			</HStack>
		</Pressable>
	);
}