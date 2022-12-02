import {ColorMode} from "native-base";
import {getPrimaryColor, getSecondaryColor} from "../utils/color";

export const screenOptions = (colorMode: ColorMode) => ({
	headerShown: true,
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