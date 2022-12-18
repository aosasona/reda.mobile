import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, Image, SectionList, VStack } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { Alert, RefreshControl, useWindowDimensions } from "react-native";
import EmptySection from "../components/EmptySection";
import HomeHeader from "../components/HomeHeader";
import HomeSectionTitle from "../components/HomeSectionTitle";
import HorizontalFileCard from "../components/HorizontalFileCard";
import SearchPage from "../components/SearchPage";
import { CombinedFileResultType } from "../types/database";
import { RedaService } from "../utils/internal.util";
import LargeHorizontalFileCard from "../components/LargeHorizontalFileCard";

interface FullDataState {
	title: string;
	key: string;
	data: [
		{
			key: string;
			list: CombinedFileResultType[];
		}
	];
}

interface FlatDataState {
	title: string;
	data: CombinedFileResultType[];
}

export default function Home() {
	const navigation = useNavigation();
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [initialLoad, setInitialLoad] = useState(false);
	const [count, setCount] = useState(0);
	const [data, setData] = useState<FlatDataState[]>([
		{ title: "Continue reading", data: [] },
		{ title: "Recently added", data: [] },
		{ title: "Starred", data: [] },
	]);

	useFocusEffect(
		useCallback(() => {
			(async () => await fetchAllFiles())();
			return () => setInitialLoad(true);
		}, [])
	);

	const fetchAllFiles = async () => {
		try {
			setLoading(true);
			const filesCount = await RedaService.count();
			if (filesCount === 0) {
				setCount(0);
				return;
			}
			const { recentlyAdded, starred, continueReading } =
				await RedaService.loadHomePageData();
			setData((prevState) => [
				{
					...prevState[0],
					data: continueReading || [],
				},
				{
					...prevState[1],
					data: recentlyAdded || [],
				},
				{
					...prevState[2],
					data: starred || [],
				},
			]);
		} catch (e) {
			Alert.alert("Error", "An error occurred while fetching files");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<SectionList
				sections={data.map((d) => ({
					title: d.title,
					key: d.title,
					data: [
						{
							key: d.title,
							list: d.data,
						},
					],
				}))}
				ListHeaderComponent={
					<HomeHeader
						state={{ loading, initialLoad }}
						navigation={navigation}
					/>
				}
				keyExtractor={(item, index) => item.key + index}
				renderSectionHeader={({ section }) =>
					section?.data?.[0]?.list?.length > 0 ? (
						<HomeSectionTitle title={section.title} />
					) : null
				}
				renderItem={({ item, section, index }) =>
					item.list.length > 0 ? (
						<FlatList
							data={item.list}
							horizontal
							showsHorizontalScrollIndicator={false}
							renderItem={({ item, index }) =>
								section.title == "Continue reading" ? (
									<LargeHorizontalFileCard
										data={item}
										index={index}
										navigation={navigation}
									/>
								) : (
									<HorizontalFileCard
										data={item}
										index={index}
										navigation={navigation}
									/>
								)
							}
							keyExtractor={(item, index) => index.toString()}
							ListEmptyComponent={<EmptySection title={item.key} />}
							alwaysBounceVertical={false}
							alwaysBounceHorizontal={false}
							initialNumToRender={20}
							px={0}
							mx={0}
						/>
					) : null
				}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={fetchAllFiles}
						progressViewOffset={40}
					/>
				}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="always"
				stickySectionHeadersEnabled={false}
				alwaysBounceVertical={false}
			/>
		</>
	);
}
