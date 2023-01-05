import { View } from "native-base";
import { WebView } from "react-native-webview";
import CustomSafeAreaView from "../components/reusables/CustomSafeAreaView";
import { ScreenProps } from "../types/general";

export default function BrowserPage({ route, navigation }: ScreenProps) {
  const { uri } = route.params;

  return (
    <CustomSafeAreaView>
      <View flex={1}>
        <WebView source={{ uri }} />
      </View>
    </CustomSafeAreaView>
  );
}
