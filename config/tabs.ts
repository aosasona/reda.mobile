import {ColorMode} from "native-base";
import {Platform} from "react-native";
import {getPrimaryColor, getSecondaryColor} from "../utils/color";
import {colors} from "./theme";

const isAndroid = Platform.OS === "android";

// export const generalOptions = {
// 	headerShown: true,
// 	headerStyle: {
// 		height: isAndroid ? 80 : 100,
// 		backgroundColor: colors.brand.dark,
// 		shadowColor: "transparent",
// 	},
// 	tabBarLabelStyle: {},
// 	tabBarActiveTintColor: colors.brand.light,
// 	tabBarInactiveTintColor: colors.brand.light,
// 	tabBarHideOnKeyboard: true,
// } as any


export const iconOptions = (colorMode: ColorMode, focused: boolean) => {
	return focused ? getSecondaryColor(colorMode) : colors.brand.faded
}


export const screenOptions = (colorMode: ColorMode) => ({
	tabBarHideOnKeyboard: true,
	tabBarActiveTintColor: getSecondaryColor(colorMode),
	tabBarInactiveTintColor: colors.brand.faded,
	headerIconColor: getSecondaryColor(colorMode),
	headerStyle: {
		backgroundColor: getPrimaryColor(colorMode),
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