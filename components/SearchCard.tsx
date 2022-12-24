import { NavigationProp } from "@react-navigation/native";
import {
  AspectRatio,
  Box,
  Heading,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
} from "native-base";
import { useWindowDimensions } from "react-native";
import screens from "../constants/screens";
import { CombinedFileResultType } from "../types/database";
import { getThumbnail } from "../utils/misc.util";
import ImagePlaceholder from "./ImagePlaceholder";

interface SearchCardProps {
  data: CombinedFileResultType;
  navigation: NavigationProp<any>;
}

export default function SearchCard({ data, navigation }: SearchCardProps) {
  const { width } = useWindowDimensions();

  const { thumb, fallback } = getThumbnail(data?.image);

  const navigateToDocumentPage = () => {
    navigation.navigate(screens.PREVIEW.screenName, { data });
  };

  return (
    <Pressable
      w={width}
      mb={2}
      _pressed={{ opacity: 0.6 }}
      onPress={navigateToDocumentPage}
    >
      <HStack w="full" bg="transparent" space={width * 0.02}>
        <Box w={width * 0.15}>
          <AspectRatio ratio={1}>
            {data?.image ? (
              <Image
                w="full"
                h="full"
                source={thumb}
                defaultSource={fallback}
                resizeMode="cover"
                alt={data?.name || ""}
                rounded={8}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </AspectRatio>
        </Box>
        <VStack
          w={width * 0.74}
          borderBottomWidth={1}
          _dark={{ borderBottomColor: "muted.900" }}
          _light={{ borderBottomColor: "muted.200" }}
          pt={0}
          p={1}
        >
          <Heading fontSize={20} noOfLines={1}>
            {data?.name}
          </Heading>
          <Text fontSize={14} opacity={0.3} noOfLines={1} mt="auto">
            {data?.author}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
}
