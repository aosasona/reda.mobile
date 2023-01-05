import {AppDispatchAction} from "./AppReducer";

export default class Settings {
	private readonly dispatch: (event: AppDispatchAction) => any;

	constructor(dispatch: any) {
		this.dispatch = dispatch;
	}

	public load = async () => {}
}