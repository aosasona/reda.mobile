import { Text, View } from "native-base";
import { FileType } from "../../types/database";
import { SharedReaderProps } from "../../types/reader";
import PDFReader from "./PDF";
import EPUBReader from "./EPUB";
import { ReaderProvider } from "@epubjs-react-native/core";

interface ReaderProps extends SharedReaderProps { }

export default function Reader(props: ReaderProps) {
  if (props.data.file_type == FileType.PDF) {
    return <PDFReader {...props} />;
  }

  if (props.data.file_type == FileType.EPUB) {
    return (
      <ReaderProvider>
        <EPUBReader {...props} />
      </ReaderProvider>
    );
  }

  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <Text opacity={0.6}>No viewer available for this file format yet...</Text>
    </View>
  );
}
