import * as LocalAuthentication from "expo-local-authentication";
import { Keys } from "../../constants/keys";
import CustomException from "../../exceptions/CustomException";
import { useBiometrics } from "../../lib/security/biometrics";
import defaultStorage from "../../storage/default";
import { AppActionType, AppDispatchAction } from "./AppReducer";

export default class AppUtil {
	private readonly dispatch: (event: AppDispatchAction) => any;

	constructor(dispatch: any) {
		this.dispatch = dispatch;
	}

	async load() {
		const useBioValue = useBiometrics();
		return this.dispatch({
			type: AppActionType.LOAD_INITIAL_CONTEXT,
			payload: { useBiometrics: useBioValue },
		});
	};

	async toggleBiometrics(value: boolean) {
		try {
			defaultStorage.set(Keys.USE_BIOMETRICS, value);
			return this.dispatch({ type: AppActionType.TOGGLE_USE_BIOMETRICS, payload: value });
		}
		catch (e) { }
	};

	async unlockWithBiometrics() {
		try {
			const attemptedUnlock = await LocalAuthentication.authenticateAsync({ promptMessage: "Unlock to open Reda", });
			if (!attemptedUnlock.success) throw new CustomException("Failed to unlock!");
			this.dispatch({ type: AppActionType.TOGGLE_IS_SIGNED_IN });
		}
		catch (err) { }
	};
}
