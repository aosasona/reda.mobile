import { AppStateType } from "./AppContext";

export enum AppActionType {
	TOGGLE_IS_SYNCING = 1,
	TOGGLE_IS_SIGNED_IN,
	LOAD_LOCAL_AUTH_STATUS,
}

export interface AppDispatchAction {
	type: AppActionType;
	payload?: any;
}

export const AppReducer = (
	state: AppStateType,
	action: AppDispatchAction
): AppStateType => {
	switch (action.type) {
		case AppActionType.TOGGLE_IS_SYNCING:
			return {
				...state,
				isSyncing: !state.isSyncing,
			};
		case AppActionType.TOGGLE_IS_SIGNED_IN:
			return {
				...state,
				isSignedIn: !state.isSignedIn,
			};
		case AppActionType.LOAD_LOCAL_AUTH_STATUS:
			return {
				...state,
				hasPassword: true,
				hasBiometrics: true,
			};
		default:
			return state;
	}
};