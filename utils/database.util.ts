import * as SQLite from "expo-sqlite";
import {SQLError, SQLResultSet} from "expo-sqlite";

const DATABASE_NAME = 'reda.db';

export enum SQLBoolean {
	TRUE = 1,
	FALSE = 0,
}

export interface FileModel {
	name: string;
	path: string;
	size?: number;
	created_at?: string;
}

export interface MetadataModel {
	file_id?: number;
	name: string;
	image: string;
	description: string;
	author?: string;
	chapters?: number;
	current_page?: number;
	total_pages?: number;
	has_started?: SQLBoolean;
	has_finished?: SQLBoolean;
	created_at?: string;
	updated_at?: string;
}

export interface CombinedFileResultType {
	id: number;
	file_id: number;
	name: string;
	image: string;
	path: string;
	size: number;
	description: string;
	author: string;
	chapters: number;
	current_page: number;
	total_pages: number;
	has_started: SQLBoolean;
	has_finished: SQLBoolean;
	created_at: string;
	updated_at: string;
}


const db = SQLite.openDatabase(DATABASE_NAME, "1.0", "Local data store for Reda");

export const executeQuery = async (query: string, params: any[] = []): Promise<SQLResultSet | SQLError> => {

	return new Promise((resolve, reject) => {
		db.transaction((tx) => {
			tx.executeSql(query, params, (_, res) => {
				resolve(res);
			});
		}, (error) => reject(error));
	})
}

export const clearDatabase = async () => {
	await executeQuery("DELETE FROM files");
	await executeQuery("DELETE FROM metadata");
}


export const runMigration = async () => {

	const enablePragma = `PRAGMA foreign_keys = ON;`;

	const filesSQL = `
		CREATE TABLE IF NOT EXISTS files (
		    id				INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
		    name			TEXT NOT NULL,
		    path			TEXT NOT NULL,
		    size			INTEGER NOT NULL,
		    created_at 		DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
		);`

	const metadataSQL = `
		CREATE TABLE IF NOT EXISTS metadata (
			id 				INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			file_id 			INTEGER NOT NULL, 
			name 			TEXT NOT NULL DEFAULT 'Untitled', 
			image 			TEXT NOT NULL DEFAULT '', 
			description 	TEXT NOT NULL DEFAULT '', 
			author 			TEXT NOT NULL DEFAULT '', 
			chapters 		INTEGER NOT NULL DEFAULT 0, 
			current_page	INTEGER NOT NULL DEFAULT 1,
		    total_pages		INTEGER NOT NULL DEFAULT 1,
		    has_started		BOOLEAN NOT NULL DEFAULT 0,
		    has_finished		BOOLEAN NOT NULL DEFAULT 0,
			created_at 		DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
			updated_at 		DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (file_id) REFERENCES files(id)
		);`

	db.transaction((tx: any) => {
		tx.executeSql(enablePragma);
		tx.executeSql(filesSQL);
		tx.executeSql(metadataSQL);
	}, console.error);
}

export const insert = async (table: string, data: any) => {

	const keys = Object.keys(data);
	const values = Object.values(data);

	const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")});`;

	return await executeQuery(query, values);
}

export const saveFile = async (file: FileModel, meta: MetadataModel) => {
	try {
		const savedFile = await insert('files', file) as SQLResultSet;
		const {insertId} = savedFile;
		const savedMeta = await insert('metadata', {...meta, file_id: insertId}) as SQLResultSet;
		return {...savedFile.rows._array, meta: savedMeta.rows._array};
	}
	catch (e) {
		throw e;
	}
}

interface QueryFilter {
	limit: number;
	sort_by: "name" | "created_at";
	sort_order: "ASC" | "DESC";
}

export const getFiles = async (filter: QueryFilter = { limit: 25, sort_by: "created_at", sort_order: "DESC" }): Promise<CombinedFileResultType[]> => {
	try {
		const {limit, sort_by, sort_order} = filter;
		const query = `SELECT * FROM files f INNER JOIN metadata m ON f.id = m.file_id ORDER BY ${sort_by} ${sort_order} LIMIT ?;`;
		const result = await executeQuery(query, [limit]) as SQLResultSet | null;
		return result?.rows._array || [] as any[];
	}
	catch (e) {
		throw e;
	}
}

export const getFile = async (id: number) => {
	try {
		const query = `SELECT * FROM files f INNER JOIN metadata m ON f.id = m.file_id WHERE f.id = ?;`;
		return await executeQuery(query, [id]) as SQLResultSet | null;
	}
	catch (e) {
		throw e;
	}
}