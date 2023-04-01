import { AppStateType } from "./AppContext";

export enum AppActionType {
	LOAD_INITIAL_CONTEXT = 1,
	TOGGLE_IS_SYNCING,
	TOGGLE_IS_SIGNED_IN,
	TOGGLE_USE_BIOMETRICS,
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
		case AppActionType.LOAD_INITIAL_CONTEXT:
			return { ...state, ...action.payload, };

		case AppActionType.TOGGLE_IS_SYNCING:
			return { ...state, isSyncing: !state.isSyncing, };

		case AppActionType.TOGGLE_IS_SIGNED_IN:
			return { ...state, isSignedIn: !state.isSignedIn, };

		case AppActionType.TOGGLE_USE_BIOMETRICS:
			return { ...state, isSignedIn: true, useBiometrics: action.payload, };

		default:
			return state;
	}
};
