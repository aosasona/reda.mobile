import { DocumentResult } from "expo-document-picker";
import { SQLResultSet } from "expo-sqlite";
import { DEFAULT_REDA_DIRECTORY } from "../../constants/file";
import CustomException from "../../exceptions/CustomException";
import { File } from "../../types/file";
import { executeQuery } from "../database/core";
import { copyToFolder, deleteFileFromFS } from "./ops";
import { extractFileNameFromUri } from "./process";

export async function handleFileCleanup(url: string | undefined): Promise<void> {
	if (!url) return;
	const res = (await executeQuery(`SELECT COUNT(*) as count FROM files WHERE path = ?`, [url],)) as SQLResultSet;

	const count = res?.rows?._array[0]?.count || 0;

	if (count > 0) return;

	await deleteFileFromFS(DEFAULT_REDA_DIRECTORY + url);
};


export async function handleFilePick(data: DocumentResult): Promise<File | null> {
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
