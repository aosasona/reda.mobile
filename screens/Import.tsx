import * as DocumentPicker from "expo-document-picker";
import {DocumentResult} from "expo-document-picker";
import {Box, Button, FlatList, Heading, Input, Text, VStack} from "native-base";
import {useState} from "react";
import {Alert} from "react-native";
import DownloadingCard from "../components/DownloadingCard";


export default function Import() {

	const [downloadingList, setDownloadingList] = useState<any[]>([
		{
			name: "test-file-1.pdf",
			progress: 0,
			queuedAt: new Date(),
		},
	]);

	const removeDownloadingItem = (index: number) => {
		Alert.alert("Remove", "Are you sure you want to cancel this download?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "OK",
				style: "destructive",
				onPress: () => {
					const newList = downloadingList.filter((_, i) => i !== index);
					setDownloadingList(newList);
				},
			},
		]);

	}


	return (
	  <FlatList
		ListHeaderComponent={<ContentAboveList/>}
		data={downloadingList}
		renderItem={({item, index}) => <DownloadingCard item={item} index={index} onDelete={removeDownloadingItem}/>}
		keyExtractor={(item, index) => index.toString()}
		px={4}
	  />
	)
}

export function ContentAboveList() {

	const [URL, setURL] = useState("");
	const [file, setFile] = useState<DocumentResult>();

	const triggerFilePicker = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: ["application/pdf", "application/msword"],
				copyToCacheDirectory: true,
			});
			console.log(result);
			if (result?.type === "success") {
				setFile(result);
			}
		}
		catch (e) {
			console.log(e);
			Alert.alert("Error", "An error occurred while trying to pick a file");
		}
	}

	const handleURLDownload = () => {}

	return (
	  <Box mt={4}>
		  <VStack space={4} bg="transparent" alignItems="center">
			  <Box alignItems="center">
				  <Input
					w="100%"
					type="text"
					variant="filled"
					placeholder="https://"
					fontSize={14}
					borderWidth={0}
					_light={{bg: "muted.200", _focus: {bg: "muted.200"}}}
					_dark={{bg: "muted.900", _focus: {bg: "muted.900"}}}
					py={3}
					rounded={8}
					onChangeText={setURL}
					value={URL}
					InputRightElement={
						<Button
						  size="xs"
						  rounded="none"
						  w="1/6" h="full"
						  _light={{bg: "muted.900", _text: {color: "muted.100"}}}
						  _dark={{bg: "muted.100", _text: {color: "muted.900"}}}
						  _pressed={{opacity: 0.8, bg: "muted.400"}}
						  onPress={handleURLDownload}
						  _text={{fontSize: 14, fontWeight: 500}}
						>
							Go
						</Button>
					}
				  />
			  </Box>

			  <Text color="muted.600" fontSize={16}>OR</Text>

			  <Button
				w="full" fontSize={12}
				_light={{bg: "muted.900", _text: {color: "muted.100"}}}
				_dark={{bg: "muted.100", _text: {color: "muted.900"}}}
				_pressed={{opacity: 0.8, bg: "muted.400"}}
				rounded={8} py={3}
				onPress={triggerFilePicker}
			  >
				  Import from device
			  </Button>
		  </VStack>


		  <Heading color="muted.600" fontSize={18} mt={10} mb={3}>Pending Downloads</Heading>


	  </Box>
	)
}