import { createContext, useEffect, useReducer } from "react";
import SettingsUtil from "../utils/settings.util";
import { GlobalReducer } from "./GlobalReducer";

export interface GlobalStateType {
	useSinglePageLayout: boolean;
}

interface GlobalContextType {
	state: GlobalStateType;
	dispatch: any;
}

const GlobalContext = createContext<GlobalContextType>(null as any);

const GlobalContextProvider = ({ children }: any) => {
	const initialState: GlobalStateType = {
		useSinglePageLayout: true,
	};

	const [reducerState, dispatch] = useReducer(GlobalReducer, initialState);

	const settingsUtil = new SettingsUtil(dispatch);
	useEffect(() => {
		settingsUtil.loadSettings();
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				state: reducerState,
				dispatch,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

export { GlobalContext, GlobalContextProvider };
