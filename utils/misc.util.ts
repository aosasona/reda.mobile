import {Toast} from "native-base";

export const showToast = (message: string, type: "success" | "error" | "warning" = "success") => {
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
		},
	})
}