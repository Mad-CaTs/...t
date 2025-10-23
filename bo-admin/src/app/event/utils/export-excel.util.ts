// src/app/event/utils/export-excel.util.ts
import * as XLSX from 'xlsx';

export function exportToExcel<T>(data: T[], fileName: string): void {
  const normalizedData = data.map((row: any) => {
    const normalizedRow: Record<string, any> = {};
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        const value = row[key];
        normalizedRow[key] =
          value === null || value === undefined || value === ''
            ? '-'
            : value;
      }
    }
    return normalizedRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(normalizedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Eventos');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
