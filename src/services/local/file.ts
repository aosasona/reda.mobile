import { NavigationProp } from "@react-navigation/native";
import { SQLResultSet } from "expo-sqlite";
import { Alert } from "react-native";
import { DEFAULT_REDA_DIRECTORY } from "../../constants/file";
import { DatabaseOps } from "../../lib/database";
import { executeQuery } from "../../lib/database/core";
import { deleteFileFromFS } from "../../lib/file/ops";
import { CombinedFileResultType, FileModel, MetadataModel, QueryFilter } from "../../types/database";


const FETCH_QUERY_FIELDS = `f.id, f.name, "${DEFAULT_REDA_DIRECTORY}" || f.path as path, f.current_cfi, f.file_type, f.size, f.has_started, f.has_finished, f.is_downloaded, f.is_starred, m.image, m.description, m.author, m.table_of_contents, m.subjects, m.first_publish_year, m.chapters, m.current_page, m.total_pages, m.created_at, m.updated_at`;

export function extractResults(data: SQLResultSet | null): CombinedFileResultType[] {
  return data?.rows._array || ([] as any[]);
}


export async function getOne(id: number): Promise<CombinedFileResultType | null> {
  const query = `SELECT ${FETCH_QUERY_FIELDS} FROM files f INNER JOIN metadata m ON f.id = m.file_id WHERE f.id = ?;`;
  const result = (await executeQuery(query, [id])) as SQLResultSet | null;
  const res = result?.rows._array || ([] as any[]);
  return res[0];
}


export async function getAll(
  filter: QueryFilter = {
    limit: 25,
    sort_by: "created_at",
    sort_order: "DESC",
  }
): Promise<CombinedFileResultType[]> {
  const { limit, sort_by, sort_order } = filter;

  const query = `SELECT ${FETCH_QUERY_FIELDS} FROM files f INNER JOIN metadata m ON f.id = m.file_id ORDER BY f.${sort_by} ${sort_order} LIMIT ?;`;

  const result = (await executeQuery(query, [limit])) as SQLResultSet | null;
  return extractResults(result);
}


export async function getStarred(filter: QueryFilter = { limit: 25, sort_by: "updated_at", sort_order: "DESC", }): Promise<CombinedFileResultType[] | null> {
  const { limit, sort_by, sort_order } = filter;

  const query = `SELECT ${FETCH_QUERY_FIELDS} FROM files f INNER JOIN metadata m ON f.id = m.file_id WHERE f.is_starred = 1 ORDER BY ${sort_by != "name" ? "m" : "f"}.${sort_by} ${sort_order} LIMIT ?;`;
  const result = (await executeQuery(query, [limit])) as SQLResultSet | null;
  return extractResults(result);
}


export async function getContinueReading(filter: QueryFilter = { limit: 25, sort_by: "updated_at", sort_order: "DESC", }): Promise<CombinedFileResultType[]> {
  const { limit, sort_by, sort_order } = filter;

  const query = `SELECT ${FETCH_QUERY_FIELDS} FROM files f INNER JOIN metadata m ON f.id = m.file_id WHERE has_started = 1 ORDER BY ${sort_by != "name" ? "m" : "f"}.${sort_by} ${sort_order} LIMIT ?;`;
  const result = (await executeQuery(query, [limit])) as SQLResultSet | null;
  return extractResults(result);
}


export async function deleteFile(id: number, navigation: NavigationProp<any>) {
  const file = await getOne(id);
  if (!file) return;
  Alert.alert("Confirm", `Are you sure you want to delete ${file?.name || ""}?`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "destructive",
        onPress: () => {
          Promise.all([
            DatabaseOps.delete<MetadataModel>({ table: "metadata", identifier: "file_id", id: file.id }),
            DatabaseOps.delete<FileModel>({ table: "files", identifier: "id", id: file.id }),
            deleteFileFromFS(file.path),
          ])
            .then(() => navigation.goBack())
            .catch((_) => Alert.alert("Error", "Failed to delete!"));
        },
      },
    ]
  );
}


export async function search(keyword: string, filter: QueryFilter = { limit: 100, sort_by: "created_at", sort_order: "ASC", }): Promise<CombinedFileResultType[]> {
  const { limit, sort_by, sort_order } = filter;

  const query = `SELECT ${FETCH_QUERY_FIELDS} FROM files f INNER JOIN metadata m ON f.id = m.file_id WHERE f.name LIKE ? OR m.description LIKE ? OR m.subjects LIKE ? OR m.author LIKE ? ORDER BY f.${sort_by} ${sort_order} LIMIT ?;`;

  const result = (await executeQuery(query, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, limit,])) as SQLResultSet | null;
  let res = result?.rows._array || ([] as any[]);
  res.map((item: any) => {
    item.table_of_contents = item?.table_of_contents == "[]" ? [] : JSON.parse(item.table_of_contents);
  });
  return res;
}



export async function rename(id: number, name: string): Promise<void> {
  await DatabaseOps.update<FileModel>({ table: "files", identifier: "id" }, id, { name });
}


export async function changeAuthor(id: number, author: string): Promise<void> {
  await DatabaseOps.update<MetadataModel>({ table: "metadata", identifier: "id" }, id, { author });
}


export async function count(): Promise<number> {
  const query = `SELECT COUNT(*) as count FROM files;`;
  const result = (await executeQuery(query)) as SQLResultSet | null;
  return result?.rows._array[0].count || 0;
}
