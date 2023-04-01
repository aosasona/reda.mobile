import { SQLResultSet } from "expo-sqlite";
import CustomException from "../../exceptions/CustomException";
import { DatabaseOps } from "../../lib/database";
import { executeQuery } from "../../lib/database/core";
import { FolderModel } from "../../types/database";
import { Folder } from "../../types/folder";


export async function create(name: string): Promise<void> {
  if (name.length <= 3) throw new CustomException("Folder name is too short!")
  const { count } = await DatabaseOps.selectOne<FolderModel>("folders", { select: ["name"], where: { fields: { name: name?.trim() } } })
  if (count > 0) throw new CustomException(`${name} already exists!`)
  await DatabaseOps.insert<FolderModel>("folders", {
    name: name,
  })
}

export async function getAll(): Promise<Folder[]> {
  const query = `SELECT fd.*, COALESCE(SUM(fs.size), 0) AS total_size, COALESCE(COUNT(fs.name), 0) AS files_count FROM folders fd LEFT JOIN files fs ON fs.folder_id = fd.folder_id GROUP BY fd.folder_id`

  const result = await executeQuery(query) as SQLResultSet

  return result?.rows?._array as Folder[]
}
