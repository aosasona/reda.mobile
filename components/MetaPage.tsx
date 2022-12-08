import {Entypo} from "@expo/vector-icons";
import {AspectRatio, Box, Button, Heading, HStack, Icon, Image, Pressable, Text, VStack} from "native-base";
import {useEffect, useState} from "react";
import {Alert, useWindowDimensions} from "react-native";
import {ButtonProps} from "../constants/props";
import {MetaPageProps} from "../types/import";
import {FileModel, MetadataModel, saveFile, SQLBoolean} from "../utils/database.util";
import {showToast} from "../utils/misc.util";
import {OpenLibraryService} from "../utils/request.util";
import ImagePlaceholder from "./ImagePlaceholder";

export default function MetaPage({state, functions}: MetaPageProps) {

	const {width} = useWindowDimensions();
	const [img, setImg] = useState("");
	const [saving, setSaving] = useState(false);

	const {data, file} = state;
	const {toggleStep, handleModalDismiss} = functions;

	useEffect(() => {
		if (data?.cover_i) {
			setImg(OpenLibraryService.getImageByID(data.cover_i, "L"));
		}
	}, [data]);

	const save = async () => {
		try {
			setSaving(true);
			const file_data: FileModel = {
				name: file?.name || "",
				path: file?.uri,
				size: file?.size,
			}
			const meta: MetadataModel = {
				name: data?.title || file?.name?.split(".")[0],
				image: img || "",
				description: data?.subtitle || "No description.",
				author: data?.author_name[0] || "Unknown author",
				chapters: 0,
				total_pages: data?.number_of_pages_median || 0,
				has_started: SQLBoolean.FALSE,
				has_finished: SQLBoolean.FALSE,
			}
			const res = await saveFile(file_data, meta);
			if (res) {
				showToast("File saved successfully");
				handleModalDismiss();
			}
		}
		catch (e) {
			Alert.alert("Error", "An error occurred while saving the file");
		}
		finally {
			setSaving(false);
		}
	}

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
					? <Image resizeMode="cover" source={{uri: img}} alt={data?.title || ""} rounded={8}/>
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
					  <Button {...ButtonProps} w={16} py={2} rounded={20} isLoading={saving} onPress={save}>
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