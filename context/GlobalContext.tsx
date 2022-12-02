import {createContext, useReducer} from "react";
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

	const reducer = (state: GlobalStateType, action: any) => {}

	const [reducerState, dispatch] = useReducer(GlobalReducer, initialState);
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