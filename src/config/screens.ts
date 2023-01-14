import {ColorMode} from "native-base";
import {getPrimaryColor, getSecondaryColor} from "../utils/color.util";

export const screenOptions = (colorMode: ColorMode) => ({
	headerShown: true,
	headerShadowVisible: false,
	headerTintColor: getSecondaryColor(colorMode),
	headerTitleStyle: {
		fontSize: 16,
	},
	headerStyle: {
		backgroundColor: getPrimaryColor(colorMode),
		shadowColor: "transparent",
	},
})

export const navigationConfig = (colorMode: ColorMode) => ({
	screenOptions: screenOptions(colorMode),
})