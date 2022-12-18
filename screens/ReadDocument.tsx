import { View, Text, ScrollView, Box, useColorMode } from "native-base";
import { useContext, useEffect, useState } from "react";
import { CombinedFileResultType } from "../types/database";
import { ScreenProps } from "../types/general";
import Pdf from "react-native-pdf";
import { Alert, Dimensions, useWindowDimensions } from "react-native";
import { saveCurrentPage, updateTotalPagesOnLoad } from "../utils/file.util";
import { GlobalContext } from "../context/GlobalContext";

export default function ReadDocument({ route, navigation }: ScreenProps) {
	const { state } = useContext(GlobalContext)
	const { data: initialData } = route.params;

	if (!initialData) {
		navigation.goBack();
	}

	const [data, setData] = useState<CombinedFileResultType>(initialData);
	const [pageData, setPageData] = useState<{ current: number, total: number }>({
		current: 1,
		total: 1
	})


	const { width, height } = Dimensions.get("window")

	useEffect(() => {
		navigation.setOptions({ title: data?.name || "Read Document" });
	}, [])

	const onError = (err: any) => {
		Alert.alert("Something went wrong!")
		navigation.goBack()
	}

	const onLoadComplete = async (totalNumberOfPages: number,
		path: string,
		dimension: { width: number, height: number },
		tableContents: any) => {
		await updateTotalPagesOnLoad(data?.id, totalNumberOfPages)
		setPageData(prev => ({ ...prev, total: totalNumberOfPages }))
	}

	const onPageChanged = async (page: number, totalNumberOfPages: number) => {
		await saveCurrentPage(data?.id, page)
		setPageData(prev => ({ ...prev, current: page }))
	}

	const source = { uri: data.path }
	const { colorMode } = useColorMode()
	const isDark = colorMode === "dark"

	return (
		<View height={height} flex={1} justifyContent="flex-start" alignItems="center" _dark={{ bg: "brand-dark" }} px={0}>
			<Pdf
				source={source}
				page={data?.current_page || 1}
				enablePaging={state.useSinglePageLayout}
				horizontal={state.useSinglePageLayout}
				enableAntialiasing={true}
				enableAnnotationRendering={true}
				onLoadComplete={onLoadComplete}
				onPageChanged={onPageChanged}
				onError={onError}
				style={{ flex: 1, width, height, backgroundColor: isDark ? "#000000" : "#F5F5F5" }}
			/>
			<Box
				position="absolute"
				top={2}
				right={2}
				_dark={{ bg: "muted.900" }}
				_light={{ bg: "muted.100" }}
				shadow={2}
				rounded={6}
				px={2}
				py={1}>
				<Text opacity={0.5}>{pageData.current} of {pageData.total}</Text>
			</Box>
		</View>
	)
}
