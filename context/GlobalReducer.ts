import {ConfigKeys} from "../constants/config";
import {FontFamiliesEnum} from "../constants/fonts";
import {clearAsyncStorage, setAsyncStorage} from "../utils/storage.util";
import {GlobalStateType} from "./GlobalContext";

export enum GlobalActionType {
	SET_FONT_SIZE = 'SET_FONT_SIZE',
	RESET_SETTINGS = 'RESET_SETTINGS',
	LOAD_SETTINGS = 'LOAD_SETTINGS',
	SET_FONT_FAMILY = 'SET_FONT_FAMILY',
}

export interface GlobalAction {
	type: GlobalActionType;
	payload?: any;
}

export const GlobalReducer = (state: GlobalStateType, action: GlobalAction): GlobalStateType => {
	switch (action.type) {
		case GlobalActionType.SET_FONT_SIZE:
			(async () => await setAsyncStorage(ConfigKeys.FONT_SIZE, action?.payload?.toString()))()
			return {
				...state,
				fontSize: action.payload,
			}
		case GlobalActionType.RESET_SETTINGS:
			clearAsyncStorage()
			  .then(() => ({...state, startingApp: true, fontSize: 16})).catch((error) => ({state}))
			break
		case GlobalActionType.LOAD_SETTINGS:
			return {
				...state,
				fontSize: action?.payload?.fontSize || 16,
				fontFamily: action?.payload?.fontFamily || FontFamiliesEnum.OUTFIT,
			}
		case GlobalActionType.SET_FONT_FAMILY:
			(async () => await setAsyncStorage(ConfigKeys.FONT_FAMILY, action?.payload))()
			return {
				...state,
				fontFamily: action?.payload,
			}
		default:
			return state
	}

	return state
}