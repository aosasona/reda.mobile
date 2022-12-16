import { View, Text, ScrollView } from "native-base";
import { useEffect, useState } from "react";
import { ViewProps } from "../constants/props";
import { CombinedFileResultType } from "../types/database";
import { ScreenProps } from "../types/general";
import { getThumbnail } from "../utils/misc.util";

export default function ReadDocument({ route, navigation }: ScreenProps) {

	const { data: initialData } = route.params;

	if (!initialData) {
		navigation.goBack();
	}

	const [data, setData] = useState<CombinedFileResultType>(initialData);

	const { thumb, fallback } = getThumbnail(data?.image);

	useEffect(() => {
		navigation.setOptions({ title: data?.name || "Preview" });
	}, []);
	return (
		<ScrollView>
			<Text>Read Document</Text>
		</ScrollView>
	)
}
