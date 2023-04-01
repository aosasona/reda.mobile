import { Keys } from "../../constants/keys";
import defaultStorage from "../../storage/default";
import { SettingsStateType } from "./SettingsContext";

export enum SettingsActionType {
	SET_FONT_SIZE = 1,
	SET_SINGLE_PAGE_LAYOUT_OPTION,
	TOGGLE_ALLOW_NOTIFICATIONS,
	RESET_SETTINGS,
	LOAD_SETTINGS,
}

export interface SettingsDispatchAction {
	type: SettingsActionType;
	payload?: any;
}

export const SettingsReducer = (
	state: SettingsStateType,
	action: SettingsDispatchAction
): SettingsStateType => {
	switch (action.type) {
		case SettingsActionType.RESET_SETTINGS:
			defaultStorage.clearAll();
			return { useSinglePageLayout: false, allowNotifications: false };

		case SettingsActionType.LOAD_SETTINGS:
			return {
				...state,
				useSinglePageLayout: action?.payload?.useSinglePageLayout,
				allowNotifications: action?.payload?.allowNotifications,
			};

		case SettingsActionType.SET_SINGLE_PAGE_LAYOUT_OPTION:
			defaultStorage.set(Keys.SINGLE_PAGE_LAYOUT, action?.payload);
			return { ...state, useSinglePageLayout: action?.payload };

		case SettingsActionType.TOGGLE_ALLOW_NOTIFICATIONS:
			return { ...state, allowNotifications: !state.allowNotifications };

		default:
			return state;
	}
};
