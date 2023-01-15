import * as FileSystem from "expo-file-system";
import {SQLResultSet} from "expo-sqlite";
import {FileModel, MetadataModel, SQLBoolean} from "../../types/database";
import {del, executeQuery, saveFile} from "../../utils/database.util";
import {DEFAULT_REDA_DIRECTORY, extractFileName} from "../../utils/file.util";
import {filterSupportedFiles} from "../../utils/misc.util";
import {showToast} from "../../utils/notification.util";

// This will check all files in the database vs all files in the storage and delete the records where the files don't exist
export const removeMissingFileRecords = async () => {
	try {
		const paths = await executeQuery("SELECT id, path FROM files");
		if (!paths || (paths as SQLResultSet)?.rows?.length == 0) return;
		const data = (paths as SQLResultSet)?.rows?._array;
		if (!data) return;

		for (const item of data) {
			const relativePath = `${DEFAULT_REDA_DIRECTORY}${item.path}`;
			const {exists} = await FileSystem.getInfoAsync(relativePath);
			if (!exists) {
				await Promise.all([
					del({table: "files", identifier: "id", id: item.id}),
					del({table: "metadata", identifier: "file_id", id: item.id}),
				]);
			}
		}
	}
	catch (err) {
		return;
	}
};

// This will check for new files that haven't been added to the database
export const addNewFilesToDB = async () => {
	try {
		const allFiles = await FileSystem.readDirectoryAsync(
		  DEFAULT_REDA_DIRECTORY,
		);
		const files = filterSupportedFiles(allFiles);

		const res = await executeQuery("SELECT path FROM files");
		let savedFiles = (res as SQLResultSet)?.rows?._array || [];
		if (savedFiles.length > 0) {
			savedFiles = savedFiles.map((item) => item.path);
		}

		let syncedCount = 0;

		for (const file of files) {
			if (savedFiles.includes(encodeURIComponent(file))) continue;
			const fullPath = `${DEFAULT_REDA_DIRECTORY}${encodeURIComponent(file)}`;
			const {exists, size, isDirectory} = await FileSystem.getInfoAsync(
			  fullPath,
			);
			if (!exists || isDirectory) return;

			const filename = extractFileName(file);

			const file_data: FileModel = {
				name: filename,
				path: encodeURIComponent(file),
				size: size,
				has_started: SQLBoolean.FALSE,
				has_finished: SQLBoolean.FALSE,
				is_downloaded: SQLBoolean.FALSE,
				is_starred: SQLBoolean.FALSE,
			};

			const meta_data: MetadataModel = {
				image: "",
				description: "No description.",
				author: "Unknown author",
				raw: "[]",
				table_of_contents: "[]",
				subjects: "",
				first_publish_year: 0,
				book_key: "",
				chapters: 1,
				current_page: 1,
				total_pages: 1,
			};

			if (!(await saveFile(file_data, meta_data))) continue;
			syncedCount += 1;
		}

		if (syncedCount > 0) {
			showToast(
			  "Sync complete",
			  `Synced ${syncedCount} file${syncedCount > 1 ? "s" : ""}`,
			);
		}
	}
	catch (err) {
		return;
	}
};

export const syncLocalData = async () => {
	await removeMissingFileRecords();
	await addNewFilesToDB();
};

export const migrateLegacyDB = async (currentName: string) => {
	try {
		const legacyPath = `${DEFAULT_REDA_DIRECTORY}/SQLite/reda.db`;
		const currentPath = `${DEFAULT_REDA_DIRECTORY}/SQLite/${currentName}`;

		const {exists} = await FileSystem.getInfoAsync(
		  DEFAULT_REDA_DIRECTORY + "/SQLite/reda.db",
		);
		if (!exists) return;
		await FileSystem.moveAsync({
			from: legacyPath,
			to: currentPath,
		});
	}
	catch (err) {
	}
};