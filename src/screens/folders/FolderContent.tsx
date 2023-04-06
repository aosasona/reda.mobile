import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Divider, Spinner, View } from "native-base";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert } from "react-native";
import SearchCard from "../../components/cards/SearchCard";
import CustomSafeAreaView from "../../components/custom/CustomSafeAreaView";
import EmptySection from "../../components/reusables/EmptySection";
import SearchInput from "../../components/reusables/SearchInput";
import { LocalFileService } from "../../services/local";
import { CombinedFileResultType } from "../../types/database";
import { Folder } from "../../types/folder";
import { ScreenProps } from "../../types/general";

export default function FolderContent({ navigation, route }: ScreenProps) {
  const params = route?.params
  const data = params?.data as Folder

  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>("")
  const [content, setContent] = useState<CombinedFileResultType[]>([])
  const [searchResult, setSearchResult] = useState<CombinedFileResultType[]>([])

  useLayoutEffect(() => {
    if (!data) return navigation.goBack()
    navigation.setOptions({
      headerTitle: data.name
    });
  }, [data])

  useFocusEffect(
    useCallback(() => {
      (async function() { await loadContent() })()
    }, [])
  );

  useEffect(() => {
    if (search == "") return setSearchResult([])
    const result = content.filter((file) => {
      return file?.name?.toLowerCase()?.includes(search)
        || file?.description?.toLowerCase()?.includes(search)
        || file?.author?.toLowerCase()?.includes(search)
        || file?.subjects?.toLowerCase()?.includes(search)
    })
    setSearchResult(result)
  }, [search])

  async function loadContent(isRefreshing: boolean = false) {
    try {
      if (isRefreshing) setRefreshing(true);
      const files = await LocalFileService.getByFolder(data.folder_id);
      setContent(files)
    } catch (e) {
      console.error("FoldersContent.tsx: ", e);
      Alert.alert("Error", "Something went wrong!")
    } finally {
      if (loading) setLoading(false)
      if (isRefreshing && refreshing) setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <CustomSafeAreaView forceInset={{ top: "never" }}>
        <View flex={1} alignItems="center" justifyContent="center">
          <Spinner size="lg" />
        </View>
      </CustomSafeAreaView>
    )
  }

  return (
    <CustomSafeAreaView forceInset={{ top: "never" }}>
      <View flex={1} px={3}>
        <FlashList
          data={search != "" ? searchResult : content}
          renderItem={({ item, index }) => (<SearchCard key={`${item.id}-${index}`} data={item} navigation={navigation} />)}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ListHeaderComponent={<View mt={2} mb={5}><SearchInput search={search} setSearch={setSearch} placeholder="filter by title, author, description..." /></View>}
          ListEmptyComponent={<EmptySection />}
          estimatedItemSize={250}
          ItemSeparatorComponent={() => <Divider opacity={0.3} p={0} my={2} ml={16} />}
          scrollEventThrottle={60}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </CustomSafeAreaView>
  )
}
