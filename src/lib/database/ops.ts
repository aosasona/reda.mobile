import { SQLError, SQLResultSet } from "expo-sqlite";
import { Models, SelectOpts, SelectResult, TableName } from "../../types/database";
import { executeQuery } from "./core";


const defaultOpts = { select: "all", where: { fields: {}, condition: "OR" }, orderBy: {} } as any


async function select<T extends Models>(table: TableName<T>, opts: SelectOpts<T> = defaultOpts): Promise<SelectResult<Partial<T>[]>> {
	let { select, where, orderBy, limit } = opts
	select = select || "all", orderBy = orderBy || {}, limit = limit || 0;

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

	if (limit > 0) {
		query += ` LIMIT ${limit}`
	}

	const data: SelectResult<Partial<T>[]> = {
		data: [],
		count: 0,
		ok: false,
		_raw: {} as any,
		_sql: query
	}


	// Error doesn't need to bleed out,should be returned as part of result
	// TODO: base data return type on select value (low priority)
	try {
		const rawResult = await executeQuery(query, params)
		const result = rawResult as SQLResultSet;

		data.data = result?.rows?._array as Partial<T>[] || [];
		data.count = result?.rows?.length ?? 0
		data.ok = true;
		data._raw = rawResult

	} catch (e) {
		const rawResult = { message: (e as SQLError).message, code: (e as SQLError).code }
		data.error = rawResult.message
		data._raw = rawResult
	}

	return data
}

async function selectOne<T extends Models>(table: TableName<T>, opts: Omit<SelectOpts<T>, "limit"> = defaultOpts): Promise<SelectResult<Partial<T> | null>> {
	const res = await select<T>(table, { ...opts, limit: 1 })
	return {
		...res,
		data: res?.data?.[0] || null,
	}
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

export { select, selectOne, insert, update, del as delete } 
