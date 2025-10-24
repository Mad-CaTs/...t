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

  formatBirthDate(date: Date): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      console.error('El valor proporcionado no es una fecha válida:', date);
      return '';
    }
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

}
