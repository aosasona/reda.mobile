import { Spinner, View } from "native-base";
import { useLayoutEffect, useState } from "react";
import { Alert } from "react-native";
import CustomSafeAreaView from "../../components/custom/CustomSafeAreaView";
import { LocalFileService } from "../../services/local";
import { CombinedFileResultType } from "../../types/database";
import { Folder } from "../../types/folder";
import { ScreenProps } from "../../types/general";

export default function FolderContent({ navigation, route }: ScreenProps) {
  const params = route?.params
  const data = params?.data as Folder

  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [content, setContent] = useState<CombinedFileResultType[]>([])

  useLayoutEffect(() => {
    if (!data) return navigation.goBack()
    navigation.setOptions({
      headerTitle: data.name
    });
    (async function() { await loadContent() })()
  }, [data])

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
      <CustomSafeAreaView>
        <View flex={1} alignItems="center" justifyContent="center">
          <Spinner size="lg" />
        </View>
      </CustomSafeAreaView>
    )
  }

  return (
    <CustomSafeAreaView>
    </CustomSafeAreaView>
  )
}
