import { ExtractFileOptions } from "../../types/file";

export function extractFileName(rawName: string, options: ExtractFileOptions = { isURI: false }): string {
  if (options.isURI) {
    rawName = extractFileNameFromUri(rawName);
  }
  const split = rawName.split(".");
  const fileName = split[0]?.length > 0 ? split[0] : "Unknown file" || rawName;
  return fileName?.replace(/[^\w\s]/gi, " ") || fileName;
};


export function extractFileNameFromUri(uri: string): string {
  const split = uri.split("/");
  return split[split.length - 1];
};


export function processFileName(filename: string, max: number = 3) {
  const slimFileNameArray = (filename || "")?.split(/[\s-_]/);
  return slimFileNameArray?.slice(0, slimFileNameArray?.length >= max ? max : slimFileNameArray.length)?.join(" ");
};
