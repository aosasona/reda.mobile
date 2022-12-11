import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {FlatList, SectionList} from "native-base";
import {useCallback, useState} from "react";
import {Alert, RefreshControl} from "react-native";
import EmptySection from "../components/EmptySection";
import HomeHeader from "../components/HomeHeader";
import HomeSectionTitle from "../components/HomeSectionTitle";
import HorizontalFileCard from "../components/HorizontalFileCard";
import {CombinedFileResultType} from "../types/database";
import {RedaService} from "../utils/internal.util";


interface FullDataState {
	title: string;
	key: string;
	data: [
		{
			key: string;
			list: CombinedFileResultType[];
		},
	],
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
		{title: "Recent", data: []},
		{title: "Starred", data: []},
	]);

	useFocusEffect(
	  useCallback(() => {
		  (async () => await fetchAllFiles())();
		  return () => setInitialLoad(true);
	  }, []),
	);

	const fetchAllFiles = async () => {
		try {
			setLoading(true);
			const count = await RedaService.count();
			if (count === 0) {
				setCount(0);
				return;
			}
			const all = await RedaService.getAll() as CombinedFileResultType[] | null;
			const starred = await RedaService.getStarred() as CombinedFileResultType[] | null;
			setData(prevState => (
			  [
				  {
					  ...prevState[0],
					  data: all || [],
				  },
				  {
					  ...prevState[1],
					  data: starred || [],
				  },
			  ]
			));
		}
		catch (e) {
			Alert.alert("Error", "An error occurred while fetching files");
		}
		finally {
			setLoading(false);
		}
	}

	return (

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
		ListHeaderComponent={<HomeHeader state={{search, loading, initialLoad}} setters={{setSearch}}/>}
		keyExtractor={(item, index) => item.key + index}
		renderSectionHeader={({section: {title}}) => (<HomeSectionTitle title={title}/>)}
		renderItem={({item, index}) => (
		  <FlatList
			data={item.list}
			horizontal
			showsHorizontalScrollIndicator={false}
			renderItem={({item, index}) => (<HorizontalFileCard data={item as any} index={index} navigation={navigation}/>)}
			keyExtractor={(item, index) => index.toString()}
			ListEmptyComponent={<EmptySection title={item.key}/>}
			alwaysBounceVertical={false}
			alwaysBounceHorizontal={false}
			initialNumToRender={20}
			px={0}
			mx={0}
		  />
		)}
		refreshControl={
			<RefreshControl
			  refreshing={loading}
			  onRefresh={fetchAllFiles}
			  progressViewOffset={40}
			/>
		}
		showsVerticalScrollIndicator={false}
		keyboardShouldPersistTaps={"handled"}
	  />
	)
}