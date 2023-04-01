import { FlashList } from "@shopify/flash-list";
import { Box, Divider, Flex, Heading, View } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchCard from "../components/cards/SearchCard";
import CustomSafeAreaView from "../components/custom/CustomSafeAreaView";
import AnimatedHeader from "../components/reusables/AnimatedHeader";
import EmptySection from "../components/reusables/EmptySection";
import SearchInput from "../components/reusables/SearchInput";
import { ViewProps } from "../config/props";
import useScrollThreshold from "../hooks/useScroll";
import { showToast } from "../lib/notification";
import { LocalFileService } from "../services/local";
import { CombinedFileResultType } from "../types/database";
import { CategoryPageType, ScreenProps } from "../types/general";

interface DataState {
	all: CombinedFileResultType[];
	searchResults: CombinedFileResultType[];
}

export default function Category({ route, navigation }: ScreenProps) {
	const category = route?.params?.category as CategoryPageType;

	if (!category) navigation.goBack();

	const { height } = Dimensions.get("window");
	const { top } = useSafeAreaInsets();

	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [data, setData] = useState<DataState>({
		all: [],
		searchResults: [],
	});

	const [page, onEvent] = useScrollThreshold(50);

	useEffect(() => {
		(async () => await fetchAllFiles())();
	}, []);

	useEffect(() => runSearch(), [searchQuery]);

	const fetchAllFiles = async () => {
		try {
			const count = await LocalFileService.count();
			let data: CombinedFileResultType[] = [];

			if (category == CategoryPageType.ALL) {
				data = await LocalFileService.getAll({ limit: count, sort_by: "name", sort_order: "ASC" });
			} else if (category == CategoryPageType.STARRED) {
				data = (await LocalFileService.getStarred({ limit: count, sort_by: "name", sort_order: "ASC" })) || [];
			} else if (category == CategoryPageType.CONTINUE_READING) {
				data = await LocalFileService.getContinueReading({ limit: count, sort_by: "name", sort_order: "ASC" });
			}

			setData({ all: data, searchResults: [] });
			setSearchQuery("");
			if (loading) setLoading(false);
		}
		catch (error) {
			showToast("error", "Something went wrong", "error");
			navigation.goBack();
		}
	};

	const runSearch = () => {
		const results = data?.all?.filter((item) => item?.name?.toLowerCase()?.includes(searchQuery));
		setData((prev) => ({ ...prev, searchResults: results }));
	};

	if (loading) {
		return (
			<Flex h={height} flex={1} alignItems="center" justifyContent="center" _dark={{ bg: "dark.900" }} _light={{ bg: "light.200" }}>
				<ActivityIndicator size="large" />
			</Flex>
		);
	}

	const StickyHeader = (_: any) => (
		<Box width="full" mt={3} mx="auto" px={3} pb={4} safeAreaTop {...ViewProps}>
			<SearchInput search={searchQuery} setSearch={setSearchQuery} />
		</Box>
	);

	return (
		<CustomSafeAreaView>
			<AnimatedHeader page={page} Component={StickyHeader} />
			<View flex={1} px={3}>
				<FlashList
					data={searchQuery ? data.searchResults : data.all}
					renderItem={({ item, index }) => (<SearchCard key={`${item.id}-${index}`} data={item} navigation={navigation} />)}
					ListHeaderComponent={<PageHeader data={{ title: category, searchQuery }} functions={{ setSearchQuery }} />}
					ListFooterComponent={<Box my={5} />}
					ListEmptyComponent={EmptySection}
					ItemSeparatorComponent={() => <Divider opacity={0.3} my={2} p={0} />}
					estimatedItemSize={100}
					onScroll={onEvent}
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchAllFiles} progressViewOffset={top} />}
				/>
			</View>
		</CustomSafeAreaView>
	);
}

interface PageHeaderProps {
	data: {
		title: CategoryPageType;
		searchQuery: string;
	};
	functions: {
		setSearchQuery: any;
	};
}

function PageHeader({ data, functions }: PageHeaderProps) {
	const { title, searchQuery } = data;
	const { setSearchQuery } = functions;

	return (
		<Box w="full" _dark={{ bg: "dark.900" }} _light={{ bg: "light.200" }} pb={3} px={0} pt={3} mb={4}>
			<Heading fontSize={40} px={0.5} mb={2}>
				{title}
			</Heading>
			<SearchInput search={searchQuery} setSearch={setSearchQuery} />
		</Box>
	);
}
