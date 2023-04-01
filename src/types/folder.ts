import { FolderModel } from "./database";

export interface Folder extends FolderModel {
  total_size: number;
  files_count: number;
}
