import { MigrationDefinition } from "../../../types/database";

export const migrations: MigrationDefinition[] = [
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
	{
		name: "create_folder_table",
		query: `CREATE TABLE IF NOT EXISTS folders
						(
							folder_id 				INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
							name 							TEXT 															NOT NULL DEFAULT 'Untitled folder',
							cover 						TEXT,
							is_locked 				BOOLEAN 													DEFAULT 0,
              last_synced       DATETIME,	
              created_at        DATETIME                         	NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at        DATETIME                         	NOT NULL DEFAULT CURRENT_TIMESTAMP
            )`,
	},
];
