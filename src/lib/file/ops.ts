import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {Alert} from "react-native";
import PdfThumbnail from "react-native-pdf-thumbnail";
import {DEFAULT_REDA_DIRECTORY} from "../../constants/file";

export const copyToFolder = async (uri: string) => {
	const path = DEFAULT_REDA_DIRECTORY;
	const {exists} = await FileSystem.getInfoAsync(path);
	if (!exists) {
		await FileSystem.makeDirectoryAsync(path, {intermediates: true});
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
export const filterSupportedFiles = (files: string[]) => {
	const allowedExts = ["pdf"];
	return files.filter((file) =>
	  allowedExts.includes(file?.split(".")?.pop() || ""),
	);
};
export const loadThumbnail = async (
  image: string | null | undefined,
  path: string | null = null,
): Promise<{ thumb: any; fallback: any }> => {
	let defaultThumb = require("../../../assets/default-book.jpg");
	if (path) {
		try {
			const {uri} = await PdfThumbnail.generate(path, 0);
			defaultThumb = uri;
		}
		catch (e) {
		}
	}
	const thumb = !!image && isNaN(parseInt(image)) ? image : defaultThumb;
	return {thumb, fallback: defaultThumb};
};
export const deleteAll = async () => {
	const path = DEFAULT_REDA_DIRECTORY;
	const allFiles = await FileSystem.readDirectoryAsync(path);
	if (allFiles.length > 0) {
		const files = filterSupportedFiles(allFiles);
		for (let file of files) {
			const fullPath = `${path}${encodeURIComponent(file)}`;
			await deleteFile(fullPath);
		}
	}
};
export const shareFile = async (file: string) => {
	try {
		const sharingIsAvailable = await Sharing.isAvailableAsync();
		if (!sharingIsAvailable) return;
		await Sharing.shareAsync(file);
	}
	catch (err) {
		Alert.alert("Error", "Something went wrong!");
	}
};