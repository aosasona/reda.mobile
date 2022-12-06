import {Entypo} from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import {Box, Button, FlatList, Flex, Icon, Input, ScrollView, Text, useDisclose, VStack} from "native-base";
import {useEffect, useState} from "react";
import {Alert} from "react-native";
import DownloadingCard from "../components/DownloadingCard";
import MetaList from "../components/MetaList";
import CustomException from "../exceptions/CustomException";
import {deleteFile, File, handleFilePick} from "../utils/file.util";
import {OpenLibraryService} from "../utils/request.util";


export default function Import() {

	const [step, setStep] = useState(0);
	const [search, setSearch] = useState("");
	const [URL, setURL] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [processed, setProcessed] = useState(false);
	const [metadata, setMetadata] = useState<any>(null);
	const [allMetadata, setAllMetadata] = useState<any>(null);
	const [downloadingList, setDownloadingList] = useState<any[]>([]);
	const [loadingFile, setLoadingFile] = useState(false);

	useEffect(() => {
		if (file && search?.length > 3) {
			(async () => searchForBook(search))();
		}
	}, [search])

	const nextStep = () => {
		setStep(step + 1);
	}

	const prevStep = () => {
		setStep(step - 1);
	}

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

	const searchForBook = async (filename: string) => {
		const metadataResult = (await OpenLibraryService.search({title: filename}))["docs"];
		setProcessed(true);
		if (!metadataResult) throw new CustomException("Something went wrong while processing the file");
		setAllMetadata(metadataResult);
		setProcessed(false);
	}

	const triggerFilePicker = async () => {
		try {
			setLoadingFile(true);
			setProcessed(false);
			const result = await DocumentPicker.getDocumentAsync({
				type: ["application/pdf", "application/msword"],
				copyToCacheDirectory: true,
			});
			if (result?.type === "success") {
				const data = await handleFilePick(result);
				if (!data) throw new CustomException("Something went wrong while processing the file");
				setFile(data);
				const filename = data?.name?.split(".")[0] || "";
				await searchForBook(filename);
				setLoadingFile(false);
				setSearch(filename);
			}
		}
		catch (e: any) {
			console.log(e);
			const msg = e instanceof CustomException ? e.message : "An error occurred";
			Alert.alert("Error", msg);
		}
	}

	const HeaderComponent = <ContentAboveList
	  step={step}
	  setStep={setStep}
	  search={search}
	  setSearch={setSearch}
	  URL={URL}
	  setURL={setURL}
	  file={file}
	  setFile={setFile}
	  metadata={metadata}
	  setMetadata={setMetadata}
	  processed={processed}
	  setProcessed={setProcessed}
	  allMetadata={allMetadata}
	  setAllMetadata={setAllMetadata}
	  next={nextStep}
	  previous={prevStep}
	  triggerFilePicker={triggerFilePicker}
	  loadingFile={loadingFile}
	/>

	return (
	  <>
		  {downloadingList.length > 0 ? <FlatList
			  ListHeaderComponent={HeaderComponent}
			  data={downloadingList}
			  renderItem={({item, index}) => <DownloadingCard item={item} index={index} onDelete={removeDownloadingItem}/>}
			  keyExtractor={(item, index) => index.toString()}
			  px={4}
			  mt={2}
			/>
			:
			<ScrollView>
				{HeaderComponent}
				<Flex h={72} flex={1} alignItems="center" justifyContent="center">
					<Icon as={Entypo} name="download" size={20} _dark={{color: "muted.800"}} _light={{color: "muted.300"}}/>
					<Text _dark={{color: "muted.800"}} _light={{color: "muted.300"}} mt={3}>
						No ongoing downloads
					</Text>
				</Flex></ScrollView>
		  }
	  </>
	)
}

export function ContentAboveList({
	step,
	setStep,
	search,
	setSearch,
	URL,
	setURL,
	file,
	setFile,
	processed,
	setProcessed,
	metadata,
	setMetadata,
	allMetadata,
	setAllMetadata,
	downloadingList,
	setDownloadingList,
	next,
	previous,
	triggerFilePicker,
	loadingFile,
}: any) {

	useEffect(() => {
		if (processed) onOpen();
	}, [processed])

	const {isOpen, onOpen, onClose} = useDisclose();

	const resetStates = () => {
		setStep(0);
		setSearch("");
		setURL("");
		setProcessed(false);
		setMetadata(null);
		setAllMetadata([]);
	}

	const handleModalClose = () => {
		resetStates();
		deleteFile(file?.uri).then(() => setFile(null)).catch(() => {
			Alert.alert("Error", "An error occurred.")
		});
		onClose();
	}

	const onMetadataSelect = (item: number) => {
		setMetadata(allMetadata[item]);
		next();
	}

	const handleURLDownload = () => {}

	return (
	  <>

		  <MetaList
			isOpen={isOpen}
			next={next}
			previous={previous}
			step={step}
			setStep={setStep}
			search={search}
			setSearch={setSearch}
			allMetadata={allMetadata}
			handleModalClose={handleModalClose}
			onMetadataSelect={onMetadataSelect}
		  />

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
							  w="1/6"
							  h="full"
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
					_loading={{bg: "muted.900", _text: {color: "muted.100"}}}
					rounded={8}
					py={3}
					onPress={triggerFilePicker}
					isLoading={loadingFile}
				  >
					  Import from device
				  </Button>
			  </VStack>
		  </Box>
	  </>
	)
}