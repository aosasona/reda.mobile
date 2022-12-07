import {Toast} from "native-base";

export const showToast = (message: string, type: "success" | "error" | "warning" = "success") => {
	Toast.show({})
}