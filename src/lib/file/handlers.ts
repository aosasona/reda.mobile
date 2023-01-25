import {DocumentResult} from "expo-document-picker";
import {SQLResultSet} from "expo-sqlite";
import {DEFAULT_REDA_DIRECTORY} from "../../constants/file";
import CustomException from "../../exceptions/CustomException";
import {File} from "../../types/file";
import {executeQuery} from "../database/core";
import {copyToFolder, deleteFile} from "./ops";
import {extractFileNameFromUri} from "./process";

export const handleFileCleanup = async (url: string | undefined) => {
	if (!url) return;
	const res = (await executeQuery(
	  `SELECT COUNT(*) as count
       FROM files
       WHERE path = ?`,
	  [url],
	)) as SQLResultSet;

	const count = res?.rows?._array[0]?.count || 0;

	if (count > 0) return;

	await deleteFile(DEFAULT_REDA_DIRECTORY + url);
};
export const handleFilePick = async (
  data: DocumentResult,
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