export enum Table {
	FILES = "files",
	METADATA = "metadata",
	FOLDERS = "folders",
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
	name: string;
	path: string;
	size: number;
	has_started: SQLBoolean;
	has_finished: SQLBoolean;
	is_starred: SQLBoolean;
	is_downloaded: SQLBoolean;
	created_at?: string;
}

export interface MetadataModel {
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

export interface CombinedFileResultType {
	id: number;
	file_id: MetadataModel["file_id"];
	name: FileModel["name"];
	image: MetadataModel["image"];
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
