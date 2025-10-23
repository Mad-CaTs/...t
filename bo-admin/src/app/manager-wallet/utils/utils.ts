export function formatDate(fechaOriginal: number[]): string {
    const [year, month, day] = fechaOriginal;
    const date = new Date(year, month - 1, day);

    const formattedDay = date.getDate().toString().padStart(2, '0');
    const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const formattedYear = date.getFullYear();

    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
}

export function getLastDayOfMonth(year: number, month: number): string {
    const lastDay = new Date(year, month, 0).getDate();
    const formattedMonth = month < 10 ? `0${month}` : month.toString();
    const formattedDay = lastDay < 10 ? `0${lastDay}` : lastDay.toString();
    return `${year}-${formattedMonth}-${formattedDay}`;
  }
