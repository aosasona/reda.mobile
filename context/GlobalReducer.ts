import { ConfigKeys } from "../constants/config";
import defaultStorage from "../storage/default";
import { GlobalStateType } from "./GlobalContext";

export enum GlobalActionType {
	SET_FONT_SIZE = "SET_FONT_SIZE",
	SET_SINGLE_PAGE_LAYOUT_OPTION = "SET_SINGLE_PAGE_LAYOUT_OPTION",
	RESET_SETTINGS = "RESET_SETTINGS",
	LOAD_SETTINGS = "LOAD_SETTINGS",
	SET_FONT_FAMILY = "SET_FONT_FAMILY",
	SET_DELETE_FILES_AFTER_IMPORT = "SET_DELETE_FILES_AFTER_IMPORT",
}

export interface GlobalAction {
	type: GlobalActionType;
	payload?: any;
}

export const GlobalReducer = (
	state: GlobalStateType,
	action: GlobalAction
): GlobalStateType => {
	switch (action.type) {
		case GlobalActionType.RESET_SETTINGS:
			defaultStorage.clearAll();
			return {
				useSinglePageLayout: false,
			};

		case GlobalActionType.LOAD_SETTINGS:
			return {
				...state,
				useSinglePageLayout: action?.payload?.useSinglePageLayout,
			};

		case GlobalActionType.SET_SINGLE_PAGE_LAYOUT_OPTION:
			defaultStorage.set(ConfigKeys.SINGLE_PAGE_LAYOUT, action?.payload);
			return {
				...state,
				useSinglePageLayout: action?.payload,
			};

		default:
			return state;
	}
};
