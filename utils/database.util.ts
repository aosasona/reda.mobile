import {Asset} from "expo-asset";
import * as FileSystem from 'expo-file-system';
import * as SQLite from "expo-sqlite";
import {WebSQLDatabase} from "expo-sqlite";

const DATABASE_NAME = 'reda.db';
const DATABASE_LOCATION = "../data/" + DATABASE_NAME;
const DEVICE_DATABASE_LOCATION = FileSystem.documentDirectory + `SQLite/${DATABASE_NAME}`;

const loadDatabaseFromAssets = async () => {

	if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
		await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
	}
	await FileSystem.downloadAsync(
	  Asset.fromModule(require(DATABASE_LOCATION)).uri,
	  DEVICE_DATABASE_LOCATION,
	);
}

export const openDatabase = (): WebSQLDatabase => {
	loadDatabaseFromAssets().then().catch((e) => {throw e})
	return SQLite.openDatabase(DEVICE_DATABASE_LOCATION);
}

const db = openDatabase();

export const executeQuery = (query: string, params: any[] = []) => {
	let result: any = [];

	db.transaction((tx) => {
		tx.executeSql(
		  query,
		  params,
		  (_, {rows}) => {
			  result = rows;
			  console.log(JSON.stringify(rows))
		  },
		);
	});

	return result;
}

export const recordExists = async (table: string, key: string, value: string) => {
	const query = `SELECT * FROM ${table} WHERE ${key} = ?`;
	const result = executeQuery(query, [value]);
	return (result as any).length > 0;
}

export const runMigration = async () => {
	db.transaction((tx) => {
		tx.executeSql("CREATE TABLE IF NOT EXISTS files (id SERIAL PRIMARY KEY NOT NULL, name VARCHAR(255) NOT NULL, path VARCHAR(255) NOT NULL, size INTEGER NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
		tx.executeSql("CREATE TABLE metadata ( id INTEGER PRIMARY KEY AUTOINCREMENT, file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE, name STRING, image STRING NOT NULL DEFAULT '', description TEXT NOT NULL DEFAULT '', author STRING NOT NULL DEFAULT '', chapters INTEGER NOT NULL DEFAULT 0, pages INTEGER NOT NULL DEFAULT 0, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
		tx.executeSql("INSERT INTO metadata (name, image, description, author, chapters, pages) VALUES ('Reda', 'https://i.imgur.com/4Z0Z7Zm.png', 'Reda is a free and open source application that allows you to read your PDF files on your mobile device.', 'Reda Team', 0, 0)");
		tx.executeSql("SELECT * FROM metadata", [], (_, {rows}) => console.log(JSON.stringify(rows)));
	}, (e) => console.log(e), () => console.log("Migration completed"));
}

export const insert = async (table: string, data: any) => {
	const keys = Object.keys(data);
	const values = Object.values(data);
	const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.map(() => '?').join(', ')});`;
	return executeQuery(query, values);
}