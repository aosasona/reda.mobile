import {extendTheme} from "native-base";

export const colors = {
	"primary": "#FFD369",
	brand: {
		"light": "#EEEEEE",
		"primary": "#FFD369",
		"dark": "#393E46",
		"dark-brand": "#222831",
		"darker": "#0F0F0F",
		"faded": "#A9A9A9",
		"faded-dark": "#A9A9A955",
	},
}
export const fontsConfig = {
	Poppins: {
		100: {
			normal: "Poppins_100Thin",
			italic: "Poppins_100Thin_Italic",
		},
		200: {
			normal: "Poppins_200ExtraLight",
			italic: "Poppins_200ExtraLight_Italic",
		},
		300: {
			normal: "Poppins_300Light",
			italic: "Poppins_300Light_Italic",
		},
		400: {
			normal: "Poppins_400Regular",
			italic: "Poppins_400Regular_Italic",
		},
		500: {
			normal: "Poppins_500Medium",
			italic: "Poppins_500Medium_Italic",
		},
		600: {
			normal: "Poppins_600SemiBold",
			italic: "Poppins_600SemiBold_Italic",
		},
		700: {
			normal: "Poppins_700Bold",
			italic: "Poppins_700Bold_Italic",
		},
		800: {
			normal: "Poppins_800ExtraBold",
			italic: "Poppins_800ExtraBold_Italic",
		},
		900: {
			normal: "Poppins_900Black",
			italic: "Poppins_900Black_Italic",
		},
	},
}

export const fonts = {
	heading: "Poppins",
	body: "Poppins",
	mono: "Poppins",
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