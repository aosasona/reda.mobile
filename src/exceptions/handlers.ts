import CustomException from "./CustomException";

export const handlePossibleNull = (value: any, message: string) => {
	if (!value) {
		throw new CustomException(message);
	}
}