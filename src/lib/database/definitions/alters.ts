import { MigrationDefinition } from "../../../types/database";

export const alters: MigrationDefinition[] = [
  {
    name: "add_type_column",
    query: `ALTER TABLE files 
						ADD COLUMN file_type TEXT DEFAULT 'pdf';`,
  },
  {
    name: "add_folder_column",
    query: `ALTER TABLE files 
						ADD COLUMN folder_id INTEGER;`,
  },
  {
    name: "add_folder_id_index",
    query: `CREATE INDEX IF NOT EXISTS folder_id_idx 
						ON files (folder_id);`,
  },
];
