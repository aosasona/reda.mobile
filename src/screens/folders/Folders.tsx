import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Box, Button, Heading, HStack, Icon, IconButton, Input, KeyboardAvoidingView, Modal, Spinner, Text, View, VStack } from "native-base";
import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, RefreshControl, useWindowDimensions } from "react-native";
import CustomSafeAreaView from "../../components/custom/CustomSafeAreaView";
import EmptySection from "../../components/reusables/EmptySection";
import SearchInput from "../../components/reusables/SearchInput";
import { ButtonProps, InputProps } from "../../config/props";
import CustomException from "../../exceptions/CustomException";
import useScrollThreshold from "../../hooks/useScroll";
import { bytesToHumanFormat } from "../../lib/misc";
import { showToast } from "../../lib/notification";
import { LocalFolderService } from "../../services/local";
import { Folder } from "../../types/folder";
import { ScreenProps } from "../../types/general";


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

export default function FoldersScreen({ navigation }: ScreenProps) {
  const { width } = useWindowDimensions()
  const [search, setSearch] = useState<string>("")
  const [folders, setFolders] = useState<Folder[]>([])

  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)

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
    const size = bytesToHumanFormat(item.total_size, "GB")
    return (
      <VStack key={`${item.folder_id}-${item.created_at}`} alignItems="center" space={2} mb={3}>
        <Icon as={MaterialIcons} name="folder" size={width / 3.25} color="blue.400" />
        <VStack alignItems="center">
          <HStack space={1} alignItems="center">
            {item.is_locked ? <Icon as={Ionicons} name="lock-closed" size={3} /> : null}
            <Text fontWeight={600}>{item.name}</Text>
          </HStack>
          <Text fontWeight={400} opacity={0.5}>{item.files_count} items{item.files_count > 0 ? ` (${size})` : null}</Text>
        </VStack>
      </VStack>
    )
  }


  return (
    <CustomSafeAreaView forceInset={{ top: "never" }}>
      <View width={width - 20} flex={1} mx="auto">
        <FlashList
          data={folders}
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
    </CustomSafeAreaView>
  );
}




export function FolderScreenHeader({ search, loading, setSearch, showNewFolderModal }: FolderScreenHeaderProps) {

  return (
    <VStack space={3} mb={2}>
      <HStack alignItems="center" justifyContent="space-between">
        <HStack space={1} alignItems="center" alignContent="center">
          {loading ? <Spinner /> : null}
          <Heading fontSize={40}>Folders</Heading>
        </HStack>

        <HStack space={3} px={1}>
          <IconButton icon={<Icon as={AntDesign} name="pluscircleo" size={6} color="mute.900" _dark={{ color: "muted.50" }} />} onPress={showNewFolderModal} _pressed={{ opacity: 0.5 }} p={0} m={0} />
        </HStack>
      </HStack>
      <SearchInput search={search} setSearch={setSearch} />
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
    } catch (e: unknown) {
      console.error("Folders.tsx: ", e)
      showToast("Error", e instanceof CustomException ? e.message : "Something went wrong!", "error")
    } finally {
      setloading(false)
      setFolderName("")
      onClose()
    }
  }

  return (
    <KeyboardAvoidingView>
      <Modal isOpen={visible} onClose={onClose}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>New folder</Modal.Header>
          <Modal.Body>
            <Input {...InputProps} placeholder="Folder name" value={folderName} onChangeText={setFolderName} rounded={6} />
          </Modal.Body>
          <Modal.Footer>
            <Button {...ButtonProps} isLoading={loading} _text={{ fontSize: "sm", fontWeight: "semibold" }} onPress={createFolder} px={5} py={3}>Save</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal></KeyboardAvoidingView>
  )
}
