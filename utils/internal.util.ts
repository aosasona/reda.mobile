import {SQLResultSet} from "expo-sqlite";
import {CombinedFileResultType, QueryFilter} from "../types/database";
import {executeQuery} from "./database.util";

export class RedaService {
	private static readonly query = executeQuery;

	static async getAll(filter: QueryFilter = {limit: 25, sort_by: "created_at", sort_order: "DESC"}): Promise<CombinedFileResultType[]> {
		try {
			const {limit, sort_by, sort_order} = filter;

			const query = `SELECT 
	            f.id, f.name, f.path, f.size, f.has_started, f.has_finished, f.is_downloaded, f.is_starred, f.created_at,
	            m.image, m.description, m.author, m.table_of_contents, m.subjects, m.first_publish_year, m.chapters, m.current_page, m.total_pages
		    FROM files f 
		        INNER JOIN metadata m 
		            ON f.id = m.file_id 
		    ORDER BY f.${sort_by} ${sort_order} LIMIT ?;`;

			const result = await this.query(query, [limit]) as SQLResultSet | null;
			const res = result?.rows._array || [] as any[];
			res.map((item: any) => {
				item.table_of_contents = item?.table_of_contents == "[]" ? [] : JSON.parse(item.table_of_contents);
			})
			return res;
		}
		catch (e) {
			throw e;
		}
	}

	static async getOne(id: number): Promise<CombinedFileResultType | null> {
		try {
			const query = `SELECT
                           f.id, f.name, f.path, f.size, f.has_started, f.has_finished, f.is_downloaded, f.is_starred, f.created_at,
                           m.image, m.description, m.author, m.table_of_contents, m.subjects, m.first_publish_year, m.chapters, m.current_page, m.total_pages
    			FROM files f 
    			    INNER JOIN metadata m 
    			        ON f.id = m.file_id 
    			WHERE f.id = ?;`;
			const result = await this.query(query, [id]) as SQLResultSet | null;
			const res = result?.rows._array || [] as any[];
			res[0].table_of_contents = JSON.parse(res[0].table_of_contents);
			return res[0];
		}
		catch (e) {
			throw e;
		}
	}
}