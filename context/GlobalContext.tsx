import {createContext, useEffect, useReducer} from "react";
import SettingsUtil from "../utils/settings.util";
import {GlobalReducer} from "./GlobalReducer";

export interface GlobalStateType {
	fontSize: number;
}

interface GlobalContextType {
	state: GlobalStateType;
	dispatch: any;
}

const GlobalContext = createContext<GlobalContextType>(null as any);

const GlobalContextProvider = ({children}: any) => {
	const initialState: GlobalStateType = {
		fontSize: 14,
	}

	const [reducerState, dispatch] = useReducer(GlobalReducer, initialState);

	const settingsUtil = new SettingsUtil(dispatch);
	useEffect(() => {
		(async () => await settingsUtil.loadSettings())();
	}, []);

	return (
	  <GlobalContext.Provider value={{
		  state: reducerState,
		  dispatch,
	  }}>
		  {children}
	  </GlobalContext.Provider>
	)
};

export {GlobalContext, GlobalContextProvider}