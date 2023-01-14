import {Keys} from "../../constants/keys";
import defaultStorage from "../../storage/default";
import {SettingsStateType} from "./SettingsContext";

export enum SettingsActionType {
	SET_FONT_SIZE = 1,
	SET_SINGLE_PAGE_LAYOUT_OPTION,
	RESET_SETTINGS,
	LOAD_SETTINGS,
	SET_FONT_FAMILY,
	SET_DELETE_FILES_AFTER_IMPORT,
}

export interface SettingsDispatchAction {
	type: SettingsActionType;
	payload?: any;
}

export const SettingsReducer = (
  state: SettingsStateType,
  action: SettingsDispatchAction,
): SettingsStateType => {
	switch (action.type) {
		case SettingsActionType.RESET_SETTINGS:
			defaultStorage.clearAll();
			return {
				useSinglePageLayout: false,
			};

		case SettingsActionType.LOAD_SETTINGS:
			return {
				...state,
				useSinglePageLayout: action?.payload?.useSinglePageLayout,
			};

		case SettingsActionType.SET_SINGLE_PAGE_LAYOUT_OPTION:
			defaultStorage.set(Keys.SINGLE_PAGE_LAYOUT, action?.payload);
			return {
				...state,
				useSinglePageLayout: action?.payload,
			};

		default:
			return state;
	}
};