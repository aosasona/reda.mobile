import { useColorMode } from "native-base";
import React from "react";
import SafeAreaView, { ForceInsetProp } from "react-native-safe-area-view";
import { colors } from "../../config/theme";

interface CustomSafeAreaViewProps {
	children: React.ReactNode;
	forceInset?: ForceInsetProp;
}

export default function CustomSafeAreaView({ children, forceInset = { top: "always" } }: CustomSafeAreaViewProps) {

	const { colorMode } = useColorMode();

	return (
		<SafeAreaView forceInset={forceInset} style={{ flex: 1, backgroundColor: colorMode == "dark" ? colors.dark["900"] : colors.light["200"] }} >
			{children}
		</SafeAreaView>
	);
}
