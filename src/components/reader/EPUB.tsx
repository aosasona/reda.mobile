import { Reader, Theme, useReader } from "@epubjs-react-native/core";
import { SafeAreaView, useWindowDimensions } from "react-native";
import { SharedReaderProps } from "../../types/reader";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import * as RNFS from "react-native-fs";
import { useEffect, useMemo, useState } from "react";
import { colors } from "../../config/theme";
import { Spinner, useColorMode, View } from "native-base";
import { ViewProps } from "../../config/props";
import { updateCfi } from "../../lib/database/file";
import { showToast } from "../../lib/notification";

export default function Epub({
  data,
  onLoad,
  onPageChange,
}: SharedReaderProps) {
  const { colorMode } = useColorMode();
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");

  const reader = useReader();

  useMemo(() => {
    RNFS.readFile(data.path, "base64")
      .then(setContent)
      .catch((err) => console.error("RNFS ERROR:", err))
      .finally(() => setLoading(false));
  }, [data]);

  const onChange = async (total: number) => {
    try {
      const current = reader.getCurrentLocation();
      const page = current?.start?.location || 1;
      const cfi = current?.start?.cfi;
      onPageChange(page || 1);
      if (cfi && page > data?.current_page) {
        await updateCfi(data.id, cfi);
      }
      if (total > 0 && data.total_pages <= 1) {
        onLoad(total);
      }
    } catch (err) {
      showToast("Error", "Something went wrong!", "error");
    }
  };

  if (loading) return <Loading />;

  const bg = colorMode == "dark" ? colors.dark["900"] : colors.light["200"];
  const color = colorMode == "dark" ? "white" : "black";

  const theme: Theme = {
    body: { background: bg, color: color },
    span: { color: color },
    p: { color: color },
    li: { color: color },
    a: { color: `${colors.primary} !important`, "text-decoration": "none" },
    "a:link": { color: colors.primary },
    "::selection": {
      background: colors.primary,
    },
  };

  return (
    <View flex={1} mb={20}>
      <Reader
        src={content}
        width={width}
        height={height * 0.78}
        initialLocation={data?.current_cfi || ""}
        fileSystem={useFileSystem}
        enableSelection={true}
        onLocationChange={async (total, _, __) => await onChange(total)}
        renderLoadingFileComponent={Loading}
        renderOpeningBookComponent={Loading}
        defaultTheme={theme}
      />
    </View>
  );
}

export function Loading() {
  return (
    <View flex={1} {...ViewProps}>
      <Spinner />
    </View>
  );
}
