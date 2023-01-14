import {WebView} from "react-native-webview";
import CustomSafeAreaView from "../components/reusables/custom/CustomSafeAreaView";
import {ScreenProps} from "../types/general";

export default function BrowserPage({route, navigation}: ScreenProps) {
	const {uri} = route.params;

	return (
	  <CustomSafeAreaView>
		  <WebView
			source={{uri}}
			automaticallyAdjustContentInsets
			pullToRefreshEnabled
			style={{flex: 1}}
		  />
	  </CustomSafeAreaView>
	);
}