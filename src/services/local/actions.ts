import { Alert } from "react-native";
import { executeQuery } from "../../lib/database/core";
import { update } from "../../lib/database/ops";
import { generateTimestamp } from "../../lib/misc";
import { FileModel, MetadataModel, SQLBoolean } from "../../types/database";
import { getAll, getContinueReading, getOne, getStarred } from "./file";

export async function getHomepageData() {
  const [recentlyAdded, starred, continueReading] = await Promise.all([getAll(), getStarred(), getContinueReading()]);
  return { recentlyAdded, starred, continueReading } as const;
}


export async function toggleStar(id: number): Promise<void> {
  const query = `UPDATE files SET is_starred = NOT is_starred WHERE id = ?;`;
  await Promise.all([
    executeQuery(query, [id]),
    update<MetadataModel>({ table: "metadata", identifier: "file_id" }, id, {
      updated_at: generateTimestamp(),
    }),
  ]);
}


export async function updateTotalPagesOnLoad(id: number, totalPageNumber: number) {
  try {
    const file = await getOne(id);
    if (!file) return;
    if (file.total_pages == totalPageNumber) return;
    await update<MetadataModel>({ table: "metadata", identifier: "file_id" }, id, { total_pages: totalPageNumber });
  } catch (err) {
    Alert.alert("Error", "Something went wrong! Close the app and try again.");
  }
}


export async function toggleReadStatus(id: number): Promise<void> {
  const file = await getOne(id);
  if (!file) return;
  const new_current_page = file?.has_started ? 1 : file?.total_pages;
  const new_has_started = !Boolean(file?.has_started);
  await Promise.all([
    update<MetadataModel>({ table: "metadata", identifier: "file_id" }, id, { current_page: new_current_page }),
    update<FileModel>({ table: "files", identifier: "id" }, id, { has_started: new_has_started as unknown as SQLBoolean }),
  ]);
}


export async function saveCurrentPage(id: number, currentPageNumber: number) {
  try {
    const file = await getOne(id);

    if (!file) return;

    if (file.current_page > file.total_pages || file.current_page > currentPageNumber || file?.has_finished == 1) return;

    if (!file.has_started && currentPageNumber > 1) {
      await update<FileModel>({ table: "files", identifier: "id" }, id, { has_started: SQLBoolean.TRUE, });
    }
    await update<MetadataModel>(
      { table: "metadata", identifier: "file_id" },
      id,
      { current_page: currentPageNumber, updated_at: generateTimestamp(), }
    );
  } catch (err: unknown) {
    Alert.alert(
      "Error",
      "Something went wrong. Close the app and try again."
    );
  }
}
