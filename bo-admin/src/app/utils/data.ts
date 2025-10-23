export function generateUniqueId() {
	const timestamp = new Date().getTime();
	const randomValue = Math.floor(Math.random() * 10000);
	const uniqueId = `id_${timestamp}_${randomValue}`;

	return uniqueId;
}
