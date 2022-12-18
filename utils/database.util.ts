import * as SQLite from "expo-sqlite";
import { SQLError, SQLResultSet } from "expo-sqlite";
import { FileModel, MetadataModel } from "../types/database";

const DATABASE_NAME = "reda.db";

const db = SQLite.openDatabase(
	DATABASE_NAME,
	"1.0",
	"Local data store for Reda"
);

export const executeQuery = async (
	query: string,
	params: any[] = []
): Promise<SQLResultSet | SQLError> => {
	return new Promise((resolve, reject) => {
		db.transaction(
			(tx) => {
				tx.executeSql(query, params, (_, res) => {
					resolve(res);
				});
			},
			(error) => reject(error)
		);
	});
};

export const runMigration = async () => {
	interface MigrationDefinition {
		name: string;
		query: string;
	}

	const migrations: MigrationDefinition[] = [
		{
			name: "create_files_table",
			query: `
                CREATE TABLE IF NOT EXISTS files
                (
                    id            INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    name          TEXT                              NOT NULL DEFAULT 'Untitled',
                    path          TEXT                              NOT NULL,
                    size          INTEGER                           NOT NULL,
                    has_started   BOOLEAN                           NOT NULL DEFAULT 0,
                    has_finished  BOOLEAN                           NOT NULL DEFAULT 0,
                    is_downloaded BOOLEAN                           NOT NULL DEFAULT 0,
                    is_starred    BOOLEAN                           NOT NULL DEFAULT 0,
                    created_at    DATETIME                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT path_unique UNIQUE (path)
                )`,
		},
		{
			name: "create_metadata_table",
			query: `
                CREATE TABLE IF NOT EXISTS metadata
                (
                    id                 INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    file_id            INTEGER                           NOT NULL,
                    image              TEXT                              NOT NULL DEFAULT '',
                    description        TEXT                              NOT NULL DEFAULT '',
                    author             TEXT                              NOT NULL DEFAULT '',
                    raw                TEXT                              NOT NULL DEFAULT '',
                    table_of_contents  TEXT                              NOT NULL DEFAULT '',
                    subjects           TEXT                              NOT NULL DEFAULT '',
                    first_publish_year INTEGER                           NOT NULL DEFAULT '',
                    book_key           TEXT                              NOT NULL DEFAULT '',
                    chapters           INTEGER                           NOT NULL DEFAULT 1,
                    current_page       INTEGER                           NOT NULL DEFAULT 1,
                    total_pages        INTEGER                           NOT NULL DEFAULT 1,
                    created_at         DATETIME                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at         DATETIME                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (file_id) REFERENCES files (id)
                )`,
		},
	];
	const enablePragma = `PRAGMA foreign_keys = ON;`;

	const migrationTableQuery = `CREATE TABLE IF NOT EXISTS migrations
                                 (
                                     id         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                     name       TEXT                              NOT NULL,
                                     created_at DATETIME                          NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 )`;

	db.transaction(
		(tx: any) => {
			tx.executeSql(enablePragma);
			tx.executeSql(migrationTableQuery);
			migrations.forEach((migration) => {
				tx.executeSql(
					`SELECT *
                           FROM migrations
                           WHERE name = ?`,
					[migration.name],
					(tx: any, res: any) => {
						if (res.rows.length === 0) {
							tx.executeSql(migration.query);
							tx.executeSql(
								`INSERT INTO migrations (name)
                                   VALUES (?)`,
								[migration.name]
							);
						}
					}
				);
			});
		},
		(error) => console.log(error.message)
	);
};

export const clearDatabase = async () => {
	await executeQuery(`DROP TABLE IF EXISTS files;`);
	await executeQuery(`DROP TABLE IF EXISTS metadata;`);
	await executeQuery(`DROP TABLE IF EXISTS migrations;`);
	await runMigration();
};

export const insert = async (table: string, data: any) => {
	const keys = Object.keys(data);
	const values = Object.values(data);

	const query = `INSERT INTO ${table} (${keys.join(", ")})
                   VALUES (${keys.map(() => "?").join(", ")});`;

	return await executeQuery(query, values);
};

export const update = async (
	target: { table: string; identifier: string },
	id: number,
	data: any
) => {
	const { table, identifier } = target;
	const keys = Object.keys(data);
	const values = Object.values(data);
	const columns = keys.map((key: string, _) => `${key} = ?`).join(", ");

	const query = `UPDATE ${table} SET ${columns} WHERE ${identifier} = ?`;
	const replacement = [...values, id];

	return await executeQuery(query, replacement);
};

export const del = async (data: {
	table: string;
	identifier: string;
	id: number;
}) => {
	const query = `DELETE FROM ${data.table} WHERE ${data.identifier} = ?`;
	return await executeQuery(query, [data.id]);
};

export const saveFile = async (file: FileModel, meta: MetadataModel) => {
	try {
		const savedFile = (await insert("files", file)) as SQLResultSet;
		const { insertId } = savedFile;
		const savedMeta = (await insert("metadata", {
			...meta,
			file_id: insertId,
		})) as SQLResultSet;
		return { ...savedFile.rows._array, meta: savedMeta.rows._array };
	} catch (e) {
		throw e;
	}
};
