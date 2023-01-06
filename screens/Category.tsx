import { FlashList } from "@shopify/flash-list";
import { Box, Divider, Flex, Heading, View } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchCard from "../components/cards/SearchCard";
import CustomSafeAreaView from "../components/reusables/custom/CustomSafeAreaView";
import EmptySection from "../components/reusables/EmptySection";
import SearchInput from "../components/reusables/SearchInput";
import { ViewProps } from "../constants/props";
import { RedaService } from "../services/local";
import { CombinedFileResultType } from "../types/database";
import { CategoryPageType, ScreenProps } from "../types/general";
import { showToast } from "../utils/misc.util";

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

	useEffect(() => {
		(async () => await fetchAllFiles())();
	}, []);

	useEffect(() => runSearch(), [searchQuery]);

	const fetchAllFiles = async () => {
		try {
			const count = await RedaService.count();
			let data: CombinedFileResultType[] = [];

			if (category == CategoryPageType.ALL) {
				data = await RedaService.getAll({
					limit: count,
					sort_by: "name",
					sort_order: "ASC",
				});
			} else if (category == CategoryPageType.STARRED) {
				data =
					(await RedaService.getStarred({
						limit: count,
						sort_by: "name",
						sort_order: "ASC",
					})) || [];
			} else if (category == CategoryPageType.CONTINUE_READING) {
				data = await RedaService.getContinueReading({
					limit: count,
					sort_by: "name",
					sort_order: "ASC",
				});
			}

			setData({ all: data, searchResults: [] });
			setSearchQuery("");
			if (loading) setLoading(false);
		} catch (error) {
			showToast("Something went wrong!", "error");
			navigation.goBack();
		}
	};

	const runSearch = () => {
		const results = data?.all?.filter((item) =>
			item?.name?.toLowerCase()?.includes(searchQuery)
		);
		setData((prev) => ({ ...prev, searchResults: results }));
	};

	if (loading) {
		return (
			<Flex
				h={height}
				flex={1}
				alignItems="center"
				justifyContent="center"
				_dark={{ bg: "brand-dark" }}
				_light={{ bg: "brand-light" }}
			>
				<ActivityIndicator size="large" />
			</Flex>
		);
	}

	return (
		<CustomSafeAreaView>
			<View flex={1} px={3} {...ViewProps}>
				<FlashList
					data={searchQuery ? data.searchResults : data.all}
					renderItem={({ item }) => (
						<SearchCard data={item} navigation={navigation} />
					)}
					ListHeaderComponent={() => (
						<PageHeader
							data={{ title: category, searchQuery }}
							functions={{ setSearchQuery }}
						/>
					)}
					ListFooterComponent={<Box my={5} />}
					ListEmptyComponent={EmptySection}
					ItemSeparatorComponent={() => <Divider opacity={0.3} my={2} p={0} />}
					estimatedItemSize={200}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={fetchAllFiles}
							progressViewOffset={top}
						/>
					}
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
		<Box
			w={"full"}
			_dark={{ bg: "brand-dark" }}
			_light={{ bg: "brand-light" }}
			pb={3}
			px={0}
			pt={3}
			mb={4}
		>
			<Heading fontSize={40} px={0.5} mb={2}>
				{title}
			</Heading>
			<SearchInput search={searchQuery} setSearch={setSearchQuery} />
		</Box>
	);
}