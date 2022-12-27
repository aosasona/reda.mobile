import { StateSetter } from "../types/import";
import { OpenLibraryService } from "./request.util";

export default class ImportUtil {
	private readonly setState: StateSetter;

	constructor(setState: StateSetter) {
		this.setState = setState;
	}

	public loadAllMeta = async (fileName: string) => {
		try {
			this.setState((prevState) => ({
				...prevState,
				loading: { ...prevState.loading, meta: true },
			}));
			const onlineMetadata = (
				await OpenLibraryService.search({ title: fileName, limit: 50 })
			)["docs"];
			this.setAllMeta(onlineMetadata);
		} catch (err) {
		} finally {
			this.setState((prevState) => ({
				...prevState,
				loading: { ...prevState.loading, meta: false, local: false },
			}));
		}
	};

	public setAllMeta = (value: any[]) =>
		this.setState((prevState) => ({
			...prevState,
			meta: {
				...prevState.meta,
				all: value,
			},
		}));

	public setCurrentMeta = (value: any, index: number) =>
		this.setState((prevState) => ({
			...prevState,
			meta: {
				...prevState.meta,
				current: value,
				currentIndex: index,
			},
		}));

	public resetState = () => {
		this.setState({
			file: null,
			URL: "",
			search: "",
			step: 0,
			downloadingList: [],
			meta: {
				all: [],
				current: null,
				currentIndex: 0,
			},
			loading: {
				local: false,
				remote: false,
				meta: false,
			},
		});
	};
}
