import {Dispatch, SetStateAction} from "react";
import {File} from "../utils/file.util";

export interface ImportStatesProps {
	file: File | null;
	URL: string;
	downloadingList: DownloadingListState[] | [];
	loading: {
		local: boolean;
		remote: boolean;
	}
}

export type StateSetter = Dispatch<SetStateAction<ImportStatesProps>>;

export interface DownloadingListProps {
	state: ImportStatesProps;
	setState: StateSetter;
	HeaderComponent: JSX.Element;
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