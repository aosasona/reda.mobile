export const FontSizes = [
	10, 12, 14, 16, 18, 20, 24,
]

export enum FontFamiliesEnum {
	POPPINS = "Poppins",
	OUTFIT = "Outfit",
	INTER = "Inter",
	AZERET_MONO = "Azeret Mono",
}

export const FontFamilies = [FontFamiliesEnum.INTER, FontFamiliesEnum.OUTFIT, FontFamiliesEnum.POPPINS, FontFamiliesEnum.AZERET_MONO];

export const FontWeights: { [x: string]: string } = {
	"100": "Thin",
	"200": "ExtraLight",
	"300": "Light",
	"400": "Regular",
	"500": "Medium",
	"600": "SemiBold",
	"700": "Bold",
	"800": "ExtraBold",
	"900": "Black",
}