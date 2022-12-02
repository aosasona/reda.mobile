import {ConfigKeys} from "../constants/config";
import {clearAsyncStorage, setAsyncStorage} from "../utils/storage.util";
import {GlobalStateType} from "./GlobalContext";

export enum GlobalActionType {
	SET_FONT_SIZE = 'SET_FONT_SIZE',
	RESET_SETTINGS = 'RESET_SETTINGS',
	LOAD_SETTINGS = 'LOAD_SETTINGS',
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
			}
		default:
			return state
	}

	return state
}