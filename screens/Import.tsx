import * as DocumentPicker from "expo-document-picker";
import {Box, useColorModeValue} from "native-base";
import {useState} from "react";
import {Alert} from "react-native";
import DownloadingList from "../components/DownloadingList";
import ImportHeader from "../components/ImportHeader";
import MetaList from "../components/MetaList";
import CustomException from "../exceptions/CustomException";
import {ImportStatesProps} from "../types/import";
import {handlePossibleNull} from "../utils/exception.util";
import {deleteFile, extractFileName, handleFilePick} from "../utils/file.util";
import {OpenLibraryService} from "../utils/request.util";


// TODO: Remove files after they are imported (or not)
// TODO: Show toast message when file is imported
// TODO: refactor and fix re-render issue

export default function Import() {

	const [mixedState, setMixedState] = useState<ImportStatesProps>({
		file: null,
		URL: "",
		downloadingList: [],
		loading: {
			local: false,
			remote: false,
		},
	})

	const handleRemoteImport = async () => {}

	const handleLocalImport = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: ["application/pdf", "application/msword"],
				copyToCacheDirectory: true,
			});
			if (result.type === "success") {
				const processedFile = await handleFilePick(result);
				handlePossibleNull(processedFile, "File could not be processed");
				const fileName = extractFileName(processedFile?.name as string);
				const onlineMetadata = (await OpenLibraryService.search({title: fileName, limit: 50}))["docs"];
			}
		}
		catch (e) {
			const msg = e instanceof CustomException ? e.message : "An error occurred";
			Alert.alert("Error", msg);
		}
	}

	const fullBg = useColorModeValue("brand-light", "brand-dark");
	return (
	  <DownloadingList
		state={mixedState}
		setState={setMixedState}
		HeaderComponent={<ImportHeader
		  state={mixedState}
		  setState={setMixedState}
		  callbacks={{handleLocalImport, handleRemoteImport}}
		/>}
	  />
	)
}

// export default function Import() {
//
// 	const {isOpen, onOpen, onClose} = useDisclose();
//
// 	const [step, setStep] = useState(0);
// 	const [search, setSearch] = useState("");
// 	const [URL, setURL] = useState("");
// 	const [file, setFile] = useState<File | null>(null);
// 	const [processed, setProcessed] = useState(false);
// 	const [metadata, setMetadata] = useState<any>(null);
// 	const [allMetadata, setAllMetadata] = useState<any>(null);
// 	const [downloadingList, setDownloadingList] = useState<any[]>([]);
// 	const [loadingFile, setLoadingFile] = useState(false);
//
// 	useEffect(() => {
// 		if (file && search?.length > 3) {
// 			(async () => searchForBook(search))();
// 		}
// 	}, [search])
//
// 	const nextStep = () => {
// 		setStep(step + 1);
// 	}
//
// 	const prevStep = () => {
// 		setStep(step - 1);
// 	}
//
// 	const removeDownloadingItem = (index: number) => {
// 		Alert.alert("Remove", "Are you sure you want to cancel this download?", [
// 			{
// 				text: "Cancel",
// 				style: "cancel",
// 			},
// 			{
// 				text: "OK",
// 				style: "destructive",
// 				onPress: () => {
// 					const newList = downloadingList.filter((_, i) => i !== index);
// 					setDownloadingList(newList);
// 				},
// 			},
// 		]);
// 	}
//
// 	const searchForBook = async (filename: string) => {
// 		const metadataResult = (await OpenLibraryService.search({title: filename, limit: 50}))["docs"];
// 		if (!metadataResult) throw new CustomException("Something went wrong while processing the file");
// 		setAllMetadata(metadataResult);
// 	}
//
// 	const triggerFilePicker = async () => {
// 		try {
// 			setLoadingFile(true);
// 			setProcessed(false);
// 			const result = await DocumentPicker.getDocumentAsync({
// 				type: ["application/pdf", "application/msword"],
// 				copyToCacheDirectory: true,
// 			});
// 			if (result?.type === "success") {
// 				const data = await handleFilePick(result);
// 				if (!data) throw new CustomException("Something went wrong while processing the file");
// 				setFile(data);
// 				const filename = data?.name?.split(".")[0] || "";
// 				await searchForBook(filename);
// 				setSearch(filename);
// 				if (!isOpen) onOpen();
// 			}
// 			setLoadingFile(false);
// 		}
// 		catch (e: any) {
// 			const msg = e instanceof CustomException ? e.message : "An error occurred";
// 			Alert.alert("Error", msg);
// 		}
// 	}
//
//
// 	return (
// 	  <FlatList
// 		data={downloadingList}
// 		renderItem={({item, index}) => <DownloadingCard key={index} item={item} index={index} onDelete={removeDownloadingItem}/>}
// 		keyExtractor={(item, index) => index.toString()}
// 		ListEmptyComponent={}
// 		px={4}
// 	  />
// 	)
// }

export function ContentAboveList({
	disclosure,
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

	const {isOpen, onClose} = disclosure;

	const resetStates = () => {
		setSearch("");
		setURL("");
		setLoadingFile(false);
		// setProcessed(false);
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
			loadingFile={loadingFile}
			allMetadata={allMetadata}
			currentMetadata={metadata}
			handleModalClose={handleModalClose}
			onMetadataSelect={onMetadataSelect}
		  />

		  <Box mt={4}>

		  </Box>
	  </>
	)
}