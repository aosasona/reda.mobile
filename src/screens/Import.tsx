import * as DocumentPicker from "expo-document-picker";
import { Box, useDisclose } from "native-base";
import { useState } from "react";
import { Alert, Keyboard } from "react-native";
import CustomSafeAreaView from "../components/custom/CustomSafeAreaView";
import MetaModal from "../components/meta/MetaModal";
import ImportHeader from "../components/page/import/ImportHeader";
import { ViewProps } from "../config/props";
import CustomException from "../exceptions/CustomException";
import { handlePossibleNull } from "../exceptions/handlers";
import { handleFileCleanup, handleFilePick } from "../lib/file/handlers";
import { extractFileName, processFileName } from "../lib/file/process";
import Import from "../lib/import";
import { File } from "../types/file";
import { ImportStatesProps } from "../types/import";

export default function ImportScreen() {
	const { isOpen, onOpen, onClose } = useDisclose();

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
	});

	const importUtil = new Import(setMixedState);

	const resetState = importUtil.resetState;
	const loadAllMeta = importUtil.loadAllMeta;

	const handleMetaSelection = (value: any, index: number) => {
		if (mixedState.meta?.currentIndex !== null && mixedState.meta?.currentIndex === index) {
			setMixedState({ ...mixedState, meta: { ...mixedState.meta, currentIndex: null, current: null } });
			return;
		}
		importUtil.setCurrentMeta(value, index);
	};

	const handleModalDismiss = () => {
		resetState();
		onClose();
		handleFileCleanup(mixedState.file?.uri).then().catch();
	};

	const handleRemoteImport = async () => {
		try {
			if (!mixedState.URL) return;
			setMixedState((prev) => ({ ...prev, loading: { ...prev.loading, remote: true } }));
			Keyboard.dismiss();
			await importUtil.saveRemoteImport(mixedState.URL);
			setMixedState((prev) => ({ ...prev, URL: "" }));
		} catch (e) {
			const msg = e instanceof CustomException ? e.message : "An error occurred";
			Alert.alert("Error", msg);
		} finally {
			setMixedState((prev) => ({ ...prev, loading: { ...prev.loading, remote: false } }));
		}
	};

	const handleLocalImport = async () => {
		try {
			setMixedState((prevState) => ({ ...prevState, loading: { ...prevState.loading, local: true } }));

			const result = await DocumentPicker.getDocumentAsync({
				type: ["application/pdf", "application/epub+zip"],
				copyToCacheDirectory: true,
			});

			if (result.type === "success") {
				const processedFile = await handleFilePick(result);
				handlePossibleNull(processedFile, "Unable to process file!");
				const fileName = extractFileName(processedFile?.name as string);
				const slimFileName = processFileName(fileName, 5);

				setMixedState((prevState) => ({ ...prevState, search: slimFileName, file: processedFile }));

				await loadAllMeta(slimFileName);
				!isOpen && onOpen();
			}
		} catch (e) {
			console.log(e)
			const msg = e instanceof CustomException ? e.message : "An error occurred";
			Alert.alert("Error", msg);
		} finally {
			setMixedState((prevState) => ({ ...prevState, loading: { ...prevState.loading, meta: false, local: false } }));
		}
	};

	return (
		<CustomSafeAreaView>
			<Box flex={1} {...ViewProps}>
				<ImportHeader state={mixedState} setState={setMixedState} callbacks={{ handleLocalImport, handleRemoteImport }} />
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
						handleComplete: importUtil.completeInAppImport,
					}}
				/>
			</Box>
		</CustomSafeAreaView>
	);
}
