// Crear un nombre de archivo válido com la fecha actual
export function generateFileName(baseName: string, extension: string): string {
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];
  return `${baseName}_${formattedDate}.${extension}`;
}

// Generar y descargar un archivo Excel desde un Blob
export function downloadExcelFile(data: Blob, fileName: string): void {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
