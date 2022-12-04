import {extendTheme} from "native-base";
import {FontFamilies, FontFamiliesEnum, FontWeights} from "../constants/fonts";

export const colors = {
	"primary": "#FFD369",
	brand: {
		"light": "#EEEEEE",
		"primary": "#FFD369",
		"dark": "#393E46",
		"dark-brand": "#222831",
		"darker": "#060606",
		"faded": "#A9A9A9",
		"faded-dark": "#A9A9A955",
	},
	muted: {
		900: "#101010",
	},
}


const fontsConfig = FontFamilies.map(fontFamily => ({
	[fontFamily]: Object.keys(FontWeights).map((weight) => ({
		[weight]: {
			normal: `${fontFamily}_${weight}${FontWeights[weight]}`,
		},
	})).reduce((acc, curr) => ({...acc, ...curr}), {}),
})).reduce((acc, curr) => ({...acc, ...curr}), {});


export const fonts = {
	heading: FontFamiliesEnum.OUTFIT,
	body: FontFamiliesEnum.OUTFIT,
	mono: FontFamiliesEnum.OUTFIT,
}

export const componentsConfig = {
	ScrollView: {
		baseStyle: (props: any) => ({
			_dark: {bg: colors.brand.darker},
			_light: {bg: colors.brand.light},
			px: 4,
		}),
	},
	FlatList: {
		baseStyle: (props: any) => ({
			_dark: {bg: colors.brand.darker},
			_light: {bg: colors.brand.light},
			px: 4,
		}),
	},
	VStack: {
		baseStyle: (props: any) => ({
			_light: {bg: "muted.200"},
			_dark: {bg: "muted.900"},
		}),
	},
}

export const extendedTheme = extendTheme({
	colors: colors,
	fontConfig: fontsConfig,
	fonts: fonts,
	components: componentsConfig,
	config: {
		initialColorMode: "dark",
		useSystemColorMode: true,
	},
})