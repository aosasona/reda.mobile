import {Entypo} from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import {Box, Button, FlatList, Heading, Icon, Input, Text, useDisclose, VStack} from "native-base";
import {useEffect, useState} from "react";
import {Alert} from "react-native";
import DownloadingCard from "../components/DownloadingCard";
import MetaList from "../components/MetaList";
import {ButtonProps, InputProps} from "../constants/props";
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
		const metadataResult = (await OpenLibraryService.search({title: filename, limit: 50}))["docs"];
		setProcessed(true);
		if (!metadataResult) throw new CustomException("Something went wrong while processing the file");
		setAllMetadata(metadataResult);
		setProcessed(false);
	}

	const showSkip = () => {
		Alert.alert("Skip", "Metadata is taking too long, cancel operation?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "OK",
				style: "destructive",
				onPress: () => {
					nextStep();

				},
			},
		]);
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
			} else {
				setLoadingFile(false);
			}
		}
		catch (e: any) {
			const msg = e instanceof CustomException ? e.message : "An error occurred";
			Alert.alert("Error", msg);
		}
	}

	const HeaderComponent = <Box safeAreaTop>
		<Heading fontSize={44} mt={4} ml={2}>Import</Heading>
		<ContentAboveList
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
		  setLoadingFile={setLoadingFile}
		/></Box>

	const EmptyComponent = <Box h={72} flex={1} alignItems="center" justifyContent="center">
		<Icon as={Entypo} name="download" size={20} _dark={{color: "muted.800"}} _light={{color: "muted.300"}}/>
		<Text _dark={{color: "muted.800"}} _light={{color: "muted.300"}} mt={3}>
			No ongoing downloads
		</Text>
	</Box>

	return (
	  <FlatList
		data={downloadingList}
		renderItem={({item, index}) => <DownloadingCard key={index} item={item} index={index} onDelete={removeDownloadingItem}/>}
		keyExtractor={(item, index) => index.toString()}
		ListHeaderComponent={HeaderComponent}
		ListEmptyComponent={EmptyComponent}
		px={4}
	  />
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
	setLoadingFile,
}: any) {

	useEffect(() => {
		if (processed) onOpen();
	}, [processed])

	const {isOpen, onOpen, onClose} = useDisclose();

	const resetStates = () => {
		setSearch("");
		setURL("");
		setLoadingFile(false);
		setProcessed(false);
		setMetadata(null);
		setAllMetadata([]);
		setStep(0);
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
			file={file}
			step={step}
			setStep={setStep}
			search={search}
			setSearch={setSearch}
			allMetadata={allMetadata}
			currentMetadata={metadata}
			handleModalClose={handleModalClose}
			onMetadataSelect={onMetadataSelect}
		  />

		  <Box mt={4}>
			  <VStack space={4} bg="transparent" alignItems="center">
				  <Box alignItems="center">
					  <Input
						w="100%"
						type="text"
						placeholder="example.com"
						onChangeText={setURL}
						value={URL}
						InputLeftElement={<Text ml={3} color="muted.400">https://</Text>}
						InputRightElement={
							<Button
							  size="xs"
							  w="1/6"
							  h="full"
							  onPress={handleURLDownload}
							  _text={{fontSize: 14, fontWeight: 500}}
							  {...ButtonProps}
							  rounded={0}
							>
								Go
							</Button>
						}
						{...InputProps}
					  />
				  </Box>

				  <Text color="muted.600" fontSize={16}>OR</Text>

				  <Button
					w="full"
					onPress={triggerFilePicker}
					isLoading={loadingFile}
					{...ButtonProps}
				  >
					  Import from device
				  </Button>
			  </VStack>
		  </Box>
	  </>
	)
}