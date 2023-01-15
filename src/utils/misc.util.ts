import {Platform} from "expo-modules-core";
import PdfThumbnail from "react-native-pdf-thumbnail";
import * as yup from "yup";

export const isAndroid = Platform.OS === "android";

export const validateURL = (
  url: string,
): { valid: boolean; msg: string | null } => {
	try {
		const schema = yup.object().shape({
			url: yup.string().url().required().min(3),
		});

		const valid = schema.isValidSync({url});
		if (valid) {
			return {valid, msg: null};
		}
		return {valid: false, msg: "Invalid URL"};
	}
	catch (err: any) {
		return {valid: false, msg: err?.message};
	}
};

export const filterSupportedFiles = (files: string[]) => {
	const allowedExts = ["pdf"];
	return files.filter((file) =>
	  allowedExts.includes(file?.split(".")?.pop() || ""),
	);
};

export const generateRandomString = (length: number) => {
	const chars =
	  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let result = "";
	for (let i = length; i > 0; --i)
		result += chars[Math.floor(Math.random() * chars.length)];
	return result;
};

export const getThumbnail = async (
  image: string | null | undefined,
  path: string | null = null,
): Promise<{ thumb: any; fallback: any }> => {
	let defaultThumb = require("../../assets/default-book.jpg");
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

export const byteToMB = (bytes: number) => {
	return (bytes / 1024 / 1024)?.toFixed(2) + " MB";
};