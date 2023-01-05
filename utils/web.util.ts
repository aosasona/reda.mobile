import { NavigationProp } from "@react-navigation/native";
import screens from "../constants/screens";

export default class WebUtil {
  public static openBrowserPage = async (
    navigation: NavigationProp<any>,
    uri: string
  ) => {
    return navigation.navigate(screens.BROWSER.screenName, { uri });
  };
}
