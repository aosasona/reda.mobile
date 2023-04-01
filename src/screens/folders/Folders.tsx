import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Heading, HStack, Icon, IconButton, Spinner, Text, View, VStack } from "native-base";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert, RefreshControl } from "react-native";
import CustomSafeAreaView from "../../components/custom/CustomSafeAreaView";
import EmptySection from "../../components/reusables/EmptySection";
import SearchInput from "../../components/reusables/SearchInput";
import useScrollThreshold from "../../hooks/useScroll";
import { LocalFolderService } from "../../services/local";
import { Folder } from "../../types/folder";
import { ScreenProps } from "../../types/general";

enum DisplayStyle {
  GRID,
  LIST
}

interface FolderScreenHeaderProps {
  loading: boolean;
  search: string;
  setSearch: (search: string) => void;
  displayStyle: DisplayStyle;
  toggleDisplayStyle: () => void;
}

export default function FoldersScreen({ navigation }: ScreenProps) {
  const [search, setSearch] = useState<string>("")
  const [folders, setFolders] = useState<Folder[]>([])
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle>(DisplayStyle.GRID)
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const [page, onScroll] = useScrollThreshold(40);

  useEffect(() => {
  }, [])

  useFocusEffect(
    useCallback(() => {
      (async () => await load())()
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: page.hasReachedThreshold ? "Folders" : ""
    })
  }, [page])


  async function load(isRefresh: boolean = false) {
    try {
      if (isRefresh) setRefreshing(true);
      const res = await LocalFolderService.getAll()
      setFolders(res)
    } catch (e) {
      console.log(e)
      Alert.alert("Error", "Something went wrong while trying to load folders")
    } finally {
      if (isRefresh) setRefreshing(false);
      if (loading) setLoading(false);
    }
  }

  function toggleDisplayStyle() {
    setDisplayStyle(prev => prev == DisplayStyle.LIST ? DisplayStyle.GRID : DisplayStyle.LIST)
  }

  return (
    <CustomSafeAreaView forceInset={{ top: "never" }}>
      <FlashList
        data={folders}
        keyExtractor={(index) => index.toString()}
        renderItem={({ item }) => <Text key={item.name}>{item.name}</Text>}
        estimatedItemSize={120}
        ListHeaderComponent={<FolderScreenHeader search={search} loading={loading} setSearch={setSearch} displayStyle={displayStyle} toggleDisplayStyle={toggleDisplayStyle} />}
        ListEmptyComponent={<EmptySection />}
        scrollEventThrottle={60}
        onScroll={onScroll}
        refreshControl={<RefreshControl onRefresh={async () => await load(true)} refreshing={refreshing} />}
      />
    </CustomSafeAreaView>
  );
}


export function FolderScreenHeader({ search, loading, setSearch, displayStyle, toggleDisplayStyle }: FolderScreenHeaderProps) {

  return (
    <VStack space={3} px={3}>
      <HStack alignItems="center" justifyContent="space-between">
        <HStack space={1} alignItems="center" alignContent="center">
          {loading ? <Spinner /> : null}
          <Heading fontSize={40}>Folders</Heading>
        </HStack>

        <HStack space={3} px={1}>
          <IconButton
            icon={<Icon as={Ionicons} name={displayStyle == DisplayStyle.LIST ? "ios-list-outline" : "ios-grid-outline"} size={6} color="mute.900" _dark={{ color: "muted.50" }} />}
            _pressed={{ opacity: 0.5 }}
            p={0}
            m={0}
            onPress={toggleDisplayStyle}
          />
          <IconButton icon={<Icon as={AntDesign} name="pluscircleo" size={6} color="mute.900" _dark={{ color: "muted.50" }} />} _pressed={{ opacity: 0.5 }} p={0} m={0} />
        </HStack>
      </HStack>
      <SearchInput search={search} setSearch={setSearch} />
    </VStack>
  )
}
