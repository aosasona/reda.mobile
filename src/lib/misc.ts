export const generateRandomString = (length: number) => {
	const chars =
	  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let result = "";
	for (let i = length; i > 0; --i)
		result += chars[Math.floor(Math.random() * chars.length)];
	return result;
};

export const byteToMB = (bytes: number) => {
	return (bytes / 1024 / 1024)?.toFixed(2) + " MB";
};