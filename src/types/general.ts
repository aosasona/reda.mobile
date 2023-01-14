import { NavigationProp } from "@react-navigation/native";

export interface ScreenProps {
	navigation: NavigationProp<any>;
	route: any;
}

export enum CategoryPageType {
	ALL = "All",
	STARRED = "Starred",
	CONTINUE_READING = "Continue reading",
}
