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
