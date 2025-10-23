import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'numberToText'
})
export class NumberToTextPipe implements PipeTransform {
	transform(value: number): string {
		if (isNaN(value)) return '';
		return this.convertNumberToText(value, true);
	}

	private convertNumberToText(num: number, isStandaloneUnit: boolean = false): string {
		const units = [
			'',
			isStandaloneUnit ? 'uno' : 'un',
			'dos',
			'tres',
			'cuatro',
			'cinco',
			'seis',
			'siete',
			'ocho',
			'nueve'
		];
		const tens = [
			'',
			'diez',
			'veinte',
			'treinta',
			'cuarenta',
			'cincuenta',
			'sesenta',
			'setenta',
			'ochenta',
			'noventa'
		];
		const teens = [
			'diez',
			'once',
			'doce',
			'trece',
			'catorce',
			'quince',
			'dieciséis',
			'diecisiete',
			'dieciocho',
			'diecinueve'
		];
		const hundreds = [
			'',
			'ciento',
			'doscientos',
			'trescientos',
			'cuatrocientos',
			'quinientos',
			'seiscientos',
			'setecientos',
			'ochocientos',
			'novecientos'
		];

		if (num === 0) return 'cero';
		if (num < 10) return units[num];

		if (num < 20) return teens[num - 10];

		if (num < 100) {
			const ten = Math.floor(num / 10);
			const unit = num % 10;
			return tens[ten] + (unit !== 0 ? ' y ' + this.convertNumberToText(unit, isStandaloneUnit) : '');
		}

		if (num < 1000) {
			const hundred = Math.floor(num / 100);
			const remainder = num % 100;
			return (
				(hundred === 1 && remainder === 0 ? 'cien' : hundreds[hundred]) +
				(remainder !== 0 ? ' ' + this.convertNumberToText(remainder, isStandaloneUnit) : '')
			);
		}

		if (num < 1000000) {
			const thousand = Math.floor(num / 1000);
			const remainder = num % 1000;
			// 🔧 Aquí decimos que lo que va antes de "mil" no es standalone
			return (
				(thousand === 1 ? 'mil' : this.convertNumberToText(thousand, false) + ' mil') +
				(remainder !== 0 ? ' ' + this.convertNumberToText(remainder, true) : '')
			);
		}

		if (num < 1000000000) {
			const million = Math.floor(num / 1000000);
			const remainder = num % 1000000;
			return (
				(million === 1 ? 'un millón' : this.convertNumberToText(million, false) + ' millones') +
				(remainder !== 0 ? ' ' + this.convertNumberToText(remainder, true) : '')
			);
		}

		return 'Número demasiado grande';
	}
}
