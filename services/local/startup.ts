import * as FileSystem from "expo-file-system";
import { SQLError, SQLResultSet } from "expo-sqlite";
import { executeQuery } from "../../utils/database.util";
import { DEFAULT_REDA_DIRECTORY } from "../../utils/file.util";

// This will check all files in the database vs all files in the storage and delete the records where the files don't exist
export const removeMissingFileRecords = async () => {
	try {
		const paths = await executeQuery("SELECT id, path FROM files");
		if (!paths || (paths as SQLResultSet)?.rows?.length == 0) return;
		const data = (paths as SQLResultSet)?.rows?._array;
		console.log(data);
	} catch (err) {
		return;
	}
};
// This will check for new files that haven't been added to the database
export const addNewFilesToDB = async () => { };
export const syncLocalData = async () => {
	await removeMissingFileRecords();
	await addNewFilesToDB();
};
export const migrateLegacyDB = async (currentName: string) => {
	try {
		const legacyPath = `${DEFAULT_REDA_DIRECTORY}/SQLite/reda.db`;
		const currentPath = `${DEFAULT_REDA_DIRECTORY}/SQLite/${currentName}`;

		const { exists } = await FileSystem.getInfoAsync(
			DEFAULT_REDA_DIRECTORY + "/SQLite/reda.db"
		);
		if (!exists) return;
		await FileSystem.moveAsync({
			from: legacyPath,
			to: currentPath,
		});
	} catch (err) { }
};
