import { SQLError, SQLResultSet } from "expo-sqlite";
import { Models, SelectOpts, TableName } from "../../types/database";
import { executeQuery } from "./core";


async function select<T extends Models>(table: TableName<T>, opts: SelectOpts<T> = { select: "all", where: { fields: {}, condition: "OR" }, orderBy: {} }): Promise<Partial<T> | null> {
	let { select, where, orderBy } = opts
	select = select || "all", orderBy = orderBy || {};

	const whereFields = where?.fields || {};
	const whereCondition = where?.condition || "AND"

	const whereKeys = Object.keys(whereFields)
	const orderKeys = Object.keys(orderBy)

	const selectedFields = typeof select == "string" ? "*" : select.join(", ");
	let query = `SELECT ${selectedFields} FROM ${table}`

	let whereClause = "WHERE ";
	const params: any[] = []
	if (whereKeys.length > 0) {
		const splitWhere = whereKeys.map((key) => {
			params.push(whereFields?.[key as keyof typeof whereFields])
			return `${key} = ?`
		})
		whereClause += splitWhere.join(` ${whereCondition} `)
		query += ` ${whereClause}`
	}

	let orderClause = "ORDER BY ";
	if (orderKeys.length > 0) {
		const splitOrder = orderKeys.map((key) => `${key} ${orderBy?.[key as keyof typeof orderBy]}`)
		orderClause += splitOrder.join(`, `)
		query += ` ${orderClause}`
	}

	// TODO: Run query and extract result

	return null
}


async function insert<T extends Models>(table: TableName<T>, data: T): Promise<SQLResultSet | SQLError> {
	const keys = Object.keys(data) as (keyof typeof data)[];
	const values = Object.values(data);

	const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")});`;

	return await executeQuery(query, values);
}


async function update<T extends Models>(target: { table: TableName<T>; identifier: keyof T }, id: number, data: Partial<T>) {
	const { table, identifier } = target;
	const keys = Object.keys(data);
	const values = Object.values(data);
	const columns = keys.map((key: string, _) => `${key} = ?`).join(", ");

	const query = `UPDATE ${table} SET ${columns} WHERE ${identifier as string} = ?`;
	const replacement = [...values, id];

	return await executeQuery(query, replacement);
}


async function del<T extends Models>(data: { table: TableName<T>; identifier: keyof T; id: number; }) {
	const query = `DELETE FROM ${data.table} WHERE ${data.identifier as string} = ?`;
	return await executeQuery(query, [data.id]);
}

export { select, insert, update, del as delete } 
