import { SQLResultSet } from "expo-sqlite";
import { FileModel, MetadataModel } from "../../types/database";
import { insert, update } from "./ops";

export async function save(file: FileModel, meta: MetadataModel): Promise<{ id: number }> {
  try {
    const savedFile = (await insert<FileModel>("files", file)) as SQLResultSet;
    const { insertId } = savedFile;
    (await insert<MetadataModel>("metadata", { ...meta, file_id: insertId, })) as SQLResultSet;
    return { id: insertId || 0 };
  } catch (e) { throw e; }
};

export async function updateCfi(id: number, cfi: string) {
  try {
    await update<FileModel>({ table: "files", identifier: "id" }, id, { current_cfi: cfi, });
  } catch (err) { }
};
