import { MaterialIcons } from "@expo/vector-icons";
import { Icon, Input, Pressable } from "native-base";
import { InputProps } from "../../constants/props";

interface SearchInputProps {
        search: string;
        setSearch: any;
}

export default function SearchInput({ search, setSearch }: SearchInputProps) {
        return (
                <Input
                        w="100%"
                        type="text"
                        keyboardType="web-search"
                        placeholder="Search"
                        onChangeText={setSearch}
                        value={search}
                        autoCapitalize="none"
                        autoCorrect={false}
                        px={2}
                        InputRightElement={
                                search ? (
                                        <Pressable
                                                _pressed={{ opacity: 0.5 }}
                                                px={3}
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
                                        size={5}
                                        ml={3}
                                        _dark={{ color: "muted.600" }}
                                        _light={{ color: "muted.400" }}
                                />
                        }
                        {...InputProps}
                />
        );
}