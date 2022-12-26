import {
  Feather,
  Foundation,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import constants from "expo-constants";
import {
  AspectRatio,
  Box,
  Divider,
  Heading,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
} from "native-base";
import { ReactNode, useContext } from "react";
import IconText from "../components/reusables/IconText";
import { DividerProps, HStackProps, PressableProps } from "../constants/props";
import { GlobalContext } from "../context/GlobalContext";
import SettingsUtil from "../utils/settings.util";
import { REDA_URL } from "../constants/url";
import { Linking } from "react-native";

export default function Settings() {
  const { toggleColorMode, colorMode } = useColorMode();
  const { state, dispatch } = useContext(GlobalContext);

  const settingsUtil = new SettingsUtil(dispatch);

  const handleSettingsReset = () => settingsUtil.resetSettings();

  const openRedaServicePage = (url: string) => {
    const uri = REDA_URL + url;
    Linking.openURL(uri);
  };
  const bg = useColorModeValue("brand-light", "brand-dark");
  const color = useColorModeValue("brand-dark", "brand-light");

  return (
    <ScrollView px={0} stickyHeaderIndices={[0]}>
      <Box bg={bg} px={3} py={3} safeAreaTop>
        <Heading fontSize={44}>Settings</Heading>
      </Box>

      <SettingsSection title="Configure Reda">
        <HStack {...HStackProps}>
          <IconText
            name={colorMode == "dark" ? "sun" : "moon"}
            text="Dark mode"
          />
          <Switch
            size="md"
            onTrackColor="green.500"
            onToggle={toggleColorMode}
            value={colorMode === "dark"}
          />
        </HStack>
        <Box>
          <Divider {...DividerProps} />
        </Box>
        <HStack {...HStackProps}>
          <IconText name="book-open" text="Single page" />
          <Switch
            size="md"
            onTrackColor="green.500"
            onToggle={settingsUtil.toggleSinglePageLayout}
            value={state.useSinglePageLayout}
          />
        </HStack>
      </SettingsSection>

      <SettingsSection title="About Reda">
        <Pressable
          onPress={() => openRedaServicePage("/releases")}
          {...PressableProps}
        >
          <HStack {...HStackProps}>
            <IconText
              as={MaterialCommunityIcons}
              name="new-box"
              text="Release notes"
            />
            <Icon as={Feather} name="arrow-up-right" size={4} />
          </HStack>
        </Pressable>
        <Box>
          <Divider {...DividerProps} />
        </Box>
        <Pressable
          onPress={() => openRedaServicePage("/privacy")}
          {...PressableProps}
        >
          <HStack {...HStackProps}>
            <IconText
              as={MaterialIcons}
              name="privacy-tip"
              text="Privacy policy"
            />
            <Icon as={Feather} name="arrow-up-right" size={4} />
          </HStack>
        </Pressable>
        <Box>
          <Divider {...DividerProps} />
        </Box>
        <Pressable
          onPress={() => openRedaServicePage("/terms")}
          {...PressableProps}
        >
          <HStack {...HStackProps}>
            <IconText name="book" text="Terms of service" />
            <Icon as={Feather} name="arrow-up-right" size={4} />
          </HStack>
        </Pressable>
      </SettingsSection>

      <SettingsSection title="App Controls">
        <Pressable onPress={handleSettingsReset} {...PressableProps}>
          <Box px={4} py={4}>
            <Text color="red.500">Reset settings</Text>
          </Box>
        </Pressable>
        <Box>
          <Divider {...DividerProps} />
        </Box>
        <Pressable onPress={settingsUtil.clearAllData} {...PressableProps}>
          <Box w="full" px={4} py={4}>
            <Text color="red.500">Clear data</Text>
          </Box>
        </Pressable>
      </SettingsSection>

      <Text
        textAlign="center"
        fontSize={13}
        color="gray.400"
        fontWeight={400}
        mt={10}
      >
        Version {constants?.manifest?.version}
      </Text>
    </ScrollView>
  );
}

const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Box mt={6}>
    <Text mb={2} px={4} opacity={0.5}>
      {title}
    </Text>
    <Box
      _dark={{ bg: "muted.900", borderColor: "muted.800" }}
      _light={{ bg: "muted.100", borderColor: "muted.200" }}
    >
      <Box>{children}</Box>
    </Box>
  </Box>
);