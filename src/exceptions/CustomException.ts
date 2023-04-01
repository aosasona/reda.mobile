export default class CustomException extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'CustomException';
	}
}
