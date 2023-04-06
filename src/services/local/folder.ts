import { SQLResultSet } from "expo-sqlite";
import CustomException from "../../exceptions/CustomException";
import { DatabaseOps } from "../../lib/database";
import { executeQuery } from "../../lib/database/core";
import { FolderModel } from "../../types/database";
import { Folder } from "../../types/folder";


export async function create(name: string): Promise<void> {
  if (name.length < 3) throw new CustomException("Folder name is too short!")
  const { count } = await DatabaseOps.selectOne<FolderModel>("folders", { select: ["name"], where: { fields: { name: name?.trim() } } })
  if (count > 0) throw new CustomException("Folder already exists!")
  await DatabaseOps.insert<FolderModel>("folders", {
    name: name,
  })
}


export async function getAll(): Promise<Folder[]> {
  const query = `SELECT fd.*, COALESCE(SUM(fs.size), 0) AS total_size, COALESCE(COUNT(fs.name), 0) AS files_count FROM folders fd LEFT JOIN files fs ON fs.folder_id = fd.folder_id GROUP BY fd.folder_id ORDER BY fd.name ASC`
  const result = await executeQuery(query) as SQLResultSet
  return result?.rows?._array as Folder[]
}


export async function rename(folder_id: number, name: string) {
  if (name.length < 3) throw new CustomException("Folder name is too short!")
  const { count } = await DatabaseOps.selectOne<FolderModel>("folders", { select: ["name"], where: { fields: { name: name?.trim() } } })
  if (count > 0) return
  return await DatabaseOps.update<FolderModel>({ table: "folders", identifier: "folder_id" }, folder_id, { name })
}

export async function deleteFolder(folder_id: number) {
  // unlink all files first and proceed to delete folder
  if (await executeQuery("UPDATE files SET folder_id = NULL WHERE folder_id = ?", [folder_id])) {
    return await DatabaseOps.delete<FolderModel>({ table: "folders", identifier: "folder_id", id: folder_id })
  }
}
