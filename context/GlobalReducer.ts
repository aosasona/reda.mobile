import {ConfigKeys} from "../constants/config";
import {FontFamiliesEnum} from "../constants/fonts";
import {clearAsyncStorage, setAsyncStorage} from "../utils/storage.util";
import {GlobalStateType} from "./GlobalContext";

export enum GlobalActionType {
	SET_FONT_SIZE = 'SET_FONT_SIZE',
	RESET_SETTINGS = 'RESET_SETTINGS',
	LOAD_SETTINGS = 'LOAD_SETTINGS',
	SET_FONT_FAMILY = 'SET_FONT_FAMILY',
	SET_DELETE_FILES_AFTER_IMPORT = 'SET_DELETE_FILES_AFTER_IMPORT',
}

export interface GlobalAction {
	type: GlobalActionType;
	payload?: any;
}

export const GlobalReducer = (state: GlobalStateType, action: GlobalAction): GlobalStateType => {
	switch (action.type) {
		case GlobalActionType.RESET_SETTINGS:
			clearAsyncStorage()
			  .then(() => ({...state, fontSize: 16, fontFamily: FontFamiliesEnum.OUTFIT, deleteFilesAfterImport: true})).catch((error) => ({state}))
			break
		case GlobalActionType.LOAD_SETTINGS:
			return {
				...state,
				fontSize: action?.payload?.fontSize || "16",
				fontFamily: action?.payload?.fontFamily || FontFamiliesEnum.OUTFIT,
				deleteFilesAfterImport: action?.payload?.deleteFilesAfterImport || false,
			}
		case GlobalActionType.SET_FONT_SIZE:
			(async () => await setAsyncStorage(ConfigKeys.FONT_SIZE, action?.payload?.toString()))()
			return {
				...state,
				fontSize: action.payload,
			}
		case GlobalActionType.SET_FONT_FAMILY:
			(async () => await setAsyncStorage(ConfigKeys.FONT_FAMILY, action?.payload))()
			return {
				...state,
				fontFamily: action?.payload,
			}
		case GlobalActionType.SET_DELETE_FILES_AFTER_IMPORT:
			(async () => await setAsyncStorage(ConfigKeys.DELETE_FILES_AFTER_IMPORT, String(action?.payload)))()
			return {
				...state,
				deleteFilesAfterImport: action?.payload === 1,
			}
		default:
			return state
	}

	return state
}