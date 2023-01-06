import { MaterialIcons } from "@expo/vector-icons";
import { Box, Divider, Flex, Icon, Text, FlatList } from "native-base";
import { useEffect, useState } from "react";
import { Alert, useWindowDimensions } from "react-native";
import SearchCard from "../components/cards/SearchCard";
import SearchInput from "../components/reusables/SearchInput";
import { RedaService } from "../services/local";
import { CombinedFileResultType } from "../types/database";
import { ScreenProps } from "../types/general";

export default function Search({ route, navigation }: ScreenProps) {
	const { width } = useWindowDimensions();

	const [search, setSearch] = useState<string>("");
	const [results, setResults] = useState<CombinedFileResultType[]>([]);

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
		<FlatList
			data={results}
			renderItem={({ item, index }) => (
				<SearchCard data={item} navigation={navigation} />
			)}
			keyExtractor={(item, index) => index.toString()}
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
			ItemSeparatorComponent={() => <Divider opacity={0.3} my={2} p={0} />}
			stickyHeaderIndices={[0]}
		/>
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
			_dark={{ bg: "brand-dark" }}
			_light={{ bg: "brand-light" }}
			py={3}
			mb={2}
		>
			<SearchInput search={search} setSearch={setSearch} />
		</Box>
	);
}
