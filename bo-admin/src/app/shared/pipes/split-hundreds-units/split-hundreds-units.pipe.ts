import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'splitHundredsUnits'
})
export class SplitHundredsUnitsPipe implements PipeTransform {
	transform(value: string): string {
		if (!value) return '';
		const parts = value.split(' ');

		const splitIndex = (() => {
			for (let i = parts.length - 1; i >= 0; i--) {
				if (parts[i].toLowerCase().includes('mil')) return i;
			}
			return -1;
		})();

		if (splitIndex === -1) return this.capitalizeFirstLetter(value);

		const result = parts.slice(splitIndex + 1).join(' ');
		return this.capitalizeFirstLetter(result);
	}

	private capitalizeFirstLetter(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
}
