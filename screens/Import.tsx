import * as DocumentPicker from "expo-document-picker";
import {useDisclose} from "native-base";
import {useContext, useState} from "react";
import {Alert} from "react-native";
import DownloadingList from "../components/DownloadingList";
import ImportHeader from "../components/ImportHeader";
import MetaModal from "../components/MetaModal";
import {GlobalContext} from "../context/GlobalContext";
import CustomException from "../exceptions/CustomException";
import {ImportStatesProps} from "../types/import";
import {handlePossibleNull} from "../utils/exception.util";
import {deleteFile, extractFileName, File, handleFilePick} from "../utils/file.util";
import {OpenLibraryService} from "../utils/request.util";

// Todo: implement resume-able downloads

export default function Import() {

	const {isOpen, onOpen, onClose} = useDisclose();

	const {state: globalState} = useContext(GlobalContext)


	const [mixedState, setMixedState] = useState<ImportStatesProps>({
		file: null,
		URL: "",
		search: "",
		step: 0,
		downloadingList: [],
		meta: {
			all: [],
			current: null,
			currentIndex: 0,
		},
		loading: {
			local: false,
			remote: false,
			meta: false,
		},
	})


	const resetState = () => {
		setMixedState({
			file: null,
			URL: "",
			search: "",
			step: 0,
			downloadingList: [],
			meta: {
				all: [],
				current: null,
				currentIndex: 0,
			},
			loading: {
				local: false,
				remote: false,
				meta: false,
			},
		})
	}

	const meta = {
		setAll: (value: any[]) => setMixedState((prevState) => ({
			...prevState,
			meta: {
				...prevState.meta,
				all: value,
			},
		})),
		setCurrent: (value: any, index: number) => setMixedState((prevState) => ({
			...prevState,
			meta: {
				...prevState.meta,
				current: value,
				currentIndex: index,
			},
		})),
	}

	const handleModalDismiss = () => {
		resetState();
		if (globalState.deleteFilesAfterImport && mixedState?.file?.rawUri) {
			deleteFile(mixedState?.file?.rawUri as string).then(() => setMixedState(prevState => ({...prevState, file: null})))
			  .catch(() => {
				  Alert.alert("Error", "An error occurred.")
			  });
		}
		onClose();
	}

	const loadAllMeta = async (fileName: string) => {
		setMixedState(prevState => ({...prevState, loading: {...prevState.loading, meta: true}}));
		const onlineMetadata = (await OpenLibraryService.search({title: fileName, limit: 50}))["docs"];
		meta.setAll(onlineMetadata);
		setMixedState(prevState => ({...prevState, loading: {...prevState.loading, meta: false, local: false}}));
	}

	const handleRemoteImport = async () => {
		try {
			// if (!mixedState.URL) return
			// if (!mixedState.URL.endsWith(".pdf")) throw new CustomException("The URL must end with .pdf")
			// const fileName = extractFileName(mixedState.URL, {isURI: true});
			// const target = `${DEFAULT_REDA_DIRECTORY}/${fileName}.pdf`;
			// setMixedState(prevState => ({...prevState, loading: {...prevState.loading, remote: true}}));
			// const {uri} = await FileSystem.downloadAsync(mixedState.URL, target);
			// const processedFile = await handleFilePick({
			// 	uri,
			// 	name: extractFileName(mixedState.URL),
			// 	type: "success",
			// 	mimeType: "application/pdf",
			// });
			// handlePossibleNull(processedFile, "File could not be processed");
			// const fileName = extractFileName(processedFile?.name as string);
			// setMixedState(prevState => ({...prevState, search: fileName, file: processedFile}));
			// await loadAllMeta(fileName);
			// !isOpen && onOpen();
		}
		catch (e) {
			console.log(e);
			const msg = e instanceof CustomException ? e.message : "An error occurred";
			Alert.alert("Error", msg);
		}
		finally {
			setMixedState(prevState => ({...prevState, loading: {...prevState.loading, meta: false}}));
		}
	}

	const handleLocalImport = async () => {
		try {
			setMixedState(prevState => ({...prevState, loading: {...prevState.loading, local: true}}));
			const result = await DocumentPicker.getDocumentAsync({
				type: ["application/pdf", "application/msword"],
				copyToCacheDirectory: true,
			});
			if (result.type === "success") {
				const processedFile = await handleFilePick(result);
				handlePossibleNull(processedFile, "File could not be processed");
				const fileName = extractFileName(processedFile?.name as string);
				setMixedState(prevState => ({...prevState, search: fileName, file: processedFile}));
				await loadAllMeta(fileName);
				!isOpen && onOpen();
			}
		}
		catch (e) {
			console.log(e);
			const msg = e instanceof CustomException ? e.message : "An error occurred";
			Alert.alert("Error", msg);
		}
		finally {
			setMixedState(prevState => ({...prevState, loading: {...prevState.loading, meta: false}}));
		}
	}

	return (
	  <>
		  <DownloadingList
			state={mixedState}
			setState={setMixedState}
			reset={resetState}
			HeaderComponent={<ImportHeader
			  state={mixedState}
			  setState={setMixedState}
			  callbacks={{handleLocalImport, handleRemoteImport}}
			/>}
		  />
		  <MetaModal
			state={{
				isOpen,
				step: mixedState.step,
				search: mixedState.search,
				file: mixedState.file as File,
				meta: mixedState.meta,
				loading: mixedState.loading,
			}}
			functions={{
				setState: setMixedState,
				handleCurrentMetaChange: meta.setCurrent,
				handleModalDismiss,
				loadAllMeta,
			}}
		  />
	  </>
	)
}