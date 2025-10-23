import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userAddress',
  standalone: true, 
})
export class UserAddressPipe implements PipeTransform {
/*   transform(item: any): string {
    if (!item) return '-';

    const address =
      item.userLocalUbic === 2
        ? item.direccionOtroDetalle?.trim()
        : item.userLocal?.trim();

    return address && address !== '' ? address : '-';
  } */

   transform(item: any): string {
  if (!item) return '-';

  if ([2, 3].includes(item.userLocalUbic)) return 'Ver detalle';

  return item.userLocalUbic === 1
    ? item.userLocal?.trim() || '-'
    : '-';
}

  }

