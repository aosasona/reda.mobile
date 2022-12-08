import {Dispatch, SetStateAction} from "react";
import {File} from "../utils/file.util";

export enum MetaModalSteps {
	ONE,
	TWO,
}

export type StateSetter = Dispatch<SetStateAction<ImportStatesProps>>;

export interface ImportHeaderProps {
	state: ImportStatesProps;
	setState: (value: ImportStatesProps) => void;
	callbacks: {
		handleRemoteImport: () => void;
		handleLocalImport: () => void;
	}
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
		currentIndex?: number;
	};
	loading: {
		local: boolean;
		remote: boolean;
		meta: boolean;
	}
}

export interface MetaModalProps {
	functions: {
		setState: StateSetter;
		handleCurrentMetaChange: (value: any, index: number) => void;
		handleModalDismiss: () => void;
		toggleStep?: () => void;
		loadAllMeta: (fileName: string) => Promise<void>;
	};
	state: {
		isOpen: boolean;
		step: MetaModalSteps;
		search: string;
		file: File;
		meta: ImportStatesProps["meta"];
		loading: ImportStatesProps["loading"];
	}
}

export interface MetaPageProps {
	state: {
		data: any;
		file: File;
	};
	functions: {
		toggleStep: () => void;
		handleModalDismiss: () => void;
	}
}

export interface MetaCardProps {
	state: {
		data: any;
		index: number;
		meta: ImportStatesProps["meta"];
	};
	functions: {
		onPress: (item: any, index: number) => void;
	}
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