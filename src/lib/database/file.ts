import {SQLResultSet} from "expo-sqlite";
import {FileModel, MetadataModel} from "../../types/database";
import {insert} from "./ops";

export const save = async (
  file: FileModel,
  meta: MetadataModel,
): Promise<{ id: number }> => {
	try {
		const savedFile = (await insert("files", file)) as SQLResultSet;
		const {insertId} = savedFile;
		const savedMeta = (await insert("metadata", {
			...meta,
			file_id: insertId,
		})) as SQLResultSet;
		return {id: insertId || 0};
	}
	catch (e) {
		throw e;
	}
};