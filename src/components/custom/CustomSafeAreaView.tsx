import { useColorMode } from "native-base";
import React from "react";
import SafeAreaView from "react-native-safe-area-view";
import { colors } from "../../config/theme";

interface CustomSafeAreaViewProps {
	children: React.ReactNode;
}

export default function CustomSafeAreaView({
	children,
}: CustomSafeAreaViewProps) {

	const { colorMode } = useColorMode();

	return (
		<SafeAreaView forceInset={{ top: "always" }} style={{ flex: 1, backgroundColor: colorMode == "dark" ? colors.dark["900"] : colors.light["200"] }} >
			{children}
		</SafeAreaView>
	);
}
