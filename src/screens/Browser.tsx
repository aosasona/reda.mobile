import { Fragment } from "react";
import { WebView } from "react-native-webview";
import CustomSafeAreaView from "../components/custom/CustomSafeAreaView";
import { ScreenProps } from "../types/general";
import { isAndroid } from "../utils/misc.util";

export default function BrowserPage({ route, navigation }: ScreenProps) {
  const { uri } = route.params;

  const Wrapper = isAndroid ? CustomSafeAreaView : Fragment;
  return (
    <Wrapper>
      <WebView
        source={{ uri }}
        automaticallyAdjustContentInsets
        pullToRefreshEnabled
        style={{ flex: 1 }}
      />
    </Wrapper>
  );
}
