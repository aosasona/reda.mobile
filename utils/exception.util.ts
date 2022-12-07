import CustomException from "../exceptions/CustomException";

export const handlePossibleNull = (value: any, message: string) => {
	if (!value) {
		throw new CustomException(message);
	}
}