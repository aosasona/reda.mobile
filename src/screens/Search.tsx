import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Box, Divider, Flex, Heading, Icon, Text, View } from "native-base";
import { useEffect, useState } from "react";
import { Alert, useWindowDimensions } from "react-native";
import SearchCard from "../components/cards/SearchCard";
import CustomSafeAreaView from "../components/custom/CustomSafeAreaView";
import AnimatedHeader from "../components/reusables/AnimatedHeader";
import SearchInput from "../components/reusables/SearchInput";
import { ViewProps } from "../config/props";
import useScrollThreshold from "../hooks/useScroll";
import { RedaService } from "../services/local";
import { CombinedFileResultType } from "../types/database";
import { ScreenProps } from "../types/general";

export default function Search({ route, navigation }: ScreenProps) {
	const { width } = useWindowDimensions();

	const [search, setSearch] = useState<string>("");
	const [results, setResults] = useState<CombinedFileResultType[]>([]);

	const [page, onEvent] = useScrollThreshold(50);

	const StickyHeader = (props: any) => (
		<Box
			mt={3}
			mx="auto"
			px={3}
			pb={4}
			safeAreaTop
			{...ViewProps}
		>
			<SearchInput search={search} setSearch={setSearch} {...props} />
		</Box>
	);

	useEffect(() => {
		if (search.length >= 2) {
			RedaService.search(search)
				.then(setResults)
				.catch((_) => Alert.alert("Error", "Something went wrong!"));
		} else if (search.length == 0) {
			setResults([]);
		}
	}, [search]);

	return (
		<CustomSafeAreaView>
			<AnimatedHeader
				Component={StickyHeader}
				page={page}
			/>
			<View flex={1} px={3}>
				<FlashList
					data={results}
					renderItem={({ item, index }) => (
						<SearchCard
							key={`${item.id}-${index}`}
							data={item}
							navigation={navigation}
						/>
					)}
					keyExtractor={(item, index) => `${item.id}-${index}`}
					ListHeaderComponent={
						<SearchHeader search={search} setSearch={setSearch} />
					}
					ListEmptyComponent={
						<Flex
							w={width * 0.9}
							bg="transparent"
							alignItems="center"
							justifyContent="center"
							mx="auto"
							my={16}
						>
							<Box alignItems="center">
								<Icon
									as={MaterialIcons}
									name="folder"
									size={32}
									_dark={{ color: "muted.800" }}
									_light={{ color: "muted.300" }}
								/>
								<Text
									fontSize={16}
									_dark={{ color: "muted.700" }}
									_light={{ color: "muted.400" }}
									mt={3}
								>
									No results...
								</Text>
							</Box>
						</Flex>
					}
					estimatedItemSize={250}
					ItemSeparatorComponent={() => <Divider opacity={0.3} my={2} p={0} />}
					onScroll={onEvent}
					showsHorizontalScrollIndicator
				/>
			</View>
		</CustomSafeAreaView>
	);
}

function SearchHeader({
	search,
	setSearch,
}: {
	search: string;
	setSearch: any;
}) {
	return (
		<Box
			w="full"
			_dark={{ bg: "dark.900" }}
			_light={{ bg: "light.200" }}
			py={3}
			mb={2}
		>
			<Heading fontSize={40} mb={3}>
				Search
			</Heading>
			<SearchInput search={search} setSearch={setSearch} />
		</Box>
	);
}
