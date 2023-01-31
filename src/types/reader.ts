export interface SharedReaderProps {
  source: { url: string };
  page: number;
  onPageChange: (page: number) => void;
  onLoad: (total_pages: number) => void;
  onError: (error: any) => void;
}
