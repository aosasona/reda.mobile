import * as yup from "yup";

export const validateURL = (
  url: string,
): { valid: boolean; msg: string | null } => {
	try {
		const schema = yup.object().shape({
			url: yup.string().url().required().min(3),
		});

		const valid = schema.isValidSync({url});
		if (valid) {
			return {valid, msg: null};
		}
		return {valid: false, msg: "Invalid URL"};
	}
	catch (err: any) {
		return {valid: false, msg: err?.message};
	}
};