import {ColorMode} from "native-base";
import {getPrimaryColor, getSecondaryColor} from "../utils/color.util";
import {colors} from "./theme";


export const iconOptions = (colorMode: ColorMode, focused: boolean) => {
	return focused ? getSecondaryColor(colorMode) : colorMode == "dark" ? colors.brand["faded-dark"] : colors.brand.faded
}


export const screenOptions = (colorMode: ColorMode) => ({
	tabBarHideOnKeyboard: true,
	tabBarActiveTintColor: getSecondaryColor(colorMode),
	tabBarInactiveTintColor: colorMode == "dark" ? colors.brand["faded-dark"] : colors.brand.faded,
	headerShown: false,
	headerTintColor: getSecondaryColor(colorMode),
	headerTitleStyle: {
		fontSize: 20,
	},
	headerStyle: {
		backgroundColor: getPrimaryColor(colorMode),
		shadowColor: "transparent",
	},
	tabBarStyle: {
		backgroundColor: getPrimaryColor(colorMode),
		borderTopWidth: 0,
	},
});

const tabConfig = {
	screenOptions,
}

export default tabConfig;