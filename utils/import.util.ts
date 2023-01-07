import { Alert } from "react-native";
import CustomException from "../exceptions/CustomException";
import { OpenLibraryService } from "../services/cloud";
import { FileModel, MetadataModel, SQLBoolean } from "../types/database";
import { CompleteInAppFlowArgs, StateSetter } from "../types/import";
import { saveFile } from "./database.util";
import { showToast, validateURL } from "./misc.util";
import * as FileSystem from "expo-file-system";
import { DEFAULT_REDA_DIRECTORY, extractFileNameFromUri } from "./file.util";

export default class ImportUtil {
	private readonly setState: StateSetter;

	constructor(setState: StateSetter) {
		this.setState = setState;
	}

	public loadAllMeta = async (fileName: string) => {
		try {
			this.setState((prevState) => ({
				...prevState,
				loading: { ...prevState.loading, meta: true },
			}));
			const onlineMetadata = (
				await OpenLibraryService.search({ title: fileName, limit: 50 })
			)["docs"];
			this.setAllMeta(onlineMetadata);
		} catch (err) {
		} finally {
			this.setState((prevState) => ({
				...prevState,
				loading: { ...prevState.loading, meta: false, local: false },
			}));
		}
	};

	public setAllMeta = (value: any[]) =>
		this.setState((prevState) => ({
			...prevState,
			meta: {
				...prevState.meta,
				all: value,
			},
		}));

	public setCurrentMeta = (value: any, index: number) =>
		this.setState((prevState) => ({
			...prevState,
			meta: {
				...prevState.meta,
				current: value,
				currentIndex: index,
			},
		}));

	public resetState = () => {
		this.setState({
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
	};

	public saveRemoteImport = async (url: string) => {
		const { msg } = validateURL(url);
		if (msg) throw new CustomException(msg);
		const rawFileName = extractFileNameFromUri(url);
		const decodedFileName = decodeURIComponent(rawFileName) || rawFileName;
		const filePath = DEFAULT_REDA_DIRECTORY + rawFileName;
		const { exists } = await FileSystem.getInfoAsync(filePath);
		if (exists) throw new CustomException("Oops, file already exists!");
		const result = await FileSystem.downloadAsync(url, filePath);
		const data = await FileSystem.getInfoAsync(result?.uri);
		await this.completeInAppImport({
			data: null,
			file: {
				name: decodedFileName,
				uri: rawFileName,
				size: data.size || 1000000,
				mimeType: result.mimeType || "application/pdf",
			},
			metadata: null,
			img: null,
			setSaving: (val) => { },
			handleModalDismiss: () => { },
		});
	};

	public completeInAppImport = async ({
		file,
		data,
		img,
		metadata,
		setSaving,
		handleModalDismiss,
	}: CompleteInAppFlowArgs) => {
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
			};
			const meta: MetadataModel = {
				image: img || "",
				description: data?.subtitle || data?.description || "No description.",
				author: data?.author_name[0] || "Unknown author",
				raw: JSON.stringify(data),
				table_of_contents: JSON.stringify(
					metadata?.data?.table_of_contents || []
				),
				subjects:
					data?.subject_facet?.join(", ") ||
					metadata?.data?.subjects?.join(", ") ||
					"",
				first_publish_year:
					data?.first_publish_year ||
					metadata?.data?.first_publish_year ||
					data?.publish_year?.[0] ||
					0,
				book_key: data?.edition_key?.[0] || "",
				chapters: metadata?.data?.table_of_contents?.length || 1,
				current_page: 1,
				total_pages:
					metadata?.data?.number_of_pages || data?.number_of_pages_median || 1,
			};
			const res = await saveFile(file_data, meta);
			if (res) {
				showToast("File imported successfully.");
			} else {
				showToast("An error occurred while saving file.", "error");
			}
			handleModalDismiss();
		} catch (e) {
			Alert.alert("Error", "An error occurred!");
		} finally {
			setSaving(false);
		}
	};
}
