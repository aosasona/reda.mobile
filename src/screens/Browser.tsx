import { Flex } from "native-base";
import { Fragment } from "react";
import { ActivityIndicator, useWindowDimensions } from "react-native";
import { WebView } from "react-native-webview";
import CustomSafeAreaView from "../components/custom/CustomSafeAreaView";
import { ViewProps } from "../config/props";
import { colors } from "../config/theme";
import { isAndroid } from "../constants/core";
import { showToast } from "../lib/notification";
import { ScreenProps } from "../types/general";

export default function BrowserPage({ route }: ScreenProps) {
	const { uri } = route.params;

	const Wrapper = isAndroid ? CustomSafeAreaView : Fragment;
	return (
		<Wrapper>
			<WebView
				source={{ uri }}
				automaticallyAdjustContentInsets
				pullToRefreshEnabled
				renderLoading={() => <LoadingAnim />}
				onError={() => showToast("Error", "Something went wrong")}
				useWebView2={true}
				style={{ flex: 1 }}
			/>
		</Wrapper>
	);
}

function LoadingAnim() {
	const { height, width } = useWindowDimensions();
	return (
		<Flex flex={1} height={height} width={width} justifyContent="center" alignItems="center" {...ViewProps}>
			<ActivityIndicator color={colors.primary} />
		</Flex>
	);
}
