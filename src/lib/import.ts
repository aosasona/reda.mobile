import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { DEFAULT_REDA_DIRECTORY } from "../constants/file";
import screens from "../constants/screens";
import CustomException from "../exceptions/CustomException";
import { OpenLibraryService } from "../services/cloud";
import { LocalFileService } from "../services/local";
import {
	FileModel,
	FileType,
	MetadataModel,
	SQLBoolean,
} from "../types/database";
import {
	CompleteInAppFlowArgs,
	FileExtensions,
	MimeTypes,
	StateSetter,
} from "../types/import";
import { save } from "./database/file";
import { extractFileNameFromUri } from "./file/process";
import { generateRandomString } from "./misc";
import { sendNotification } from "./notification";
import { validateURL } from "./validate";

export default class Import {
	private readonly setState: StateSetter;
	private readonly supportedMimeTypes = ["application/pdf"];

	constructor(setState: StateSetter) {
		this.setState = setState;
	}

	loadAllMeta = async (fileName: string) => {
		try {
			this.setState((prevState) => ({ ...prevState, loading: { ...prevState.loading, meta: true } }));
			const onlineMetadata = (await OpenLibraryService.search({ title: fileName, limit: 50 }))["docs"];
			this.setAllMeta(onlineMetadata);
		} catch (err) {
		} finally {
			this.setState((prevState) => ({ ...prevState, loading: { ...prevState.loading, meta: false, local: false } }));
		}
	};

	setAllMeta(value: any[]) {
		this.setState((prevState) => ({ ...prevState, meta: { ...prevState.meta, all: value, } }));
	}

	setCurrentMeta(value: any, index: number) {
		this.setState((prevState) => ({ ...prevState, meta: { ...prevState.meta, current: value, currentIndex: index } }));
	}

	resetState = () => {
		this.setState({
			file: null,
			URL: "",
			search: "",
			step: 0,
			downloadingList: [],
			meta: { all: [], current: null, currentIndex: 0 },
			loading: { local: false, remote: false, meta: false },
		});
	};

	// This function tries to make sure the file has the right extension
	inferFileName(filename: string, mimeType: string) {
		const castMimeType = mimeType?.toLowerCase();
		if (this.supportedMimeTypes.includes(castMimeType) && !filename.endsWith(FileExtensions.PDF) && !filename.endsWith(FileExtensions.EPUB)) {
			if (castMimeType == (MimeTypes.PDF as string)) {
				filename = filename + ".pdf";
			}

			if (castMimeType == (MimeTypes.EPUB as string)) {
				filename = filename + ".epub";
			}
		}
		return filename;
	};

	async saveRemoteImport(url: string) {
		const { msg } = validateURL(url);
		if (msg) throw new CustomException(msg);
		let rawFileName = extractFileNameFromUri(url);
		let filetype = rawFileName?.split(".")?.pop() || "pdf";

		if (![FileType.PDF, FileType.EPUB].includes(filetype as FileType)) {
			filetype = FileType.PDF
			// throw new CustomException(`Invalid file type (${filetype})!`);
		}

		const generatedName = generateRandomString(6) + "_" + generateRandomString(16) + "." + filetype;
		const filePath = DEFAULT_REDA_DIRECTORY + generatedName;
		const { exists } = await FileSystem.getInfoAsync(filePath);
		if (exists) throw new CustomException("Oops, file already exists!");
		const result = await FileSystem.downloadAsync(url, filePath);
		const data = await FileSystem.getInfoAsync(result?.uri);

		await this.completeInAppImport({
			data: null,
			file: {
				name: generatedName,
				uri: generatedName,
				size: data.size || 0,
				mimeType: result?.mimeType || "application/pdf",
			},
			metadata: null,
			img: null,
			setSaving: (_) => null,
			handleModalDismiss: () => null,
		});
	};

	async completeInAppImport({ file, data, img, metadata, setSaving, handleModalDismiss }: CompleteInAppFlowArgs) {
		try {
			setSaving(true);
			const fileType = file?.name?.split(".")?.pop();

			const file_data: FileModel = {
				name: data?.title || file?.name?.split(".")[0],
				path: file?.uri,
				size: file?.size,
				file_type: fileType as FileType,
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
				table_of_contents: JSON.stringify(metadata?.data?.table_of_contents || []),
				subjects: data?.subject_facet?.join(", ") || metadata?.data?.subjects?.join(", ") || "",
				first_publish_year: data?.first_publish_year || metadata?.data?.first_publish_year || data?.publish_year?.[0] || 0,
				book_key: data?.edition_key?.[0] || "",
				chapters: metadata?.data?.table_of_contents?.length || 1,
				current_page: 1,
				total_pages: metadata?.data?.number_of_pages || data?.number_of_pages_median || 1,
			};
			const res = await save(file_data, meta);
			if (res) {
				const savedFile = await LocalFileService.getOne(res.id);
				await sendNotification("📚 Import complete", `${savedFile?.name} has been added to your library`, { route: screens.PREVIEW.screenName, data: savedFile });
			} else {
				await sendNotification("Error ☹️", "Failed to import item", { route: screens.IMPORT.screenName, data: null });
			}
			handleModalDismiss();
		} catch (e) {
			Alert.alert("Error", "An error occurred!");
		} finally {
			setSaving(false);
		}
	};
}
