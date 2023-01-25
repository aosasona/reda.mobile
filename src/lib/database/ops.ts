import {executeQuery} from "./core";

export const insert = async (table: string, data: any) => {
	const keys = Object.keys(data);
	const values = Object.values(data);

	const query = `INSERT INTO ${table} (${keys.join(", ")})
                   VALUES (${keys.map(() => "?").join(", ")});`;

	return await executeQuery(query, values);
};
export const update = async (
  target: { table: string; identifier: string },
  id: number,
  data: any,
) => {
	const {table, identifier} = target;
	const keys = Object.keys(data);
	const values = Object.values(data);
	const columns = keys.map((key: string, _) => `${key} = ?`).join(", ");

	const query = `UPDATE ${table}
                   SET ${columns}
                   WHERE ${identifier} = ?`;
	const replacement = [...values, id];

	return await executeQuery(query, replacement);
};
export const del = async (data: {
	table: string;
	identifier: string;
	id: number;
}) => {
	const query = `DELETE
                   FROM ${data.table}
                   WHERE ${data.identifier} = ?`;
	return await executeQuery(query, [data.id]);
};