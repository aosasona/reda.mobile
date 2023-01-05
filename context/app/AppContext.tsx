import {createContext, useEffect, useReducer} from "react";
import App from "./app";
import {AppReducer} from "./AppReducer";

export interface AppStateType {
	isSyncing: boolean;
	isSignedIn: boolean;
}

interface AppContextType {
	state: AppStateType;
	dispatch: any;
}

const AppContext = createContext<AppContextType>(null as any);

const AppContextProvider = ({children}: any) => {
	const initialState: AppStateType = {
		isSignedIn: false,
		isSyncing: false,
	};

	const [reducerState, dispatch] = useReducer(AppReducer, initialState);

	useEffect(() => {
		(new App(dispatch)).load().then();
	}, []);

	return (
	  <AppContext.Provider
		value={{
			state: reducerState,
			dispatch,
		}}
	  >
		  {children}
	  </AppContext.Provider>
	);
};

export {AppContext, AppContextProvider};