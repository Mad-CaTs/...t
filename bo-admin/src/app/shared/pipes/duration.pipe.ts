import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'duration'
})
export class DurationPipe implements PipeTransform {
	transform(value: string, ...args: string[]): string {
		let result = '';
		const startDate = new Date(value);
		const endDate = new Date(args[0]);

		const time = endDate.getTime() - startDate.getTime();

		const days = Math.floor(time / (3600000 * 24));
		const hours = Math.floor((time % (3600000 * 24)) / 3600000);
		const minutes = Math.floor((time % 3600000) / 60000);

		if (days > 0) result += `${days} ${days === 1 ? 'día' : 'días'} `;
		if (hours > 0) result += `${hours} ${hours === 1 ? 'hora' : 'horas'} `;
		if (minutes > 0) {
			result += `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
		}

		if (result === '') return '0 minutos';

		return result;
	}
}
