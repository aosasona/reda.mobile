import { SQLResultSet } from "expo-sqlite";
import { Alert } from "react-native";
import { CombinedFileResultType, QueryFilter } from "../types/database";
import { del, executeQuery } from "./database.util";
import { deleteFile } from "./file.util";

export interface HomePageData {
	recentlyAdded: CombinedFileResultType;
	starred: CombinedFileResultType;
	continueReading: CombinedFileResultType;
}

export class RedaService {
	private static readonly query = executeQuery;

	static async count(): Promise<number> {
		const query = `SELECT COUNT(*) as count
                       FROM files;`;
		const result = (await this.query(query)) as SQLResultSet | null;
		return result?.rows._array[0].count || 0;
	}

	static async loadHomePageData() {
		const [recentlyAdded, starred, continueReading] = await Promise.all([
			RedaService.getAll(),
			RedaService.getStarred(),
			RedaService.getContinueReading(),
		]);

		return { recentlyAdded, starred, continueReading };
	}

	static async getAll(
		filter: QueryFilter = {
			limit: 25,
			sort_by: "created_at",
			sort_order: "DESC",
		}
	): Promise<CombinedFileResultType[]> {
		const { limit, sort_by, sort_order } = filter;

		const query = `SELECT f.id,
                              f.name,
                              f.path,
                              f.size,
                              f.has_started,
                              f.has_finished,
                              f.is_downloaded,
                              f.is_starred,
                              f.created_at,
                              m.image,
                              m.description,
                              m.author,
                              m.table_of_contents,
                              m.subjects,
                              m.first_publish_year,
                              m.chapters,
                              m.current_page,
                              m.total_pages
                       FROM files f
                                INNER JOIN metadata m
                                           ON f.id = m.file_id
                       ORDER BY f.${sort_by} ${sort_order}
                       LIMIT ?;`;

		const result = (await this.query(query, [limit])) as SQLResultSet | null;
		const res = result?.rows._array || ([] as any[]);
		res.map((item: any) => {
			item.table_of_contents =
				item?.table_of_contents == "[]"
					? []
					: JSON.parse(item.table_of_contents);
		});
		return res;
	}

	static async getOne(id: number): Promise<CombinedFileResultType | null> {
		const query = `SELECT f.id,
                              f.name,
                              f.path,
                              f.size,
                              f.has_started,
                              f.has_finished,
                              f.is_downloaded,
                              f.is_starred,
                              f.created_at,
                              m.image,
                              m.description,
                              m.author,
                              m.table_of_contents,
                              m.subjects,
                              m.first_publish_year,
                              m.chapters,
                              m.current_page,
                              m.total_pages
                       FROM files f
                                INNER JOIN metadata m
                                           ON f.id = m.file_id
                       WHERE f.id = ?;`;
		const result = (await this.query(query, [id])) as SQLResultSet | null;
		const res = result?.rows._array || ([] as any[]);
		res[0].table_of_contents = JSON.parse(res[0].table_of_contents);
		return res[0];
	}

	static async getStarred(
		filter: QueryFilter = { limit: 25, sort_by: "name", sort_order: "DESC" }
	): Promise<CombinedFileResultType[] | null> {
		const { limit, sort_by, sort_order } = filter;

		const query = `SELECT f.id,
                              f.name,
                              f.path,
                              f.size,
                              f.has_started,
                              f.has_finished,
                              f.is_downloaded,
                              f.is_starred,
                              f.created_at,
                              m.image,
                              m.description,
                              m.author,
                              m.table_of_contents,
                              m.subjects,
                              m.first_publish_year,
                              m.chapters,
                              m.current_page,
                              m.total_pages
                       FROM files f
                                INNER JOIN metadata m
                                           ON f.id = m.file_id
                       WHERE f.is_starred = 1
                       ORDER BY f.${sort_by} ${sort_order}
                       LIMIT ?;`;
		const result = (await this.query(query, [limit])) as SQLResultSet | null;
		const res = result?.rows._array || ([] as any[]);
		res.map((item: any) => {
			item.table_of_contents = JSON.parse(item.table_of_contents);
		});
		return res;
	}

	static async getContinueReading(
		filter: QueryFilter = {
			limit: 25,
			sort_by: "created_at",
			sort_order: "DESC",
		}
	): Promise<CombinedFileResultType[]> {
		const { limit, sort_by, sort_order } = filter;

		const query = `SELECT f.id,
                              f.name,
                              f.path,
                              f.size,
                              f.has_started,
                              f.has_finished,
                              f.is_downloaded,
                              f.is_starred,
                              f.created_at,
                              m.image,
                              m.description,
                              m.author,
                              m.table_of_contents,
                              m.subjects,
                              m.first_publish_year,
                              m.chapters,
                              m.current_page,
                              m.total_pages
                       FROM files f
                                INNER JOIN metadata m
                                           ON f.id = m.file_id
                                WHERE has_started = 1
                       ORDER BY f.${sort_by} ${sort_order}
                       LIMIT ?;`;

		const result = (await this.query(query, [limit])) as SQLResultSet | null;
		const res = result?.rows._array || ([] as any[]);
		res.map((item: any) => {
			item.table_of_contents =
				item?.table_of_contents == "[]"
					? []
					: JSON.parse(item.table_of_contents);
		});
		return res;
	}
	static async toggleStar(id: number): Promise<void> {
		const query = `UPDATE files
                       SET is_starred = NOT is_starred
                       WHERE id = ?;`;
		await this.query(query, [id]);
	}

	static async deleteFile(id: number) {
		const file = await RedaService.getOne(id);
		if (!file) return;
		const delMetaDB = del({
			table: "metadata",
			identifier: "file_id",
			id: file.id,
		});
		const delFileDB = del({
			table: "files",
			identifier: "id",
			id: file.id,
		});
		const delFileStorage = deleteFile(file.path);
		await Promise.all([delMetaDB, delFileDB, delFileStorage]);
	}
}
