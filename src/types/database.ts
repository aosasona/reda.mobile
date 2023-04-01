import { SQLError, SQLResultSet } from "expo-sqlite";

export enum Table {
	FILES = "files",
	METADATA = "metadata",
	FOLDERS = "folders",
}

export enum FileType {
	PDF = "pdf",
	EPUB = "epub",
}

export enum ColumnType {
	TEXT = "TEXT",
	INTEGER = "INTEGER",
	BOOLEAN = "BOOLEAN",
	DATATIME = "DATETIME",
}

export enum SQLBoolean {
	TRUE = 1,
	FALSE = 0,
}

export type Models = FileModel | MetadataModel | FolderModel

export type TableName<T extends Models> = T extends FileModel ? "files" :
	T extends MetadataModel ? "metadata" :
	T extends FolderModel ? "folders" :
	never

export type WhereFields<T extends Models> = {
	[K in keyof T]: T[K];
}

export type OrderFields<T extends Models> = {
	[K in keyof T]: "DESC" | "ASC";
};

export type SelectOpts<T extends Models> = {
	select?: (keyof T)[] | "all";
	where?: {
		fields?: WhereFields<T> | {};
		condition?: "AND" | "OR";
	};
	limit?: number;
	orderBy?: OrderFields<T> | {};
}

export type SelectResult<U> = {
	data?: U;
	count: number;
	error?: string;
	ok: boolean;
	_raw: SQLResultSet | SQLError
	_sql: string;
}

export interface AlterTableData {
	table: Table;
	column: {
		name: string;
		type: ColumnType;
		not_null: boolean;
		default: string | null;
	};
}

export interface FileModel {
	id?: `${number}`;
	name: string;
	path: string;
	size: number;
	file_type?: FileType;
	folder_id?: number;
	current_cfi?: string;
	has_started: SQLBoolean;
	has_finished: SQLBoolean;
	is_starred: SQLBoolean;
	is_downloaded: SQLBoolean;
	created_at?: string;
}

export interface MetadataModel {
	id?: `${number}`;
	file_id?: number;
	image: string;
	description: string;
	author: string;
	raw?: string;
	table_of_contents?: string;
	subjects?: string;
	first_publish_year?: number;
	book_key?: string;
	chapters?: number;
	current_page?: number;
	total_pages?: number;
	created_at?: string;
	updated_at?: string;
}

export interface FolderModel {
	folder_id?: number;
	name: string;
	cover?: string;
	is_locked?: boolean;
	last_synced?: string;
	created_at?: string;
	updated_at?: string;
}

export interface CombinedFileResultType {
	id: number;
	file_id: MetadataModel["file_id"];
	name: FileModel["name"];
	image: MetadataModel["image"];
	current_cfi: FileModel["current_cfi"];
	file_type: FileModel["file_type"];
	path: FileModel["path"];
	size: FileModel["size"];
	description: MetadataModel["description"];
	table_of_contents: MetadataModel["table_of_contents"];
	subjects: MetadataModel["subjects"];
	first_publish_year: MetadataModel["first_publish_year"];
	author: MetadataModel["author"];
	chapters: MetadataModel["chapters"];
	current_page: number;
	total_pages: number;
	has_started: FileModel["has_started"];
	has_finished: FileModel["has_finished"];
	is_starred: FileModel["is_starred"];
	is_downloaded: FileModel["is_downloaded"];
	created_at: string;
	updated_at: string;
}

export interface QueryFilter {
	limit: number;
	sort_by: "name" | "created_at" | "updated_at";
	sort_order: "ASC" | "DESC";
}

export interface MigrationDefinition {
	name: string;
	query: string;
}
