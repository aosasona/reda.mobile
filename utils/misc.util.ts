import {Toast} from "native-base";

export const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "success") => {
	Toast.show({
		description: message,
		minW: "90%",
		placement: "top",
		color: `${type}.400`,
		backgroundColor: `${type}.600`,
		rounded: 8,
		paddingX: 5,
		paddingY: 4,
		avoidKeyboard: true,
		variant: "subtle",
		_title: {
			fontSize: 14,
		},
		_description: {
			fontSize: 16,
			noOfLines: 1,
		},
	})
}

export const getThumbnail = (image: string | null | undefined) => {
	const defaultThumb = require("../assets/default-book.jpg");
	const thumb = !!image ? {uri: image} : defaultThumb;
	return {thumb, fallback: defaultThumb};
}