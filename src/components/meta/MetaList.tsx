import { Entypo } from "@expo/vector-icons";
import { Box, Button, FlatList, Flex, Heading, HStack, Icon, Input, Text } from "native-base";
import { useEffect } from "react";
import { Alert, Dimensions, Platform, useWindowDimensions } from "react-native";
import { ButtonProps, InputProps } from "../../config/props";
import { MetaModalProps } from "../../types/import";
import MetaListCard from "../cards/MetaListCard";

export default function MetaList({ functions, state }: MetaModalProps) {
	const { meta } = state;
	const { toggleStep, handleCurrentMetaChange } = functions;

	useEffect(() => {
		let mounted = true;
		if (mounted) {
			if (meta?.currentIndex !== null && meta?.current === null && meta?.all && meta?.all?.length > 0) {
				handleCurrentMetaChange(meta?.all[0], 0);
			}
		}
		return () => {
			mounted = false;
		};
	}, [meta]);

	return (
		<>
			<FlatList
				bg="transparent"
				data={meta?.all}
				renderItem={({ item, index }) => (<MetaListCard state={{ data: item, index, meta }} functions={{ onPress: handleCurrentMetaChange }} />)}
				keyExtractor={(_, index) => index.toString()}
				ListHeaderComponent={<ListHeaderComponent state={state} functions={functions} />}
				ListEmptyComponent={ListEmptyComponent}
				ListFooterComponent={<Box bg="transparent" h={128} />}
				showsVerticalScrollIndicator={false}
				stickyHeaderIndices={[0]}
				px={0}
				my={0}
			/>
			<Box
				position="absolute"
				mx="auto"
				left={0}
				right={0}
				bottom={Platform.OS === "android" ? 10 : 2}
				safeAreaBottom={true}
			>
				<Button {...ButtonProps} w="full" shadow={5} onPress={toggleStep} _text={{ fontWeight: "medium", fontSize: 16 }}>
					{(meta?.all || [])?.length > 0 && meta?.current ? "Continue" : "Skip"}
				</Button>
			</Box>
		</>
	);
}

export const ListHeaderComponent = ({ functions, state }: MetaModalProps) => {
	const { search, meta, loading } = state;
	const { setState, loadAllMeta } = functions;

	const { width } = Dimensions.get("window");

	const handleSearchChange = (value: string) =>
		setState((prevState) => ({ ...prevState, search: value }));

	const handleSearch = () => {
		if (search.length > 0) {
			loadAllMeta(search)
				.then()
				.catch(() => { Alert.alert("Error", "An error occurred!"); })
				.finally(() => {
					setState(prev => ({ ...prev, loading: { ...prev.loading, meta: false } }))
				})
		}
	};

	return (
		<Box w="full" _dark={{ bg: "dark.700" }} _light={{ bg: "muted.100" }} pb={4} mb={2}>
			<HStack justifyContent="space-between" alignItems="flex-end" my={2}>
				<Heading maxW={width * 0.66} fontSize={36} fontWeight="extrabold" textAlign="left" px={1}>
					Online Search
				</Heading>
				<Text maxW={width * 0.24} fontSize={12} opacity={0.5}>
					Showing {meta?.all?.length || 0} result{meta!.all!.length > 1 && "s"}
				</Text>
			</HStack>
			<Input
				w="full"
				type="text"
				placeholder="Search online by name..."
				onChangeText={handleSearchChange}
				value={search}
				mt={1}
				InputRightElement={
					<Button {...ButtonProps} size="xs" w="1/6" h="full" onPress={handleSearch} _text={{ fontSize: 14, fontWeight: 500 }} isLoading={loading.meta} rounded={0}>
						<Icon as={Entypo} name="magnifying-glass" size={5} _dark={{ color: "dark.700" }} _light={{ color: "muted.100" }} />
					</Button>
				}
				{...InputProps}
				_dark={{ bg: "muted.800", placeholderTextColor: "muted.500", _focus: { bg: "muted.800" } }}
				_light={{ bg: "muted.200", placeholderTextColor: "muted.500", _focus: { bg: "muted.200" } }}
			/>
		</Box>
	);
};

export const ListEmptyComponent = () => {
	const { height, width } = useWindowDimensions();

	return (
		<Flex w={width * 0.9} h={height * 0.4} alignItems="center" justifyContent="center">
			<Box>
				<Icon as={Entypo} name="info-with-circle" size={20} _dark={{ color: "muted.700" }} _light={{ color: "muted.300" }} />
				<Text _dark={{ color: "muted.700" }} _light={{ color: "muted.300" }} mt={3} >
					No match found.
				</Text>
			</Box>
		</Flex>
	);
};
