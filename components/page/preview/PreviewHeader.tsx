import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  Pressable,
  Progress,
  Text,
  VStack,
} from "native-base";
import { ImageBackground, useWindowDimensions } from "react-native";
import { CombinedFileResultType } from "../../../types/database";

interface PreviewHeaderProps {
  source: any;
  defaultSource: any;
  data: CombinedFileResultType;
}

interface PreviewNavigationHeaderProps {
  data: CombinedFileResultType;
  navigation: NavigationProp<any>;
  functions: {
    handleToggleStar: () => Promise<void>;
    handleToggleReadStatus: () => Promise<void>;
    handleDelete: () => Promise<void>;
  };
}

export default function PreviewHeader({
  data,
  source,
  defaultSource,
}: PreviewHeaderProps) {
  const progress = Number(
    (data?.total_pages
      ? ((data?.current_page || 1) / data?.total_pages) * 100
      : 0
    )?.toFixed(0)
  );

  return (
    <AspectRatio w="full" ratio={0.95}>
      <ImageBackground
        source={source}
        defaultSource={defaultSource}
        resizeMode="cover"
      >
        <Box
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          bg="rgba(0,0,0,0.75)"
        />

        <Flex
          flex={1}
          justifyContent="space-between"
          alignItems="flex-start"
          px={4}
          pb={4}
        >
          <Box mt="auto">
            <VStack space={1}>
              <Heading color="white" fontSize={40} noOfLines={3} shadow={4}>
                {data?.name}
              </Heading>
              <Text
                color="muted.400"
                fontSize={14}
                fontWeight="medium"
                noOfLines={2}
                shadow={4}
                opacity={0.8}
              >
                {data?.author &&
                  data?.author?.toLowerCase() !== "unknown author"
                  ? data?.author?.toUpperCase()
                  : ""}
                {data?.first_publish_year
                  ? `, ${data?.first_publish_year}`
                  : ""}
              </Text>
            </VStack>
          </Box>
        </Flex>

        <Progress
          value={progress}
          rounded={0}
          colorScheme="emerald"
          _filledTrack={{ rounded: 0 }}
        />
      </ImageBackground>
    </AspectRatio>
  );
}

export function PreviewHeaderRight({
  data,
  navigation,
  functions,
}: PreviewNavigationHeaderProps) {
  const { width } = useWindowDimensions();
  const { handleDelete, handleToggleStar, handleToggleReadStatus } = functions;

  const menuWidth = width * 0.65;

  return (
    <HStack space={2} alignItems="center">
      <IconButton
        icon={
          <Icon as={AntDesign} name={data?.is_starred ? "star" : "staro"} />
        }
        _icon={{
          color: "yellow.400",
          size: 6,
        }}
        _pressed={{
          bg: "transparent",
          _icon: {
            opacity: 0.5,
          },
        }}
        p={2}
        m={0}
        onPress={handleToggleStar}
      />

      <Menu
        w={menuWidth < 200 ? 200 : menuWidth}
        trigger={(props) => (
          <IconButton
            icon={<Icon as={Entypo} name="dots-three-horizontal" />}
            _icon={{ size: 5, color: "white" }}
            _pressed={{ bg: "transparent", _icon: { opacity: 0.5 } }}
            p={2}
            m={0}
            {...props}
          />
        )}
      >
        <Menu.Item>
          <Pressable
            w="full"
            _pressed={{ opacity: 0.5 }}
            onPress={handleToggleReadStatus}
          >
            <HStack alignItems="center" space={2}>
              <Icon
                as={Feather}
                name={data?.has_started ? "eye-off" : "eye"}
                size={4}
              />
              <Text>Mark as {data?.has_started ? "unread" : "completed"}</Text>
            </HStack>
          </Pressable>
        </Menu.Item>
        <Menu.Item>
          <Pressable
            w="full"
            _pressed={{ opacity: 0.5 }}
            onPress={handleDelete}
          >
            <HStack alignItems="center" space={2}>
              <Icon as={Feather} name="trash" size={4} color="red.500" />
              <Text color="red.500">Delete</Text>
            </HStack>
          </Pressable>
        </Menu.Item>
      </Menu>
    </HStack>
  );
}
