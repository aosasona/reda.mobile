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
import ImportUtil from "../utils/import .util";
import {showToast} from "../utils/misc.util";

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

	const importUtil = new ImportUtil(setMixedState)


	const resetState = importUtil.resetState
	const loadAllMeta = importUtil.loadAllMeta
	const meta = {setAll: importUtil.setAllMeta, setCurrent: importUtil.setCurrentMeta}

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


	const handleRemoteImport = async () => {
		try {
			showToast("Coming soon", "info");
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
			const msg = e instanceof CustomException ? e.message : "An error occurred";
			Alert.alert("Error", msg);
		}
		finally {
			setMixedState(prevState => ({...prevState, loading: {...prevState.loading, meta: false, local: false}}));
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