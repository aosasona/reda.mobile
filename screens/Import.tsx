import * as DocumentPicker from "expo-document-picker";
import { useDisclose } from "native-base";
import { useContext, useState } from "react";
import { Alert } from "react-native";
import DownloadingList from "../components/DownloadingList";
import ImportHeader from "../components/ImportHeader";
import MetaModal from "../components/MetaModal";
import { GlobalContext } from "../context/GlobalContext";
import CustomException from "../exceptions/CustomException";
import { ImportStatesProps } from "../types/import";
import { handlePossibleNull } from "../utils/exception.util";
import { extractFileName, File, handleFilePick } from "../utils/file.util";
import ImportUtil from "../utils/import .util";
import { showToast } from "../utils/misc.util";

// Todo: implement resume-able downloads

export default function Import() {

	const { isOpen, onOpen, onClose } = useDisclose();

	const { state: globalState } = useContext(GlobalContext)


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

	const handleMetaSelection = (value: any, index: number) => {
		if (mixedState.meta?.currentIndex !== null && mixedState.meta?.currentIndex === index) {
			setMixedState({ ...mixedState, meta: { ...mixedState.meta, currentIndex: null, current: null } })
			return;
		}
		importUtil.setCurrentMeta(value, index)
	}

	const meta = { setAll: importUtil.setAllMeta, setCurrent: importUtil.setCurrentMeta }

	const handleModalDismiss = () => {
		resetState();
		onClose();
	}


	const handleRemoteImport = async () => {
		try {
			showToast("Coming soon", "info");
			if (!mixedState.URL) return
			if (!mixedState.URL?.endsWith(".pdf")) throw new CustomException("The URL must end with .pdf")
		}
		catch (e) {
			console.log(e);
			const msg = e instanceof CustomException ? e.message : "An error occurred";
			Alert.alert("Error", msg);
		}
		finally {
			setMixedState(prevState => ({ ...prevState, loading: { ...prevState.loading, meta: false } }));
		}
	}

	const handleLocalImport = async () => {
		try {
			setMixedState(prevState => ({ ...prevState, loading: { ...prevState.loading, local: true } }));
			const result = await DocumentPicker.getDocumentAsync({
				type: ["application/pdf", "application/msword"],
				copyToCacheDirectory: true,
			});
			if (result.type === "success") {
				const processedFile = await handleFilePick(result);
				handlePossibleNull(processedFile, "File could not be processed");
				const fileName = extractFileName(processedFile?.name as string);
				setMixedState(prevState => ({ ...prevState, search: fileName, file: processedFile }));
				await loadAllMeta(fileName);
				!isOpen && onOpen();
			}
		}
		catch (e) {
			const msg = e instanceof CustomException ? e.message : "An error occurred";
			Alert.alert("Error", msg);
		}
		finally {
			setMixedState(prevState => ({ ...prevState, loading: { ...prevState.loading, meta: false, local: false } }));
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
					callbacks={{ handleLocalImport, handleRemoteImport }}
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
					handleCurrentMetaChange: handleMetaSelection,
					handleModalDismiss,
					loadAllMeta,
				}}
			/>
		</>
	)
}
