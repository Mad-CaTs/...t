export function formatDateForInput(date: Date) {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');

	return `${year}-${month}-${day}`;
}

export function formatDateToDDMMYYYY(date: Date): string {
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

export function parseInputToDate(inputDate: string) {
	const parts = inputDate.split('-');
	const year = parseInt(parts[0]);
	const month = parseInt(parts[1]) - 1; // Se resta 1 ya que los meses en Date son de 0 a 11
	const day = parseInt(parts[2]);

	return new Date(year, month, day);
}

export function lessDaysOnCurrentDate(days: number) {
	const date = new Date();

	date.setDate(date.getDate() - days);

	return date;
}

export function convertArrayToDate(dateArray: number[]): Date {
	return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
}

/* Convierte un texto con formato "dd/MM/yyyy al dd/MM/yyyy" a number[] */
export function parsePeriodString(periodText: string): {
	initial: number[];
	end: number[];
} {
	if (!periodText || !periodText.includes(' al ')) {
		return { initial: [], end: [] };
	}

	const [startStr, endStr] = periodText.split(' al ');

	const strToArr = (s: string) => {
		const [d, m, y] = s.split('/').map(Number);
		return [y, m, d, 0, 0];
	};

	return {
		initial: strToArr(startStr),
		end: strToArr(endStr)
	};
}

export function formatDate(dateArray: number[]): string {
	if (Array.isArray(dateArray)) {
		const [year, month, day] = dateArray;
		return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
	}
	return '';
}

export function formatDateToDDMMYYYYV2(date: Date): string {
	const day = ('0' + date.getDate()).slice(-2);
	const month = ('0' + (date.getMonth() + 1)).slice(-2);
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
}

export function parseDDMMYYYY(dateString: string): Date | null {
	const parts = dateString.split('-');
	if (parts.length !== 3) {
		console.error('Invalid date format');
		return null;
	}
	const day = parseInt(parts[0], 10);
	const month = parseInt(parts[1], 10) - 1;
	const year = parseInt(parts[2], 10);

	const date = new Date(year, month, day);
	if (isNaN(date.getTime())) {
		console.error('Invalid date value');
		return null;
	}
	return date;
}
