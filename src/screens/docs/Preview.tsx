import { Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
	Box,
	Button,
	Divider,
	Heading,
	HStack,
	Icon,
	IconButton,
	Modal,
	Pressable,
	Radio,
	ScrollView,
	Text,
} from "native-base";
import { Dispatch, SetStateAction, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Alert, RefreshControl, useWindowDimensions } from "react-native";
import CustomSafeAreaView from "../../components/custom/CustomSafeAreaView";
import PreviewHeader from "../../components/page/preview/PreviewHeader";
import { PreviewHeaderRight } from "../../components/page/preview/PreviewHeaderRight";
import { ButtonProps, DetailsProps, DividerProps } from "../../config/props";
import screens from "../../constants/screens";
import tabs from "../../constants/tabs";
import useScrollThreshold from "../../hooks/useScroll";
import useThumbnail from "../../hooks/useThumbnail";
import { DatabaseOps } from "../../lib/database";
import { bytesToHumanFormat } from "../../lib/misc";
import { LocalFileActions, LocalFileService } from "../../services/local";
import { CombinedFileResultType, FolderModel, SQLBoolean } from "../../types/database";
import { Folder } from "../../types/folder";
import { ScreenProps } from "../../types/general";

export default function Preview({ route, navigation }: ScreenProps) {
	const { data: initialData } = route.params;

	if (!initialData) { navigation.goBack(); }

	const [refreshing, setRefreshing] = useState(false);
	const [data, setData] = useState<CombinedFileResultType>(initialData);
	const [folderName, setFolderName] = useState<string>("")
	const [descriptionLines, setDescriptionLines] = useState<number>(5);
	const [showFoldersModal, setShowFoldersModal] = useState<boolean>(false)
	const [folder, setFolder] = useState<Folder>()

	const { width } = useWindowDimensions();
	const [page, onScroll] = useScrollThreshold(width * 0.75);
	const { thumb, fallback } = useThumbnail(data?.image, data?.path);

	useFocusEffect(
		useCallback(() => {
			(async () => await onRefresh(false))();
		}, [])
	);

	const openReadPage = () => {
		navigation.navigate(screens.READ_DOCUMENT.screenName, { data });
	};

	const onRefresh = async (triggerRefresh: boolean = true) => {
		try {
			if (triggerRefresh) setRefreshing(true);
			const currentData = await LocalFileService.getOne(data?.id);
			setData(currentData as CombinedFileResultType);
		} catch (e) {
			Alert.alert("Error", "An error occurred!");
			navigation.goBack();
		} finally {
			setRefreshing(false);
		}
	};

	const handleToggleStar = async () => {
		try {
			await LocalFileActions.toggleStar(data?.id);
			setData(data => ({ ...data, is_starred: !data?.is_starred as unknown as SQLBoolean }));
		} catch (e) {
			Alert.alert("Error", "An error occurred!");
		}
	};

	const handleDelete = async () => {
		await LocalFileService.deleteFile(data.id, navigation);
	};

	const handleToggleReadStatus = async () => {
		try {
			await LocalFileActions.toggleReadStatus(data?.id);
			await onRefresh(false);
		} catch (e: any) {
			Alert.alert("Error", "Something went wrong!");
		}
	};

	useEffect(() => {
		if (!!data.folder_id) {
			(async function() {
				const folder = await DatabaseOps.selectOne<FolderModel>("folders", { select: ["name", "folder_id"], where: { fields: { folder_id: data?.folder_id } } })
				if (folder && folder?.ok && folder?.data) {
					setFolderName(folder?.data?.name || "");
					setFolder(folder.data as Folder);
				}
			})()
		}
	}, [data])

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<PreviewHeaderRight
					data={data}
					navigation={navigation}
					functions={{
						handleToggleStar,
						handleDelete,
						handleToggleReadStatus,
						handleToggleFoldersSelector: () => setShowFoldersModal(true),
					}}
				/>
			),
			headerBackTitle: "Home",
			headerShadowVisible: false,
			headerTransparent: true,
			headerBlurEffect: page.hasReachedThreshold ? "regular" : "",
		});
	}, [navigation, data, page.hasReachedThreshold]);

	const filesizeInMB = bytesToHumanFormat(data?.size, "MB");

	return (
		<>
			<ScrollView px={0} showsVerticalScrollIndicator={false} scrollEventThrottle={60} onScroll={onScroll}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressViewOffset={30} />}
			>
				<StatusBar style="light" />
				<PreviewHeader source={thumb} defaultSource={fallback} data={data} />
				<Box px={4} py={4}>
					{folderName ?
						<Pressable _pressed={{ opacity: 0.5 }} onPress={() => navigation.navigate("Tabs", { screen: tabs.FOLDERS, params: { screen: screens.FOLDERCONTENT.screenName, params: { data: folder } } })} mt={1} mb={4}>
							<HStack maxW="4/5" bg="muted.300" _dark={{ bg: "muted.900" }} alignItems="center" alignSelf="flex-start" space={2} py={2} px={3} rounded="md">
								<Icon as={Feather} name="folder" color="muted.700" _dark={{ color: "muted.400" }} />
								<Text maxW="5/6" color="muted.700" _dark={{ color: "muted.400" }}>{folderName}</Text>
							</HStack>
						</Pressable>
						: null}
					<Box mb={4}>
						<Heading fontSize={24} mb={2}>Description</Heading>
						<Pressable onPress={() => setDescriptionLines(250)}>
							<Text opacity={0.8} fontSize={16} noOfLines={descriptionLines}>
								{data?.description}
							</Text>
						</Pressable>
					</Box>
					<Button onPress={openReadPage} {...ButtonProps}>
						{(data?.has_finished) ? "Read Again" : data?.has_started ? "Start reading" : "Continue reading"}
					</Button>
					<Box mt={5}>
						<Heading fontSize={24} mb={2}>Details</Heading>
						<HStack {...DetailsProps}>
							<Text fontSize={16}>File Size</Text>
							<Text opacity={0.5} fontSize={16}>{filesizeInMB}</Text>
						</HStack>
						<Divider {...DividerProps} />
						<HStack {...DetailsProps}>
							<Text fontSize={16}>Author</Text>
							<Text opacity={0.5} fontSize={16}>{data?.author}</Text>
						</HStack>
						<Divider {...DividerProps} />
						<HStack {...DetailsProps}>
							<Text fontSize={16}>Current Page</Text>
							<Text opacity={0.5} fontSize={16}>{data?.current_page}</Text>
						</HStack>
						{data?.total_pages > 1 && (
							<>
								<Divider {...DividerProps} />
								<HStack {...DetailsProps}>
									<Text fontSize={16}>Total Pages</Text>
									<Text opacity={0.5} fontSize={16}>{data?.total_pages}</Text>
								</HStack>
							</>
						)}
					</Box>

					<Box mt={5} mb={8}>
						<Heading fontSize={24}>Subject(s)</Heading>
						<Text opacity={0.6} mt={2}>{data?.subjects}</Text>
					</Box>

					<Box opacity={0.4} mb={20}>
						<Text fontSize={12}>{data?.path?.split("/").pop()}</Text>
						<Text fontSize={12}>Added {data?.created_at}</Text>
					</Box>
				</Box>
			</ScrollView>
			<FoldersModal
				fileId={data.id}
				currentFolder={data?.folder_id}
				visible={showFoldersModal}
				toggleVisible={() => setShowFoldersModal(false)}
				setCurrentFolderName={setFolderName}
			/>
		</>
	);
}

function FoldersModal({ fileId, visible, toggleVisible, currentFolder, setCurrentFolderName }: { fileId?: number, currentFolder?: number, visible: boolean; toggleVisible: () => void, setCurrentFolderName: Dispatch<SetStateAction<string>> }) {
	const { height } = useWindowDimensions()
	const [loading, setLoading] = useState<boolean>(false)
	const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
	const [folders, setFolders] = useState<{ name: string; folder_id: number }[]>([])

	useEffect(() => {
		if (!currentFolder || !folders) return;
		const currentFolderIdx = folders.findIndex(fol => fol.folder_id == currentFolder)
		setSelectedIdx(currentFolderIdx)
	}, [currentFolder, visible, folders])

	useEffect(() => {
		if (visible) {
			(async function() {
				const allFolders = await DatabaseOps.select<FolderModel>("folders", { select: ["name", "folder_id"], orderBy: { name: "ASC" } })
				if (allFolders.ok) { setFolders(allFolders.data as any); }
			})()
		}
	}, [visible])

	function reset() {
		setLoading(false)
		toggleVisible()
	}

	async function handleSave() {
		try {
			if (selectedIdx == null || !fileId) return;
			setLoading(true)
			setCurrentFolderName(folders[selectedIdx].name)
			await LocalFileActions.addToFolder(fileId, folders[selectedIdx].folder_id)
		} catch (e) {
			console.error("Preview.tsx: ", e)
			Alert.alert("Error", "Unable to complete operation")
		} finally {
			reset()
		}
	}

	async function handleTotalRemoval() {
		try {
			if (!fileId) return;
			setLoading(true)
			setCurrentFolderName("")
			setSelectedIdx(null)
			await LocalFileActions.addToFolder(fileId, null)
		} catch (e) {
			console.error("Preview.tsx: ", e)
			Alert.alert("Error", "Unable to complete operation")
		} finally {
			reset()
		}
	}

	return (
		<Modal isOpen={visible} onClose={toggleVisible}>
			<Modal.Content>
				<Modal.CloseButton />
				<Modal.Header>Move to folder</Modal.Header>
				<Modal.Body maxH={height * 0.5}>
					<Radio.Group name="current_folder" value={`${selectedIdx}`} onChange={val => setSelectedIdx(parseInt(val))}>
						{folders?.map((folder, idx) => (
							<Box my={2} key={idx}>
								<Radio size="sm" value={`${idx}`}>{folder.name}</Radio>
							</Box>
						))}
					</Radio.Group>
				</Modal.Body>
				<Modal.Footer>
					<HStack space="md" alignItems="center">
						<IconButton icon={<Icon as={Ionicons} name="ios-remove-circle-outline" size={6} color="red.500" _dark={{ color: "red.500" }} />}
							onPress={handleTotalRemoval}
							isDisabled={!currentFolder}
							_pressed={{ opacity: 0.5 }}
							_disabled={{ opacity: 0.4 }}
							p={0}
							m={0}
						/>
						<Button {...ButtonProps} onPress={handleSave} _text={{ fontSize: "sm", fontWeight: "semibold" }} isLoading={loading} px={5} py={3}>Move</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	)
}
