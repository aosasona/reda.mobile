import {Entypo} from "@expo/vector-icons";
import {AspectRatio, Box, Button, Heading, HStack, Icon, Image, Pressable, Text, VStack} from "native-base";
import {useEffect, useState} from "react";
import {Alert, useWindowDimensions} from "react-native";
import {ButtonProps} from "../constants/props";
import {FileModel, MetadataModel, SQLBoolean} from "../types/database";
import {MetaPageProps} from "../types/import";
import {saveFile} from "../utils/database.util";
import {getThumbnail, showToast} from "../utils/misc.util";
import {OpenLibraryService} from "../utils/request.util";
import ImagePlaceholder from "./ImagePlaceholder";

export default function MetaPage({state, functions}: MetaPageProps) {

	const {width} = useWindowDimensions();


	const [img, setImg] = useState("");
	const [saving, setSaving] = useState(false);
	const [bookData, setBookData] = useState<any>({
		has_loaded: false,
		data: null,
	});

	const {data, file} = state;
	const {toggleStep, handleModalDismiss} = functions;

	useEffect(() => {
		if (data?.cover_i) {
			setImg(OpenLibraryService.getImageByID(data.cover_i, "L"));
		}
		(async () => await getBookData())();
	}, [data]);

	const getBookData = async () => {
		try {
			const bookSeed = data?.seed?.filter((seed: string) => seed.startsWith("/books"))[0];
			const key = data?.edition_key[0] || bookSeed?.split("/")?.[2];
			if (key) {
				const {data} = await OpenLibraryService.getBookDataByKey(key);
				setBookData((prev: any) => ({...prev, data}));
			}
		}
		catch (e) {
		}
		finally {
			setBookData((prev: any) => ({...prev, has_loaded: true}));
		}
	}


	const save = async () => {
		try {
			setSaving(true);
			const file_data: FileModel = {
				name: data?.title || file?.name?.split(".")[0],
				path: file?.uri,
				size: file?.size,
				has_started: SQLBoolean.FALSE,
				has_finished: SQLBoolean.FALSE,
				is_downloaded: SQLBoolean.FALSE,
				is_starred: SQLBoolean.FALSE,
			}
			const meta: MetadataModel = {
				image: img || "",
				description: data?.subtitle || data?.description || "No description.",
				author: data?.author_name[0] || "Unknown author",
				raw: JSON.stringify(data),
				table_of_contents: JSON.stringify(bookData?.data?.table_of_contents || []),
				subjects: data?.subject_facet?.join(", ") || bookData?.data?.subjects?.join(", ") || "",
				first_publish_year: data?.first_publish_year || bookData?.data?.first_publish_year || data?.publish_year?.[0] || 0,
				book_key: data?.edition_key?.[0] || "",
				chapters: bookData?.data?.table_of_contents?.length || 1,
				current_page: 1,
				total_pages: bookData?.data?.number_of_pages || data?.number_of_pages_median || 1,
			}
			const res = await saveFile(file_data, meta);
			if (res) {
				showToast("Successfully saved file!");
			} else {
				showToast("An error occurred while saving file.", "error");
			}
			handleModalDismiss();
		}
		catch (e) {
			Alert.alert("Error", "An error occurred!");
		}
		finally {
			setSaving(false);
		}
	}

	const {thumb, fallback} = getThumbnail(img);

	return (
	  <Box pb={4}>
		  <Pressable onPress={toggleStep} _pressed={{opacity: 0.5}} mb={6} py={1}>
			  <HStack alignItems="center">
				  <Icon as={Entypo} name="chevron-left" size="sm" color="blue.600"/>
				  <Text fontSize={18} color="blue.600">Search</Text>
			  </HStack>
		  </Pressable>
		  <HStack bg="transparent" w={width * 0.9} space={3}>
			  <AspectRatio w={width * 0.3} ratio={9 / 12}>
				  {img
					? <Image w="full" h="auto" resizeMode="cover" source={thumb} alt={data?.title || ""} defaultSource={fallback} loadingIndicatorSource={fallback} rounded={8}/>
					: <ImagePlaceholder/>
				  }
			  </AspectRatio>
			  <VStack bg="transparent" w={width * 0.6} space={2}>
				  <Heading fontSize={30}>{data?.title || file?.name}</Heading>
				  <Text fontSize={14} opacity={0.6}>
					  {data?.author_name[0] || "Unknown author"}
					  {data?.first_publish_year
						? `, ${data?.first_publish_year}`
						: ""
					  }
				  </Text>
				  {data?.number_of_pages_median &&
					<Text>
						{data?.number_of_pages_median} pages
					</Text>
				  }
				  <HStack space={2} mt="auto" mb={1}>
					  <Button {...ButtonProps} w={16} py={2} rounded={20} isLoading={saving} onPress={save} isDisabled={!bookData.has_loaded}>
						  Save
					  </Button>
				  </HStack>
			  </VStack>
		  </HStack>

		  <Box my={6}>
			  <Text fontSize={16}>{data?.subtitle || "No description."}</Text>
		  </Box>

		  {data?.contributor && <>
			  <Heading fontSize={20} mb={2}>Contributors</Heading>
			  <Box _dark={{bg: "muted.800"}} _light={{bg: "muted.200"}} p={4} mb={1} rounded={8}>
				  <Text fontSize={14}>{data?.contributor?.join(", ") || "None"}</Text>
			  </Box>
		  </>}

		  {data?.publisher &&
			<Text fontSize={13} mt={4} px={1} opacity={0.5}>
				&copy; {data?.publisher[0]}{data?.publish_year[0] && `, ${data?.publish_year[0]}`}
			</Text>}
	  </Box>
	)
}