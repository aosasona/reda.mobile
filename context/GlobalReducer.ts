import {GlobalStateType} from "./GlobalContext";

export enum GlobalActionType {
	SET_FONT_SIZE = 'SET_FONT_SIZE',
}

interface GlobalAction {
	type: GlobalActionType;
	payload: any;
}

export const GlobalReducer = (state: GlobalStateType, action: GlobalAction) => {
	switch (action.type) {
		case GlobalActionType.SET_FONT_SIZE:
			return {
				...state,
				fontSize: action.payload,
			}
		default:
			return state
	}

}