import {useNavigation} from "@react-navigation/native";
import {FlatList, ScrollView} from "native-base";
import {useEffect, useState} from "react";
import {Alert, RefreshControl} from "react-native";
import EmptyLibrary from "../components/EmptyLibrary";
import HomeHeader from "../components/HomeHeader";
import HorizontalFileCard from "../components/HorizontalFileCard";
import {CombinedFileResultType} from "../types/database";
import {RedaService} from "../utils/internal.util";

export default function Home() {

	const navigation = useNavigation();
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [initialLoad, setInitialLoad] = useState(false);
	const [files, setFiles] = useState<CombinedFileResultType[] | null>([]);

	useEffect(() => {
		let mounted = true;
		if(mounted) {
			(async () => await fetchAllFiles())();
			setInitialLoad(true);
		}
		return () => {
			mounted = false;
		}
	}, []);

	const fetchAllFiles = async () => {
		try {
			setLoading(true);
			const result = await RedaService.getAll() as CombinedFileResultType[] | null;
			setFiles(result);
		}
		catch (e) {
			Alert.alert("Error", "An error occurred while fetching files");
		}
		finally {
			setLoading(false);
		}
	}

	return (
	  <ScrollView refreshControl={
		  <RefreshControl
			refreshing={loading}
			onRefresh={fetchAllFiles}
			progressViewOffset={50}
		  />
	  }>
		  <HomeHeader state={{files, search, loading, initialLoad}} setters={{setSearch}}/>
		  <FlatList
			data={files}
			horizontal
			showsHorizontalScrollIndicator={false}
			renderItem={({item, index}) => (<HorizontalFileCard data={item} index={index} navigator={navigation}/>)}
			keyExtractor={(item, index) => index.toString()}
			ListEmptyComponent={<EmptyLibrary/>}
			px={0}
		  />
	  </ScrollView>
	)
}