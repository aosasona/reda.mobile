import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  ScrollView,
  Text,
} from "native-base";
import { useEffect, useState } from "react";
import { Alert, RefreshControl } from "react-native";
import PreviewHeader, {
  PreviewNavigationHeader,
} from "../components/preview/PreviewHeader";
import { ButtonProps, DetailsProps, DividerProps } from "../constants/props";
import screens from "../constants/screens";
import { CombinedFileResultType, SQLBoolean } from "../types/database";
import { ScreenProps } from "../types/general";
import { RedaService } from "../utils/internal.util";
import { byteToMB, getThumbnail } from "../utils/misc.util";

export default function Preview({ route, navigation }: ScreenProps) {
  const { data: initialData } = route.params;

  if (!initialData) {
    navigation.goBack();
  }

  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<CombinedFileResultType>(initialData);

  const { thumb, fallback } = getThumbnail(data?.image);

  useEffect(() => {
    navigation.setOptions({ title: data?.name || "Preview" });
  }, []);

  const openReadPage = () => {
    navigation.navigate(screens.READ_DOCUMENT.screenName, { data });
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const currentData = await RedaService.getOne(data?.id);
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
      await RedaService.toggleStar(data?.id);
      setData({
        ...data,
        is_starred: !data?.is_starred as unknown as SQLBoolean,
      });
    } catch (e) {
      Alert.alert("Error", "Unable to perform action!");
    }
  };

  const handleDelete = async () => {
    await RedaService.deleteFile(data.id, navigation);
  };

  const handleToggleReadStatus = async () => {
    try {
      await RedaService.toggleReadStatus(data?.id);
      await onRefresh();
    } catch (e: any) {
      Alert.alert("Error", "Something went wrong!");
    }
  };

  const filesizeInMB = byteToMB(data?.size);

  return (
    <ScrollView
      px={0}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <PreviewNavigationHeader
        data={data}
        navigation={navigation}
        functions={{
          handleToggleStar,
          handleDelete,
          handleToggleReadStatus,
        }}
      />
      <PreviewHeader source={thumb} defaultSource={fallback} data={data} />
      <Box px={4} py={4}>
        <Box mb={4}>
          <Heading fontSize={24} mb={2}>
            Description
          </Heading>
          <Text opacity={0.8} fontSize={16} noOfLines={10}>
            {data?.description}
          </Text>
        </Box>
        <Button onPress={openReadPage} {...ButtonProps}>
          {data?.has_started
            ? "Continue reading"
            : data?.has_finished
              ? "Read Again"
              : "Start Reading"}
        </Button>
        <Box mt={5}>
          <Heading fontSize={24} mb={2}>
            Details
          </Heading>
          <HStack {...DetailsProps}>
            <Text fontSize={16}>File Size</Text>
            <Text opacity={0.5} fontSize={16}>
              {filesizeInMB}
            </Text>
          </HStack>
          <Divider {...DividerProps} />
          <HStack {...DetailsProps}>
            <Text fontSize={16}>Author</Text>
            <Text opacity={0.5} fontSize={16}>
              {data?.author}
            </Text>
          </HStack>
          <Divider {...DividerProps} />
          <HStack {...DetailsProps}>
            <Text fontSize={16}>Current Page</Text>
            <Text opacity={0.5} fontSize={16}>
              {data?.current_page}
            </Text>
          </HStack>
          {data?.total_pages > 1 && (
            <>
              <Divider {...DividerProps} />
              <HStack {...DetailsProps}>
                <Text fontSize={16}>Total Pages</Text>
                <Text opacity={0.5} fontSize={16}>
                  {data?.total_pages}
                </Text>
              </HStack>
            </>
          )}
        </Box>

        <Box mt={5} mb={8}>
          <Heading fontSize={24}>Subject(s)</Heading>
          <Text opacity={0.6} mt={2}>
            {data?.subjects}
          </Text>
        </Box>
      </Box>
    </ScrollView>
  );
}