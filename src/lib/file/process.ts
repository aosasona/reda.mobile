import {ExtractFileOptions} from "../../types/file";

export const extractFileName = (
  rawName: string,
  options: ExtractFileOptions = {isURI: false},
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
		slimFileNameArray?.length >= max ? max : slimFileNameArray.length,
	  )
	  ?.join(" ");
};