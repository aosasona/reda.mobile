import { MaterialIcons } from "@expo/vector-icons";
import { Box, FlatList, Flex, Icon, Input, Pressable, Text } from "native-base";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { InputProps } from "../constants/props";
import { CombinedFileResultType } from "../types/database";

export default function Search() {
  const { width } = useWindowDimensions();

  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<CombinedFileResultType[]>([]);

  return (
    <FlatList
      data={results}
      renderItem={({ item, index }) => <></>}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <SearchHeader search={search} setSearch={setSearch} />
      }
      ListEmptyComponent={
        <Flex
          w={width * 0.9}
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
              _dark={{ color: "muted.800" }}
              _light={{ color: "muted.300" }}
              mt={3}
            >
              No results...
            </Text>
          </Box>
        </Flex>
      }
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
      w={"full"}
      _dark={{ bg: "brand-dark" }}
      _light={{ bg: "brand-light" }}
      py={3}
    >
      <Input
        w="100%"
        type="text"
        placeholder="Search"
        onChangeText={setSearch}
        value={search}
        autoFocus={true}
        autoCapitalize="none"
        autoCorrect={false}
        px={2}
        InputRightElement={
          search ? (
            <Pressable
              _pressed={{ opacity: 0.5 }}
              p={4}
              onPress={() => setSearch("")}
            >
              <Icon
                as={MaterialIcons}
                name="cancel"
                size={5}
                _dark={{ color: "muted.800" }}
                _light={{ color: "muted.400" }}
              />
            </Pressable>
          ) : (
            <></>
          )
        }
        InputLeftElement={
          <Icon
            as={MaterialIcons}
            name="search"
            size="sm"
            ml={3}
            _dark={{ color: "muted.600" }}
            _light={{ color: "muted.400" }}
          />
        }
        {...InputProps}
      />
    </Box>
  );
}
