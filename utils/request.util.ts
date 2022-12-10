import {default as axios} from "axios";

const stringify = require('qs-stringify')

export interface SearchParams {
	title?: string;
	author?: string;
	limit?: number;
	q?: string;
	page?: number;
}

export class OpenLibraryService {
	private static BASE_URL = "https://openlibrary.org/"
	private static SEARCH_URL = this.BASE_URL + "search.json"

	static async search(params: SearchParams) {
		const query = stringify(params)
		const url = this.SEARCH_URL + "?" + query
		const {data} = await axios.get(url)
		return data
	}

	static getImageByID(isbn: string, quality: "S" | "M" | "L" = "M") {
		return `https://covers.openlibrary.org/b/id/${isbn}-${quality}.jpg`
	}

	static async getBookDataByKey(key: string) {
		const url = `${this.BASE_URL}books/${key}.json`
		const { data } = await axios.get(url)
		return data
	}
}