export function setCokkie(key: string, value: string, expiresIn?: string) {
	let expires: string = '';

	if (expiresIn) expires = ' expires=' + expiresIn + ';';

	const result = key + '=' + (value || '') + '; path=/;' + expires;

	document.cookie = result;
}

export function getCokkie(key: string) {
	if (typeof document === 'undefined') return null;

	const nameEQ = key + '=';

	const ca: string[] = document.cookie.split(';');

	for (let i = 0; i < ca.length; i++) {
		let c: string = ca[i];

		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}

	return null;
}

export function deleteCookie(name: string) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
