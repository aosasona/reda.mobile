import { Box, Text, useColorMode, View } from "native-base";
import { useContext, useEffect, useState } from "react";
import { Alert, Dimensions } from "react-native";
import Pdf from "react-native-pdf";
import { colors } from "../config/theme";
import { SettingsContext } from "../context/settings/SettingsContext";
import { RedaService } from "../services/local";
import { CombinedFileResultType } from "../types/database";
import { ScreenProps } from "../types/general";

export default function ReadDocument({ route, navigation }: ScreenProps) {
	const { state } = useContext(SettingsContext);
	const { data: initialData } = route.params;

	if (!initialData) {
		navigation.goBack();
	}

	const [data, setData] = useState<CombinedFileResultType>(initialData);
	const [pageData, setPageData] = useState<{ current: number; total: number }>({
		current: 1,
		total: 1,
	});

	const { width, height } = Dimensions.get("window");

	useEffect(() => {
		navigation.setOptions({ title: data?.name || "Read Document" });
	}, []);

	const onError = (err: any) => {
		Alert.alert("Something went wrong!");
		navigation.goBack();
	};

	const onLoadComplete = async (
		totalNumberOfPages: number,
		path: string,
		dimension: { width: number; height: number },
		tableContents: any
	) => {
		await RedaService.updateTotalPagesOnLoad(data?.id, totalNumberOfPages);
		setPageData((prev) => ({ ...prev, total: totalNumberOfPages }));
	};

	const onPageChanged = async (page: number, _: any) => {
		await RedaService.saveCurrentPage(data?.id, page);
		setPageData((prev) => ({ ...prev, current: page }));
	};

	const source = { uri: data.path };
	const { colorMode } = useColorMode();
	const isDark = colorMode === "dark";

	return (
		<View
			height={height}
			flex={1}
			justifyContent="flex-start"
			alignItems="center"
			_dark={{ bg: "dark.900" }}
			px={0}
		>
			<Pdf
				source={source}
				page={data?.current_page || 1}
				enablePaging={state.useSinglePageLayout}
				horizontal={state.useSinglePageLayout}
				enableAntialiasing={true}
				enableAnnotationRendering={false}
				onLoadComplete={onLoadComplete}
				onPageChanged={onPageChanged}
				onError={onError}
				style={{
					flex: 1,
					width,
					height,
					backgroundColor: isDark ? colors.dark["900"] : colors.light["200"],
				}}
			/>
			<Box
				position="absolute"
				top={2}
				right={2}
				_dark={{ bg: "dark.700" }}
				_light={{ bg: "muted.100" }}
				shadow={2}
				rounded={6}
				px={2}
				py={1}
			>
				<Text opacity={0.5}>
					{pageData.current} of {pageData.total}
				</Text>
			</Box>
		</View>
	);
}
