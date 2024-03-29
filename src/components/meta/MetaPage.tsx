import { Entypo } from "@expo/vector-icons";
import { AspectRatio, Box, Button, Heading, HStack, Icon, Image, Pressable, ScrollView, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { ButtonProps } from "../../config/props";
import useThumbnail from "../../hooks/useThumbnail";
import { OpenLibraryService } from "../../services/cloud";
import { MetaPageProps } from "../../types/import";
import ImagePlaceholder from "../reusables/ImagePlaceholder";

export default function MetaPage({ state, functions }: MetaPageProps) {
	const { width } = useWindowDimensions();

	const [img, setImg] = useState("");
	const [saving, setSaving] = useState(false);
	const [bookData, setBookData] = useState<any>({
		has_loaded: false,
		data: null,
	});

	const { data, file } = state;
	const { toggleStep, handleModalDismiss, handleComplete } = functions;

	useEffect(() => {
		if (data?.cover_i) {
			setImg(OpenLibraryService.getImageByID(data.cover_i, "M"));
		}
		(async () => await getBookData())();
	}, [data]);

	const getBookData = async () => {
		try {
			const bookSeed = data?.seed?.filter((seed: string) => seed.startsWith("/books"))[0];
			const key = data?.edition_key[0] || bookSeed?.split("/")?.[2];
			if (key) {
				const { data } = await OpenLibraryService.getBookDataByKey(key);
				setBookData((prev: any) => ({ ...prev, data }));
			}
		}
		catch (e) {
		} finally {
			setBookData((prev: any) => ({ ...prev, has_loaded: true }));
		}
	};

	const handleFlowComplete = async () => {
		await handleComplete({ data, file, img, metadata: bookData, setSaving, handleModalDismiss })
	}

	const { fallback } = useThumbnail(img);

	return (
		<Box pb={4} px={2}>
			<Pressable onPress={toggleStep} _pressed={{ opacity: 0.5 }} mb={6} py={1}>
				<HStack alignItems="center">
					<Icon as={Entypo} name="chevron-left" size="sm" color="primary" />
					<Text fontSize={18} color="primary">
						Search
					</Text>
				</HStack>
			</Pressable>

			<ScrollView bg="transparent" px={0} showsVerticalScrollIndicator={false}>
				<HStack bg="transparent" w={width * 0.9} space={3}>
					<AspectRatio w={width * 0.3} ratio={9 / 12}>
						{img ? (
							<Image
								w="full"
								h="auto"
								resizeMode="cover"
								source={{ uri: img }}
								alt={data?.title || ""}
								defaultSource={fallback}
								rounded={8}
							/>
						) : (
							<ImagePlaceholder />
						)}
					</AspectRatio>
					<VStack bg="transparent" w={width * 0.6} space={2}>
						<Heading fontSize={30}>{data?.title || file?.name}</Heading>
						<Text fontSize={14} opacity={0.6}>
							{data?.author_name[0] || "Unknown author"}
							{data?.first_publish_year ? `, ${data?.first_publish_year}` : ""}
						</Text>
						{data?.number_of_pages_median && (
							<Text>{data?.number_of_pages_median} pages</Text>
						)}
						<HStack space={2} mt="auto" mb={1}>
							<Button
								{...ButtonProps}
								w={16}
								py={2}
								rounded={20}
								isLoading={saving}
								onPress={handleFlowComplete}
								isDisabled={!bookData.has_loaded}
							>
								Save
							</Button>
						</HStack>
					</VStack>
				</HStack>

				<Box my={6}>
					<Text fontSize={16}>{data?.subtitle || "No description."}</Text>
				</Box>

				{data?.contributor && (
					<>
						<Heading fontSize={20} mb={2}>
							Contributors
						</Heading>
						<Box _dark={{ bg: "muted.800" }} _light={{ bg: "muted.200" }} p={4} mb={1} rounded={8}>
							<Text fontSize={14}>{data?.contributor?.join(", ") || "None"}</Text>
						</Box>
					</>
				)}

				{data?.publisher && (
					<Text fontSize={13} mt={4} px={1} opacity={0.5}>
						&copy; {data?.publisher[0]}
						{data?.publish_year[0] && `, ${data?.publish_year[0]}`}
					</Text>
				)}
			</ScrollView>
		</Box>

	);
}
