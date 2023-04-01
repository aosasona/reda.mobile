import { MenuAction } from "@react-native-menu/menu";
import { NavigationProp } from "@react-navigation/native";
import { Platform } from "react-native";
import { colors } from "../../config/theme";
import screens from "../../constants/screens";
import { deleteFile } from "../../services/local/file";
import { CombinedFileResultType } from "../../types/database";
import { shareFile } from "../file/ops";

export enum MenuEvents {
	DELETE = "delete",
	READ = "read",
	SHARE = "share",
}

export const getActions = (data: CombinedFileResultType): MenuAction[] => [
	{
		id: MenuEvents.READ,
		title: data?.has_started ? "Continue" : "Start reading",
		titleColor: colors.primary,
	},
	{
		id: MenuEvents.SHARE,
		title: "Share",
		titleColor: colors.primary,
		image: Platform.select({ ios: "square.and.arrow.up", android: "ic_menu_share" }),
	},
	{
		id: MenuEvents.DELETE,
		title: "Delete",
		attributes: { destructive: true },
		image: Platform.select({ ios: "trash", android: "ic_menu_delete" }),
	},
];

export const handleMenuEvent = async (
	event: string,
	data: CombinedFileResultType,
	navigation: NavigationProp<any>,
) => {
	event = event as MenuEvents;
	switch (event) {
		case MenuEvents.READ:
			return navigation.navigate(screens.READ_DOCUMENT.screenName, { data });
		case MenuEvents.SHARE:
			return await shareFile(data.path);
		case MenuEvents.DELETE:
			return await deleteFile(data?.id, navigation);
	}
};
