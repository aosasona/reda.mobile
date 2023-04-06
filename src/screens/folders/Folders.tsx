import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Box, Button, Heading, HStack, Icon, IconButton, Input, Modal, Pressable, Spinner, Text, View, VStack } from "native-base";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert, RefreshControl, useWindowDimensions, Vibration } from "react-native";
import CustomSafeAreaView from "../../components/custom/CustomSafeAreaView";
import EmptySection from "../../components/reusables/EmptySection";
import SearchInput from "../../components/reusables/SearchInput";
import { ButtonProps, InputProps } from "../../config/props";
import screens from "../../constants/screens";
import CustomException from "../../exceptions/CustomException";
import useScrollThreshold from "../../hooks/useScroll";
import { bytesToHumanFormat } from "../../lib/misc";
import { showToast } from "../../lib/notification";
import { LocalFolderService } from "../../services/local";
import { Folder } from "../../types/folder";
import { ScreenProps } from "../../types/general";
import * as Haptics from "expo-haptics"


interface FolderScreenHeaderProps {
  loading: boolean;
  search: string;
  setSearch: (search: string) => void;
  showNewFolderModal: () => void;
}

interface NewFolderModalProps {
  visible: boolean;
  onClose: () => void;
  triggerReload: () => Promise<void>;
}

interface FolderActionModalProps {
  data: { id: number; name: string } | null;
  visible: boolean;
  onClose: () => void;
  triggerReload: () => Promise<void>;
}

export default function FoldersScreen({ navigation }: ScreenProps) {
  const { width } = useWindowDimensions()
  const [search, setSearch] = useState<string>("")
  const [folders, setFolders] = useState<Folder[]>([])
  const [searchResult, setSearchResult] = useState<Folder[]>([])


  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [actionFolder, setActionFolder] = useState<FolderActionModalProps["data"]>(null)

  const [page, onScroll] = useScrollThreshold(40);

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

  useEffect(() => {
    if (search == "") return setSearchResult([])
    const res = folders.filter(folder => folder?.name?.toLowerCase()?.includes(search));
    setSearchResult(res);
  }, [search])


  async function load(isRefresh: boolean = false) {
    try {
      if (isRefresh) setRefreshing(true);
      const res = await LocalFolderService.getAll()
      setFolders(res)
    } catch (e) {
      console.error("Folders.tsx: ", e)
      Alert.alert("Error", "Something went wrong while trying to load folders")
    } finally {
      if (isRefresh) setRefreshing(false);
      if (loading) setLoading(false);
    }
  }

  function renderItem({ item }: { item: Folder }) {
    const size = bytesToHumanFormat(item.total_size, item.total_size < 999000000 ? "MB" : "GB")
    const folderMeta = `${item.files_count} item${item.files_count == 0 || item.files_count > 1 ? "s" : ""}${item.files_count > 0 ? " (" + size + ")" : ""}`

    function openFolderSettings() {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setActionFolder(item?.folder_id ? { id: item.folder_id, name: item.name } : null)
    }

    return (
      <Pressable
        _pressed={{ opacity: 0.6 }}
        onPress={() => navigation.navigate(screens.FOLDERCONTENT.screenName, { data: item })}
        onLongPress={openFolderSettings}
      >
        <VStack key={`${item.folder_id}-${item.created_at}`} alignItems="center" space={0.5} mb={3}>
          <Icon as={MaterialIcons} name="folder" size={width / 3.25} color="blue.400" />
          <VStack alignItems="center" space={1}>
            <HStack space={1} alignItems="center">
              {item.is_locked ? <Icon as={Ionicons} name="lock-closed" size={3} /> : null}
              <Text fontSize="md" fontWeight={600}>{item.name}</Text>
            </HStack>
            <Text fontSize="xs" fontWeight={400} opacity={0.5}>{folderMeta}</Text>
          </VStack>
        </VStack>
      </Pressable>
    )
  }


  return (
    <CustomSafeAreaView forceInset={{ top: "never" }}>
      <View width={width - 20} flex={1} mx="auto">
        <FlashList
          data={search != "" ? searchResult : folders}
          keyExtractor={(item, index) => `${index}-${item.created_at}`} // need it to be very unique
          renderItem={renderItem}
          estimatedItemSize={120}
          ListHeaderComponent={<FolderScreenHeader search={search} loading={loading} setSearch={setSearch} showNewFolderModal={() => setShowNewFolderModal(true)} />}
          ListEmptyComponent={<EmptySection />}
          ListFooterComponent={<Box my={10} bg="transparent" />}
          scrollEventThrottle={60}
          onScroll={onScroll}
          refreshControl={<RefreshControl onRefresh={async () => await load(true)} refreshing={refreshing} />}
          numColumns={3}
        />
      </View>
      <NewFolderModal visible={showNewFolderModal} onClose={() => setShowNewFolderModal(false)} triggerReload={load} />
      <FolderActionModal data={actionFolder} visible={!!actionFolder} onClose={() => setActionFolder(null)} triggerReload={load} />
    </CustomSafeAreaView>
  );
}




export function FolderScreenHeader({ search, loading, setSearch, showNewFolderModal }: FolderScreenHeaderProps) {
  return (
    <VStack space={3} mb={2}>
      <HStack alignItems="center" justifyContent="space-between" px={1}>
        <HStack space={1} alignItems="center" alignContent="center">
          {loading ? <Spinner /> : null}
          <Heading fontSize={40}>Folders</Heading>
        </HStack>

        <HStack space={3} px={1}>
          <IconButton icon={<Icon as={AntDesign} name="pluscircleo" size={6} color="mute.900" _dark={{ color: "muted.50" }} />} onPress={showNewFolderModal} _pressed={{ opacity: 0.5 }} p={0} m={0} />
        </HStack>
      </HStack>
      <SearchInput search={search} setSearch={setSearch} placeholder="my awesome folder" />
    </VStack>
  )
}


function NewFolderModal({ visible, onClose, triggerReload }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState<string>("")
  const [loading, setloading] = useState<boolean>(false)

  async function createFolder() {
    try {
      setloading(true)
      if (!folderName) return;
      await LocalFolderService.create(folderName)
      showToast("Success", `${folderName} folder created!`)
      await triggerReload()
      onClose()
    } catch (e: unknown) {
      console.error("Folders.tsx: ", e)
      Alert.alert("Error", e instanceof CustomException ? e.message : "Something went wrong!")
    } finally {
      setloading(false)
      setFolderName("")
    }
  }

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>New folder</Modal.Header>
        <Modal.Body>
          <Input {...InputProps} placeholder="Folder name" value={folderName} onChangeText={setFolderName} rounded={6} px={1} _light={{ px: 2 }} autoComplete="off" autoFocus={visible} autoCapitalize="words" enablesReturnKeyAutomatically />
        </Modal.Body>
        <Modal.Footer>
          <Button {...ButtonProps} isLoading={loading} _text={{ fontSize: "sm", fontWeight: "semibold" }} onPress={createFolder} px={5} py={3}>Create</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}

function FolderActionModal({ data, visible, onClose, triggerReload }: FolderActionModalProps) {
  const [folderName, setFolderName] = useState<string>("")
  const [loading, setloading] = useState<boolean>(false)

  useEffect(() => {
    if (data) {
      return setFolderName(data.name)
    }
    return setFolderName("")
  }, [visible])

  async function renameFolder() {
    try {
      setloading(true)
      if (!folderName || !data) return;
      await LocalFolderService.rename(data?.id, folderName)
      await triggerReload()
      onClose()
    } catch (e: unknown) {
      console.error("Folders.tsx: ", e)
      Alert.alert("Error", e instanceof CustomException ? e.message : "Something went wrong!")
    } finally {
      setloading(false)
    }
  }

  async function deleteFolder() {
    try {
      if (!data) return;
      await LocalFolderService.deleteFolder(data?.id)
      await triggerReload()
    } catch (e: unknown) {
      console.error("Folders.tsx: ", e)
      Alert.alert("Error", e instanceof CustomException ? e.message : "Something went wrong!")
    } finally {
      onClose()
    }
  }

  function confirmFolderDeletion() {
    Alert.alert("Confirm action", "Are you sure you want to delete this folder?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "destructive",
        onPress: async function() {
          await deleteFolder()
        }
      },
    ])
  }

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Folder settings</Modal.Header>
        <Modal.Body>
          <Input {...InputProps} placeholder="Folder name" value={folderName} onChangeText={setFolderName} autoComplete="off" enablesReturnKeyAutomatically autoFocus={visible} autoCorrect rounded={6} px={1} _light={{ px: 2 }} />
        </Modal.Body>
        <Modal.Footer>
          <HStack alignItems="center" space="lg">
            <IconButton icon={<Icon as={Ionicons} name="ios-trash-outline" size={6} color="red.500" />} _pressed={{ opacity: 0.5 }} onPress={confirmFolderDeletion} p={0} m={0} />
            <Button {...ButtonProps} isLoading={loading} _text={{ fontSize: "sm", fontWeight: "semibold" }} onPress={renameFolder} px={5} py={3}>Save</Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
