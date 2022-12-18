import { NavigationProp } from "@react-navigation/native";
import { SQLResultSet } from "expo-sqlite";
import { Alert } from "react-native";
import {
	CombinedFileResultType,
	QueryFilter,
	SQLBoolean,
} from "../types/database";
import { del, executeQuery, update } from "./database.util";
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
			sort_by: "name",
			sort_order: "ASC",
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

	static async updateTotalPagesOnLoad(id: number, totalPageNumber: number) {
		try {
			const file = await RedaService.getOne(id);
			if (!file) return;
			if (file.total_pages == totalPageNumber) return;
			await update({ table: "metadata", identifier: "file_id" }, id, {
				total_pages: totalPageNumber,
			});
		} catch (err) {
			Alert.alert(
				"Error",
				"Something went wrong! Close the app and try again."
			);
		}
	}

	static async saveCurrentPage(id: number, currentPageNumber: number) {
		try {
			const file = await RedaService.getOne(id);
			if (!file) return;
			if (
				file.current_page > file.total_pages ||
				file.current_page > currentPageNumber ||
				file?.has_finished == 1
			)
				return;
			if (!file.has_started && currentPageNumber > 1) {
				await update({ table: "files", identifier: "id" }, id, {
					has_started: SQLBoolean.TRUE,
				});
			}
			await update({ table: "metadata", identifier: "file_id" }, id, {
				current_page: currentPageNumber,
			});
		} catch (err: unknown) {
			Alert.alert("Error", "Something went wrong. Close app and try again.");
		}
	}

	static async deleteFile(id: number, navigation: NavigationProp<any>) {
		const file = await RedaService.getOne(id);
		if (!file) return;
		Alert.alert(
			"Confirm",
			`Are you sure you want to delete ${file?.name || ""}?`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Confirm",
					style: "destructive",
					onPress: () => {
						Promise.all([
							del({ table: "metadata", identifier: "file_id", id: file.id }),
							del({ table: "files", identifier: "id", id: file.id }),
							deleteFile(file.path),
						])
							.then(() => navigation.goBack())
							.catch((e) => Alert.alert("Error", "Failed to delete!"));
					},
				},
			]
		);
	}

	static async search(
		keyword: string,
		filter: QueryFilter = {
			limit: 100,
			sort_by: "created_at",
			sort_order: "ASC",
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
            						WHERE f.name LIKE ? ORDER BY f.${sort_by} ${sort_order} LIMIT ?;`;

		const result = (await this.query(query, [
			`%${keyword}%`,
			limit,
		])) as SQLResultSet | null;
		const res = result?.rows._array || ([] as any[]);
		res.map((item: any) => {
			item.table_of_contents =
				item?.table_of_contents == "[]"
					? []
					: JSON.parse(item.table_of_contents);
		});
		return res;
	}
}
