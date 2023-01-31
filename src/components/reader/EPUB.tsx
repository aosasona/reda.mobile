import { ReaderProvider, Reader } from "@epubjs-react-native/core";
import { useWindowDimensions } from "react-native";
import { SharedReaderProps } from "../../types/reader";
import { useFileSystem } from "@epubjs-react-native/expo-file-system";
import * as RNFS from "react-native-fs";
import { useMemo, useState } from "react";
import { colors } from "../../config/theme";
import { useColorMode } from "native-base";

export default function Epub({ data, onLoad }: SharedReaderProps) {
  const { colorMode } = useColorMode();
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");

  useMemo(() => {
    RNFS.readFile(data.path, "base64")
      .then(setContent)
      .catch((err) => console.error("RNFS ERROR:", err))
      .finally(() => setLoading(false));
  }, [data]);

  if (loading) return null;

  const bg = colorMode == "dark" ? colors.dark["900"] : colors.light["200"];
  const color = colorMode == "light" ? colors.dark["900"] : colors.light["200"];

  return (
    <ReaderProvider>
      <Reader
        src={content}
        width={width}
        height={height}
        fileSystem={useFileSystem}
        defaultTheme={{
          body: { backGround: bg, color: color },
        }}
      />
    </ReaderProvider>
  );
}
