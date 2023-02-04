import { ColorMode } from "native-base";
import { CombinedFileResultType } from "./database";

export interface SharedReaderProps {
  data: CombinedFileResultType;
  source: { uri: string };
  colorMode: ColorMode;
  page: number;
  onPageChange: (page: number) => void;
  onLoad: (total_pages: number) => void;
  onError: (error: any) => void;
}
