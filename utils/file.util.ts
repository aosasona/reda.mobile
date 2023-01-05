import { DocumentResult } from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { SQLResultSet } from "expo-sqlite";
import CustomException from "../exceptions/CustomException";
import { executeQuery } from "./database.util";

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

// this will check all files in the database vs all files in the storage and delete the records where the files don't exist
export const removeMissingFileRecords = async () => {
	const dbPaths = await executeQuery("SELECT id, path FROM files");
	console.log(dbPaths);
};

// this will check for new files that haven't been added to the database
export const addNewFilesToDB = async () => { };

export const syncStorageToDB = async () => {
	await removeMissingFileRecords();
	await addNewFilesToDB();
};

export const migrateLegacyDB = async (currentName: string) => {
	try {
		const legacyPath = `${DEFAULT_REDA_DIRECTORY}/SQLite/reda.db`;
		const currentPath = `${DEFAULT_REDA_DIRECTORY}/SQLite/${currentName}`;

		const { exists } = await FileSystem.getInfoAsync(
			DEFAULT_REDA_DIRECTORY + "/SQLite/reda.db"
		);
		if (!exists) return;
		await FileSystem.moveAsync({
			from: legacyPath,
			to: currentPath,
		});
	} catch (err) { }
};

export const extractFileName = (
	rawName: string,
	options: ExtractFileOptions = { isURI: false }
) => {
	if (options.isURI) {
		rawName = extractFileNameFromUri(rawName);
	}
	const split = rawName.split(".");
	const fileName = split[0]?.length > 0 ? split[0] : "Unknown file" || rawName;
	return fileName?.replace(/[^\w\s]/gi, " ") || fileName;
};

export const extractFileNameFromUri = (uri: string) => {
	const split = uri.split("/");
	return split[split.length - 1];
};

export const processFileName = (filename: string, max: number = 3) => {
	const slimFileNameArray = (filename || "")?.split(/[\s-_]/);
	return slimFileNameArray
		?.slice(
			0,
			slimFileNameArray?.length >= max ? max : slimFileNameArray.length
		)
		?.join(" ");
};

export const createFolder = async (name: string) => {
	const path = DEFAULT_REDA_DIRECTORY + name;
	const { exists } = await FileSystem.getInfoAsync(path);
	if (!exists) {
		await FileSystem.makeDirectoryAsync(path, { intermediates: true });
	}
};

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
};

export const deleteFile = async (uri: string) => {
	await FileSystem.deleteAsync(uri);
};

export const deleteAll = async () => {
	const path = DEFAULT_REDA_DIRECTORY;
	const files = await FileSystem.readDirectoryAsync(path);
	if (files.length > 0) {
		for (let file of files) {
			if (file == "SQLite") continue;
			await deleteFile(path + "/" + file);
		}
	}
};

export const handleFileCleanup = async (url: string | undefined) => {
	if (!url) return;
	const res = (await executeQuery(
		`SELECT COUNT(*) as count
       FROM files
       WHERE path = ?`,
		[url]
	)) as SQLResultSet;

	const count = res?.rows?._array[0]?.count || 0;

	if (count > 0) return;

	await deleteFile(DEFAULT_REDA_DIRECTORY + url);
};

export const handleFilePick = async (
	data: DocumentResult
): Promise<File | null> => {
	if (data.type !== "success") return null;
	const uri = data?.uri;
	if (!uri) throw new CustomException("No file selected");
	const newUri = await copyToFolder(uri as string);
	const newFileName = extractFileNameFromUri(newUri);
	return {
		name: data.name,
		uri: newFileName,
		rawUri: uri,
		size: data.size as number,
		mimeType: data.type,
	};
};
