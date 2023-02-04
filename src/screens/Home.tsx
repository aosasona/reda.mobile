import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Box, Fab, Icon, ScrollView, SectionList, View } from "native-base";
import { useCallback, useState } from "react";
import { Alert, RefreshControl } from "react-native";
import HorizontalFileCard from "../components/cards/HorizontalFileCard";
import LargeHorizontalFileCard from "../components/cards/LargeHorizontalFileCard";
import LoadingHeader from "../components/loading/LoadingHeader";
import HomeSectionTitle from "../components/page/home/HomeSectionTitle";
import EmptySection from "../components/reusables/EmptySection";
import screens from "../constants/screens";
import { RedaService } from "../services/local";
import { CombinedFileResultType } from "../types/database";
import { CategoryPageType, ScreenProps } from "../types/general";

interface FlatDataState {
  title: string;
  category: CategoryPageType;
  data: CombinedFileResultType[];
}

export default function Home({ navigation }: ScreenProps) {
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<FlatDataState[]>([
    {
      title: "continue",
      category: CategoryPageType.CONTINUE_READING,
      data: [],
    },
    { title: "Recently added", category: CategoryPageType.ALL, data: [] },
    { title: "Starred", category: CategoryPageType.STARRED, data: [] },
  ]);

  useFocusEffect(
    useCallback(() => {
      (async () => await fetchAllFiles(false))();
      setInitialLoad(false);
      setLoading(false);
    }, [])
  );

  const fetchAllFiles = async (triggerLoad: boolean = true) => {
    try {
      if (triggerLoad) setLoading(true);
      const filesCount = await RedaService.count();
      setCount(filesCount);
      const { recentlyAdded, starred, continueReading } =
        await RedaService.loadHomePageData();
      setData((prevState) => [
        {
          ...prevState[0],
          data: continueReading || [],
        },
        {
          ...prevState[1],
          data: recentlyAdded || [],
        },
        {
          ...prevState[2],
          data: starred || [],
        },
      ]);
    } catch (e) {
      Alert.alert("Error", "An error occurred!");
    } finally {
      if (triggerLoad) setLoading(false);
    }
  };

  if (count == 0) {
    return (
      <View flex={1}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchAllFiles} />
          }
        >
          <EmptySection title="all" />
        </ScrollView>
        <Fab
          renderInPortal={false}
          shadow={3}
          bottom={6}
          right={6}
          _dark={{ bg: "light.100" }}
          _light={{ bg: "dark.900" }}
          icon={
            <Icon
              _dark={{ color: "dark.900" }}
              _light={{ color: "light.200" }}
              as={AntDesign}
              name="plus"
              size="2xl"
            />
          }
          onPress={() => navigation.navigate(screens.IMPORT.screenName)}
        />
      </View>
    );
  }

  return (
    <View flex={1}>
      <SectionList
        sections={data.map((d) => ({
          title: d.title,
          key: d.title,
          category: d.category,
          data: [
            {
              key: d.title,
              list: d.data,
            },
          ],
        }))}
        ListHeaderComponent={initialLoad && loading ? <LoadingHeader /> : null}
        ListFooterComponent={<Box bg="transparent" my={10} />}
        keyExtractor={(item, index) => item.key + index}
        renderSectionHeader={({ section }) =>
          section?.data?.[0]?.list?.length > 0 &&
            section.category !== CategoryPageType.CONTINUE_READING ? (
            <HomeSectionTitle
              title={section.title}
              category={section.category}
            />
          ) : null
        }
        renderItem={({ item, section, index }) =>
          item.list.length > 0 ? (
            <FlashList
              data={item.list}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) =>
                section.category === CategoryPageType.CONTINUE_READING ? (
                  <LargeHorizontalFileCard
                    key={`${index}-${item.id}-${item.created_at}`}
                    data={item}
                    index={index}
                    navigation={navigation}
                  />
                ) : (
                  <HorizontalFileCard
                    key={`${index}-${item.id}-${item.created_at}`}
                    data={item}
                    index={index}
                    navigation={navigation}
                  />
                )
              }
              ListEmptyComponent={<EmptySection title={item.key} />}
              decelerationRate="fast"
              pagingEnabled={true}
              estimatedItemSize={300}
            />
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchAllFiles} />
        }
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}
