import * as WebBrowser from "expo-web-browser";

export default class WebUtil {
  public static openWebBrowser = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };
}
