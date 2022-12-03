import {Asset} from "expo-asset";
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'reda.db';
const DATABASE_LOCATION = "../data/" + DATABASE_NAME;

export const openDatabase = async () => {
	const pathToDatabaseFile = FileSystem.documentDirectory + DATABASE_LOCATION;
	if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
		await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
	}
	await FileSystem.downloadAsync(
	  Asset.fromModule(require(pathToDatabaseFile)).uri,
	  FileSystem.documentDirectory + `SQLite/${DATABASE_NAME}`,
	);
	return SQLite.openDatabase(DATABASE_NAME);
}

export const db = (async () => await openDatabase())();

export const executeQuery = async (query: string, params: any[] = []) => {
	const db = await openDatabase();
	return new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(
			  query,
			  params,
			  (_, {rows: {_array}}) => resolve(_array),
			  (_, error) => false,
			);
		});
	});
}