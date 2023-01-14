import {extendTheme} from "native-base";
import {FontFamilies, FontFamiliesEnum, FontWeights} from "../constants/fonts";
import {isAndroid} from "../utils/misc.util";

export const colors = {
	primary: "#006ee6",
	"brand-dark": "#000000",
	"brand-light": "#EEEEEE",
	"brand-faded-dark": "#0D0D0D",
	brand: {
		light: "#EEEEEE",
		primary: "#FFD369",
		dark: "#393E46",
		"dark-brand": "#222831",
		darker: "#000000",
		faded: "#A9A9A9",
		"faded-dark": "#A9A9A955",
	},
	muted: {
		900: "#202020",
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
			_dark: {bg: colors.brand.darker},
			_light: {bg: colors.brand.light},
			px: 4,
		}),
	},
	SectionList: {
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