export function generateRandomString(length: number) {
	const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let result = "";
	for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
};

export const byteToMB = (bytes: number) => {
	return (bytes / 1024 / 1024)?.toFixed(2) + " MB";
};

export function generateTimestamp(): string {
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hours = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
	const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
	const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
