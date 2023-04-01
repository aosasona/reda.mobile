import { Dispatch, SetStateAction } from "react";
import { File } from "./file";

export enum MetaModalSteps {
	ONE,
	TWO,
}

export enum MimeTypes {
	PDF = "application/pdf",
	EPUB = "application/epub+zip",
}

export enum FileExtensions {
	PDF = ".pdf",
	EPUB = ".epub",
}

export type StateSetter = Dispatch<SetStateAction<ImportStatesProps>>;

export interface ImportHeaderProps {
	state: ImportStatesProps;
	setState: (value: ImportStatesProps) => void;
	callbacks: {
		handleRemoteImport: () => void;
		handleLocalImport: () => void;
	};
}

export interface ImportStatesProps {
	file: File | null;
	URL: string;
	search: string;
	step: MetaModalSteps;
	downloadingList: DownloadingListState[] | [];
	meta?: {
		all?: any[];
		current?: any;
		currentIndex?: number | null;
	};
	loading: {
		local: boolean;
		remote: boolean;
		meta: boolean;
	};
}

export interface MetaModalProps {
	functions: {
		setState: StateSetter;
		toggleStep?: () => void;
		loadAllMeta: (fileName: string) => Promise<void>;
		handleCurrentMetaChange: (value: any, index: number) => void;
		handleComplete: (args: CompleteInAppFlowArgs) => Promise<void>;
		handleModalDismiss: () => void;
	};
	state: {
		isOpen: boolean;
		step: MetaModalSteps;
		search: string;
		file: File;
		meta: ImportStatesProps["meta"];
		loading: ImportStatesProps["loading"];
	};
}

export interface MetaPageProps {
	state: {
		data: any;
		file: File;
	};
	functions: {
		toggleStep: () => void;
		handleModalDismiss: () => void;
		handleComplete: (args: CompleteInAppFlowArgs) => Promise<void>;
	};
}

export interface MetaCardProps {
	state: {
		data: any;
		index: number;
		meta: ImportStatesProps["meta"];
	};
	functions: {
		onPress: (item: any, index: number) => void;
	};
}

export interface DownloadingListProps {
	state: ImportStatesProps;
	setState: StateSetter;
	HeaderComponent: JSX.Element;
	reset: () => void;
}

export interface DownloadingListState {
	name: string;
	progress: number;
}

export interface DownloadingCardProps {
	item: DownloadingListState;
	index: number;
	onDelete: (index: number) => void;
}

export interface CompleteInAppFlowArgs {
	data: any;
	file: File;
	img: string | null | undefined;
	metadata: any;
	setSaving: (value: boolean) => void;
	handleModalDismiss: () => void;
}
