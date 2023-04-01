import * as SQLite from "expo-sqlite";

export const DATABASE_NAME = ".reda.db";
export const db = SQLite.openDatabase(DATABASE_NAME, "1.0", "Local data store for Reda",);
