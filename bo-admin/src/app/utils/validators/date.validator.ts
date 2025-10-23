import type { AbstractControl } from '@angular/forms';

import { parseInputToDate } from '@utils/date';

export class DateValidator {
	public static minimumDate(date: Date, message: string) {
		return (field: AbstractControl) => {
			const value = new Date(field.value);

			if (date.getTime() <= value.getTime()) return null;

			return { message };
		};
	}

	public formatDate(dateString: string): string {
		if (!dateString) return '';
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = String(date.getFullYear()).slice(-2);
		return `${day}/${month}/${year}`;
	}
	
}
