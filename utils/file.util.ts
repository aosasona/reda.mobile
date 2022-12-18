import { DocumentResult } from "expo-document-picker";
import * as FileSystem from 'expo-file-system';
import { Alert } from "react-native";
import { FolderNames } from "../constants/config";
import CustomException from "../exceptions/CustomException";
import { CombinedFileResultType, SQLBoolean } from "../types/database";
import { update } from "./database.util";
import { RedaService } from "./internal.util";

export interface File {
	name: string;
	uri: string;
	rawUri?: string;
	size: number;
	mimeType: string;
}

export interface ExtractFileOptions {
	isURI: boolean;
}

export const DEFAULT_REDA_DIRECTORY = FileSystem.documentDirectory as string;

export const extractFileName = (rawName: string, options: ExtractFileOptions = { isURI: false }) => {
	if (options.isURI) {
		rawName = extractFileNameFromUri(rawName);
	}
	const split = rawName.split(".");
	return split[0] || rawName;
}

export const extractFileNameFromUri = (uri: string) => {
	const split = uri.split("/");
	return split[split.length - 1];
}

export const createFolder = async (name: string) => {
	const path = FileSystem.documentDirectory + name;
	const { exists } = await FileSystem.getInfoAsync(path);
	if (!exists) {
		await FileSystem.makeDirectoryAsync(path, { intermediates: true });
	}
}

export const copyToFolder = async (uri: string) => {
	const path = DEFAULT_REDA_DIRECTORY;
	const { exists } = await FileSystem.getInfoAsync(path);
	if (!exists) {
		await FileSystem.makeDirectoryAsync(path, { intermediates: true });
	}
	const newPath = path + uri.split("/").pop();
	await FileSystem.copyAsync({
		from: uri,
		to: newPath,
	});
	return newPath;
}

export const deleteFile = async (uri: string) => {
	await FileSystem.deleteAsync(uri);
}

export const deleteAll = async () => {
	const path = DEFAULT_REDA_DIRECTORY
	const files = await FileSystem.readDirectoryAsync(path)
	if (files.length > 0) {
		for (let file of files) {
			if (file == "SQLite") continue;
			await deleteFile(path + "/" + file)
		}
	}
}

export const handleFilePick = async (data: DocumentResult): Promise<File | null> => {
	if (data.type !== "success") return null;
	const uri = data?.uri;
	if (!uri) throw new CustomException("No file selected");
	const newUri = await copyToFolder((uri as string));
	return {
		name: data.name,
		uri: newUri,
		rawUri: uri,
		size: data.size as number,
		mimeType: data.type,
	};
}

export const updateTotalPagesOnLoad = async (id: number, totalPageNumber: number) => {
	try {
		const file = await RedaService.getOne(id)
		if (!file) return
		if (file.total_pages == totalPageNumber) return
		await update({ table: "metadata", identifier: "file_id" },
			id,
			{ total_pages: totalPageNumber })
	} catch (err) {
		Alert.alert("Error", "Something went wrong! Close the app and try again.")
	}
}

export const saveCurrentPage = async (id: number, currentPageNumber: number) => {
	try {
		const file = await RedaService.getOne(id)
		if (!file) return
		if (file.current_page > file.total_pages || file.current_page > currentPageNumber || file?.has_finished == 1) return
		if (!file.has_started && currentPageNumber > 1) {
			await update({ table: "files", identifier: "id" },
				id,
				{ has_started: SQLBoolean.TRUE })
		}
		await update({ table: "metadata", identifier: "file_id" },
			id,
			{ current_page: currentPageNumber })
	} catch (err: unknown) {
		Alert.alert("Error", "Something went wrong. Close app and try again.")
	}
}
