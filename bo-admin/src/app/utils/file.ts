export async function convertUrlToFile(url: string, filename: string) {
	const response = await fetch(url);
	const blob = await response.blob();

	return new File([blob], filename, { type: blob.type });
}
