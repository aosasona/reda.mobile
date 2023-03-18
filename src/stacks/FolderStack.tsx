import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorMode } from "native-base";
import { navigationConfig } from "../config/screens";
import screens from "../constants/screens";
import FoldersScreen from "../screens/folders/Folders";
import ImportScreen from "../screens/Import";

const Stack = createNativeStackNavigator();

export default function FolderStack() {
	const { colorMode } = useColorMode();
	return (
		<Stack.Navigator {...navigationConfig(colorMode)}>
			<Stack.Screen
				name={screens.FOLDERS.screenName}
				component={FoldersScreen}
				options={{
					headerTitle: screens.FOLDERS.screenTitle,
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
}
