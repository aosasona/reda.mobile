import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorMode } from "native-base";
import { navigationConfig } from "../config/screens";
import screens from "../constants/screens";
import FolderContent from "../screens/folders/FolderContent";
import FoldersScreen from "../screens/folders/Folders";

const Stack = createNativeStackNavigator();

export default function FolderStack() {
	const { colorMode } = useColorMode();
	return (
		<Stack.Navigator initialRouteName={screens.FOLDERS.screenName} {...navigationConfig(colorMode)}>
			<Stack.Screen name={screens.FOLDERS.screenName} component={FoldersScreen} options={{ headerTitle: "", headerShown: true }} />
			<Stack.Screen name={screens.FOLDERCONTENT.screenName} component={FolderContent} options={{ headerTitle: "", headerShown: true, headerBackVisible: true }} />
		</Stack.Navigator>
	);
}
