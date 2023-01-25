import {extendTheme} from "native-base";
import {isAndroid} from "../constants/core";
import {FontFamilies, FontFamiliesEnum, FontWeights} from "../constants/fonts";

export const colors = {
	primary: "#006ee6",
	dark: {
		50: "#E3E3E3",
		300: "#A9A9A9",
		500: "#424242",
		600: "#2A2A2A",
		700: "#171717",
		800: "#0D0D0D",
		900: "#000000",
	},
	light: {
		50: "#FFFFFF",
		100: "#F2F2F2",
		200: "#EEEEEE",
		300: "#E0E0E0",
		400: "#BDBDBD",
		500: "#9E9E9E",
		600: "#757575",
		700: "#616161",
		800: "#424242",
		900: "#212121",
	},
};

const fontsConfig = FontFamilies.map((fontFamily) => ({
	[fontFamily]: Object.keys(FontWeights)
	  .map((weight) => ({
		  [weight]: {
			  normal: `${fontFamily}_${weight}${FontWeights[weight]}`,
		  },
	  }))
	  .reduce((acc, curr) => ({...acc, ...curr}), {}),
})).reduce((acc, curr) => ({...acc, ...curr}), {});

export const fonts = {
	heading: FontFamiliesEnum.OUTFIT,
	body: FontFamiliesEnum.OUTFIT,
	mono: FontFamiliesEnum.OUTFIT,
};

export const componentsConfig = {
	ScrollView: {
		baseStyle: (props: any) => ({
			_dark: {bg: colors.dark["900"]},
			_light: {bg: colors.light["200"]},
			px: 4,
		}),
	},
	SectionList: {
		baseStyle: (props: any) => ({
			_dark: {bg: colors.dark["900"]},
			_light: {bg: colors.light["200"]},
			px: 4,
		}),
	},
	FlatList: {
		baseStyle: (props: any) => ({
			_dark: {bg: colors.dark["900"]},
			_light: {bg: colors.light["200"]},
			px: 4,
		}),
	},
	Switch: {
		defaultProps: {
			onTrackColor: colors.primary,
			size: isAndroid ? "lg" : "md",
		},
	},
};

export const extendedTheme = extendTheme({
	colors: colors,
	fontConfig: fontsConfig,
	fonts: fonts,
	components: componentsConfig,
	config: {
		initialColorMode: "dark",
		useSystemColorMode: true,
	},
});