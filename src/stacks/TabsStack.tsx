import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FolderStack from "./FolderStack";
import HomeStack from "./HomeStack";
import ImportStack from "./ImportStack";
import SettingsStack from "./SettingsStack";
import tabs from "../constants/tabs";
import { iconOptions, screenOptions } from "../config/tabs";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Icon, useColorMode } from "native-base";


const Tab = createBottomTabNavigator();
export default function TabsStack() {

  const { colorMode } = useColorMode();
  return (
    <Tab.Navigator initialRouteName={tabs.HOME} backBehavior="history">
      <Tab.Screen
        name={tabs.HOME}
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (<Icon as={AntDesign} name="home" size={6} color={iconOptions(colorMode, focused)} />),
          ...(screenOptions(colorMode) as any),
        }}
      />

      <Tab.Screen
        name={tabs.IMPORT}
        component={ImportStack}
        options={{
          tabBarIcon: ({ focused }) => (<Icon as={Feather} name="plus" size={6} color={iconOptions(colorMode, focused)} />),
          ...(screenOptions(colorMode) as any),
        }}
      />

      <Tab.Screen
        name={tabs.FOLDERS}
        component={FolderStack}
        options={{
          tabBarIcon: ({ focused }) => (<Icon as={Feather} name="folder" size={6} color={iconOptions(colorMode, focused)} />),
          ...(screenOptions(colorMode) as any),
        }}
      />

      <Tab.Screen
        name={tabs.SETTINGS}
        component={SettingsStack}
        options={{
          tabBarIcon: ({ focused }) => (<Icon as={Ionicons} name="settings-outline" size={6} color={iconOptions(colorMode, focused)} />),
          ...(screenOptions(colorMode) as any),
        }}
      />
    </Tab.Navigator>
  )
}
