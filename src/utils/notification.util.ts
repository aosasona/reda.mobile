import * as Burnt from "burnt";
import {isAndroid} from "./misc.util";

export const showToast = (
  title: string,
  message: string,
  toastType: "done" | "error" = "done",
) => {
	Burnt.toast({
		title: isAndroid ? message : title,
		message,
		preset: toastType,
		haptic: toastType === "done" ? "success" : "error",
		duration: 3,
	});
};

export const seekPermission = async () => {

}