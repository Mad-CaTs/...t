import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayDate',
  standalone: true
})
export class ArrayDatePipe implements PipeTransform {

  transform(value: number[] | string): string | number[] | null {
    if (!Array.isArray(value) || value.length < 5) {
      return value;
    }
    const [year, month, day, hour, minute] = value;
    return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
  }

}
