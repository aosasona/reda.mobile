import { NavigationProp } from "@react-navigation/native";

export interface ScreenProps {
	navigation: NavigationProp<any>;
	route: any;
}

export enum CategoryPageType {
	ALL = "All",
	STARRED = "Starred",
	CONTINUE_READING = "Continue reading",
}

export enum SupportedMimeTypes {
	PDF = "application/pdf",
	EPUB = "application/epub+zip",
}

export enum SupportedFileExtensions {
	PDF = "pdf",
	EPUB = "epub",
}
