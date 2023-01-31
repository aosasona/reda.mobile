import { SharedReaderProps } from "../../types/reader";
import Pdf from "react-native-pdf";
import { useWindowDimensions } from "react-native";
import { useContext } from "react";
import { SettingsContext } from "../../context/settings/SettingsContext";
import { colors } from "../../config/theme";

export default function PDFReader({
  data,
  source,
  colorMode,
  onLoad,
  onError,
  onPageChange,
}: SharedReaderProps) {
  const { state: settingsState } = useContext(SettingsContext);
  const { width, height } = useWindowDimensions();

  const isDark = colorMode === "dark";

  return (
    <Pdf
      source={source}
      page={data?.current_page || 1}
      enablePaging={settingsState.useSinglePageLayout}
      horizontal={settingsState.useSinglePageLayout}
      enableAntialiasing={true}
      enableAnnotationRendering={false}
      onLoadComplete={onLoad}
      onPageChanged={onPageChange}
      onError={onError}
      style={{
        flex: 1,
        width,
        height,
        backgroundColor: isDark ? colors.dark["900"] : colors.light["200"],
      }}
    />
  );
}
