import {createContext, useEffect, useReducer} from "react";
import Settings from "./settings";
import {SettingsReducer} from "./SettingsReducer";

export interface SettingsStateType {
	useSinglePageLayout: boolean;
}

interface SettingsContextType {
	state: SettingsStateType;
	dispatch: any;
}

const SettingsContext = createContext<SettingsContextType>(null as any);

const SettingsContextProvider = ({children}: any) => {
	const initialState: SettingsStateType = {
		useSinglePageLayout: true,
	};

	const [reducerState, dispatch] = useReducer(SettingsReducer, initialState);

	useEffect(() => {
		(new Settings(dispatch)).load().then();
	}, []);

	return (
	  <SettingsContext.Provider
		value={{
			state: reducerState,
			dispatch,
		}}
	  >
		  {children}
	  </SettingsContext.Provider>
	);
};

export {SettingsContext, SettingsContextProvider};