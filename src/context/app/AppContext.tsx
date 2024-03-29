import { createContext, useEffect, useReducer } from "react";
import { default as App } from "./app";
import { AppReducer } from "./AppReducer";

export interface AppStateType {
	isSyncing: boolean;
	isSignedIn: boolean;
	useBiometrics: boolean;
}

interface AppContextType {
	state: AppStateType;
	dispatch: any;
}

const AppContext = createContext<AppContextType>(null as any);

const AppContextProvider = ({ children }: any) => {
	const initialState: AppStateType = {
		isSignedIn: false,
		isSyncing: false,
		useBiometrics: false,
	};

	const [state, dispatch] = useReducer(AppReducer, initialState);

	useEffect(() => {
		(async () => await (new App(dispatch)).load())();
	}, []);

	return (
		<AppContext.Provider value={{ state, dispatch }} >
			{children}
		</AppContext.Provider>
	);
};

export { AppContext, AppContextProvider };
