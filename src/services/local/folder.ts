import { SQLResultSet } from "expo-sqlite";
import { executeQuery } from "../../lib/database/core";
import { Folder } from "../../types/folder";


export async function create(name: string): Promise<void> { }

export async function getAll(): Promise<Folder[]> {
  const query = `SELECT fd.*, SUM(fs.size) AS total_size, COUNT(fs.name) AS files_count FROM folders fd INNER JOIN files fs ON fs.folder_id = fd.folder_id GROUP BY fd.folder_id`

  const result = await executeQuery(query) as SQLResultSet

  return result?.rows?._array as Folder[]
}
