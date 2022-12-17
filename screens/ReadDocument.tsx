import { View, Text, ScrollView } from "native-base";
import { useEffect, useState } from "react";
import { CombinedFileResultType } from "../types/database";
import { ScreenProps } from "../types/general";
import Pdf from "react-native-pdf";
import { useWindowDimensions } from "react-native";
import * as FileSystem from 'expo-file-system';
import { DEFAULT_REDA_DIRECTORY } from "../utils/file.util";

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

	const source = { uri: data.path }

	return (
		<ScrollView px={0}>
			<Pdf
				source={source}
				onLoadComplete={(numberOfPages, filePath) => {
					console.log(`Number of pages: ${numberOfPages}`);
				}}
				onPageChanged={(page, numberOfPages) => {
					console.log(`Current page: ${page}`);
				}}
				onError={(error) => {
					console.log(error);
				}}
				onPressLink={(uri) => {
					console.log(`Link pressed: ${uri}`);
				}}
				style={{ flex: 1, width, height }}
			/>
		</ScrollView>
	)
}
