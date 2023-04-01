import { SQLError, SQLResultSet } from "expo-sqlite";
import { AlterTableData } from "../../types/database";
import { DATABASE_NAME, db } from "./config";
import { addAlters } from "./definitions/alters";
import { migrations } from "./definitions/migrations";

/*
 This contains the core database functionality, which is used by the application for critical things like migrations
 */

export async function executeQuery(query: string, params: any[] = []): Promise<SQLResultSet | SQLError> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => { tx.executeSql(query, params, (_, res) => { resolve(res); }); },
      (error) => reject(error)
    );
  });
};

export async function runMigration(migrateLegacyDB: (currentName: string) => Promise<void>) {
  await migrateLegacyDB(DATABASE_NAME);

  const enableForeignkeys = `PRAGMA foreign_keys = ON;`;
  const enableWritableSchema = `PRAGMA writable_schema = ON;`;

  const migrationTableQuery = `CREATE TABLE IF NOT EXISTS migrations
                                 (
                                     id         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                                     name       TEXT                              NOT NULL,
                                     created_at DATETIME                          NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 )`;

  db.transaction(
    (tx: any) => {
      tx.executeSql(enableForeignkeys);
      tx.executeSql(enableWritableSchema);
      tx.executeSql(migrationTableQuery);

      // Migrations
      migrations.forEach((migration) => {
        tx.executeSql(
          `SELECT name FROM migrations WHERE name = ?`,
          [migration.name],
          (tx: any, res: any) => {
            if (res.rows.length === 0) {
              tx.executeSql(migration.query);
              tx.executeSql(`INSERT INTO migrations (name) VALUES (?)`, [
                migration.name,
              ]);
            }
          }
        );
      });

      // Alters - ADD
      addAlters.forEach((stmt) => {
        const stmtID = `${stmt.table}.${stmt.column.name}`;
        tx.executeSql(`SELECT name FROM migrations WHERE name = ?`, [stmtID], async (tx: any, res: any) => {
          if (res.rows.length === 0) {
            await addColumnToTable(stmt);
            tx.executeSql(`INSERT INTO migrations (name) VALUES (?)`, [
              stmtID,
            ]);
          }
        }
        );
      });
    },
    (error) => console.log(error.message)
  );
};

export async function addColumnToTable(data: AlterTableData) {
  try {
    const columns = await executeQuery(`PRAGMA table_info(${data.table})`);
    const columnAlreadyExists = (columns as SQLResultSet).rows._array.some((col) => col.name == data.column.name);
    if (columnAlreadyExists) { return; }

    let stmt = `ALTER TABLE ${data.table} ADD COLUMN ${data.column.name} ${data.column.type}`;
    if (data.column.not_null) {
      stmt += " NOT NULL";
    }
    if (data.column.default?.trim() != null) {
      stmt += ` DEFAULT ${data.column.default}`;
    }
    await executeQuery(stmt);
  } catch (error: any) {
    console.log(error.message);
  }
};

export async function clearDatabase() {
  await executeQuery(`DELETE FROM files;`);
  await executeQuery(`DELETE FROM metadata;`);
};
