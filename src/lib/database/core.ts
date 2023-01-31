import { SQLError, SQLResultSet } from "expo-sqlite";
import { DATABASE_NAME, db } from "./config";
import { migrations } from "./definitions/migrations";

/*
 This contains the core database functionality, which is used by the application for critical things like migrations
 */

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

export const runMigration = async (
  migrateLegacyDB: (currentName: string) => Promise<void>
) => {
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
  await executeQuery(`DELETE
                        FROM files;`);
  await executeQuery(`DELETE
                        FROM metadata;`);
};
