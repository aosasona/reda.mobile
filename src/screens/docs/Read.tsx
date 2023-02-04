import { Box, Pressable, Text, useColorMode, View } from "native-base";
import { useEffect, useState } from "react";
import { Alert, useWindowDimensions } from "react-native";
import Reader from "../../components/reader/Reader";
import { RedaService } from "../../services/local";
import { CombinedFileResultType } from "../../types/database";
import { ScreenProps } from "../../types/general";

export default function Read({ route, navigation }: ScreenProps) {
	const { data: initialData } = route.params;
	const { height } = useWindowDimensions();

	if (!initialData) {
		navigation.goBack();
	}

	const [data, setData] = useState<CombinedFileResultType>(initialData);
	const [pageData, setPageData] = useState<{ current: number; total: number }>({
		current: 1,
		total: 1,
	});

	useEffect(() => {
		navigation.setOptions({ title: data?.name || "Read" });
	}, []);

	const onError = (err: any) => {
		Alert.alert("Something went wrong!");
		navigation.goBack();
	};

	const onLoadComplete = async (totalNumberOfPages: number) => {
		await RedaService.updateTotalPagesOnLoad(data?.id, totalNumberOfPages);
		setPageData((prev) => ({ ...prev, total: totalNumberOfPages }));
	};

	const onPageChange = async (page: number) => {
		await RedaService.saveCurrentPage(data?.id, page);
		setPageData((prev) => ({ ...prev, current: page }));
	};

	const source = { uri: data.path };
	const { colorMode } = useColorMode();

	return (
		<View
			height={height}
			flex={1}
			justifyContent="flex-start"
			alignItems="center"
			_dark={{ bg: "dark.900" }}
			px={0}
		>
			<Reader
				page={pageData.current}
				data={data}
				source={source}
				colorMode={colorMode}
				onPageChange={onPageChange}
				onLoad={onLoadComplete}
				onError={onError}
			/>
		</View>
	);
}
