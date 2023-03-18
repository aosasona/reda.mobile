import { SQLError, SQLResultSet } from "expo-sqlite";
import { executeQuery } from "./core";

export async function insert<T extends {}>(
	table: string,
	data: T
): Promise<SQLResultSet | SQLError> {
	const keys = Object.keys(data);
	const values = Object.values(data);

	const query = `INSERT INTO ${table} (${keys.join(", ")})
                   VALUES (${keys.map(() => "?").join(", ")});`;

	return await executeQuery(query, values);
}
export async function update<T>(
	target: { table: string; identifier: keyof T },
	id: number,
	data: Partial<T>
) {
	const { table, identifier } = target;
	const keys = Object.keys(data);
	const values = Object.values(data);
	const columns = keys.map((key: string, _) => `${key} = ?`).join(", ");

	const query = `UPDATE ${table}
                   SET ${columns}
                   WHERE ${identifier as string} = ?`;
	const replacement = [...values, id];

	return await executeQuery(query, replacement);
}
export async function del(data: {
	table: string;
	identifier: string;
	id: number;
}) {
	const query = `DELETE
                   FROM ${data.table}
                   WHERE ${data.identifier} = ?`;
	return await executeQuery(query, [data.id]);
}
