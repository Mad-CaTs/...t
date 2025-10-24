import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayDateTime',
  standalone: true
})
export class ArrayDateTimePipe implements PipeTransform {

  transform(value: number[] | string): string | number[] | null {
    if (!Array.isArray(value) || value.length < 5) {
      return value;
    }
    const [year, month, day, hour, minute, second] = value;
    return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year} ${hour}:${minute}:${second}`;
  }

}
