import { View, Text, ScrollView } from "native-base";
import { useEffect, useState } from "react";
import { CombinedFileResultType } from "../types/database";
import { ScreenProps } from "../types/general";
import Pdf from "react-native-pdf";
import { Alert, useWindowDimensions } from "react-native";
import { saveCurrentPage, updateTotalPagesOnLoad } from "../utils/file.util";

export default function ReadDocument({ route, navigation }: ScreenProps) {

	const { data: initialData } = route.params;

	if (!initialData) {
		navigation.goBack();
	}

	const [data, setData] = useState<CombinedFileResultType>(initialData);
	const { width, height } = useWindowDimensions();

	useEffect(() => {
		navigation.setOptions({ title: data?.name || "Read Document" });
	}, [])

	const onError = (err: any) => {
		Alert.alert("Something went wrong!")
		navigation.goBack()
	}

	const source = { uri: data.path }

	return (
		<ScrollView px={0}>
			<Pdf
				source={source}
				onLoadComplete={(numberOfPages, _) => updateTotalPagesOnLoad(data.id, numberOfPages)}
				onPageChanged={(pageNumber, _) => saveCurrentPage(data?.id, pageNumber)}
				onError={onError}
				onPressLink={(uri) => {
					console.log(`Link pressed: ${uri}`);
				}}
				style={{ flex: 1, width, height }}
			/>
		</ScrollView>
	)
}
