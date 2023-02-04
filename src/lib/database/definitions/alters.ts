import { AlterTableData, ColumnType, Table } from "../../../types/database";

export const addAlters: AlterTableData[] = [
  {
    table: Table.FILES,
    column: {
      name: "file_type",
      type: ColumnType.TEXT,
      not_null: false,
      default: "pdf",
    },
  },
  {
    table: Table.FILES,
    column: {
      name: "folder_id",
      type: ColumnType.INTEGER,
      not_null: false,
      default: null,
    },
  },
  {
    table: Table.FILES,
    column: {
      name: "current_cfi",
      type: ColumnType.TEXT,
      not_null: false,
      default: null,
    },
  },
];
