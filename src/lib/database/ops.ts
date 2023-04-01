import { SQLError, SQLResultSet } from "expo-sqlite";
import { Models, TableName } from "../../types/database";
import { executeQuery } from "./core";


export async function insert<T extends Models>(table: TableName<T>, data: T): Promise<SQLResultSet | SQLError> {
	const keys = Object.keys(data) as (keyof typeof data)[];
	const values = Object.values(data);

	const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")});`;

	return await executeQuery(query, values);
}


export async function update<T extends Models>(target: { table: TableName<T>; identifier: keyof T }, id: number, data: Partial<T>) {
	const { table, identifier } = target;
	const keys = Object.keys(data);
	const values = Object.values(data);
	const columns = keys.map((key: string, _) => `${key} = ?`).join(", ");

	const query = `UPDATE ${table} SET ${columns} WHERE ${identifier as string} = ?`;
	const replacement = [...values, id];

	return await executeQuery(query, replacement);
}


export async function del<T extends Models>(data: { table: TableName<T>; identifier: keyof T; id: number; }) {
	const query = `DELETE FROM ${data.table} WHERE ${data.identifier as string} = ?`;
	return await executeQuery(query, [data.id]);
}
