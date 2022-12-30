import { Toast } from "native-base";
import PdfThumbnail from "react-native-pdf-thumbnail";

export const showToast = (
	message: string,
	type: "success" | "error" | "warning" | "info" = "success"
) => {
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
	});
};

export const getThumbnail = async (
	image: string | null | undefined,
	path: string | null = null
): Promise<{ thumb: any; fallback: any }> => {
	let defaultThumb = require("../assets/default-book.jpg");
	if (path) {
		try {
			const { uri } = await PdfThumbnail.generate(path, 0);
			defaultThumb = uri;
		} catch (e) { }
	}
	const thumb = !!image && isNaN(parseInt(image)) ? image : defaultThumb;
	return { thumb, fallback: defaultThumb };
};

export const byteToMB = (bytes: number) => {
	return (bytes / 1024 / 1024)?.toFixed(2) + " MB";
};
