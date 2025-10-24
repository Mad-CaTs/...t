import { Injectable } from '@angular/core';
import { ITableService } from '../../interfaces/Tables';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private tablesData: ITableService<unknown>[] = [];

  constructor() {}

  public addTable(data: unknown[]) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const copyData = [...data];
    const totalPages = this.getTotalPages(copyData);

    this.tablesData.push({
      id,
      allData: copyData,
      data: copyData,
      currentPage: 1,
      totalPages,
    });

    this.setTableData(id);

    return id;
  }

  public changePage(newPage: number, id: string) {
    const tableIndex = this.tablesData.findIndex((t) => t.id === id);

    if (tableIndex === -1) return;

    this.tablesData[tableIndex].currentPage = newPage;

    this.setTableData(id);
  }

  public updateTable(data: unknown[], id: string) {
    const tableIndex = this.tablesData.findIndex((t) => t.id === id);
    const copyData = [...data];
    const totalPages = this.getTotalPages(copyData);

    if (tableIndex === -1) return;

    this.tablesData[tableIndex].allData = copyData;
    this.tablesData[tableIndex].totalPages = totalPages;

    this.setTableData(id);
  }

  public deleteTable(id: string) {
    this.tablesData = this.tablesData.filter((t) => t.id !== id);
  }

  public getTable<T>(id: string): ITableService<T> {
    const tableIndex = this.tablesData.findIndex((t) => t.id === id);

    if (tableIndex === -1)
      return { id: '', data: [], allData: [], totalPages: 1, currentPage: 1 };

    return this.tablesData[tableIndex] as ITableService<T>;
  }

  private setTableData(id: string) {
    const tableIndex = this.tablesData.findIndex((t) => t.id === id);

    if (tableIndex === -1) return;

    const dataBody = this.tablesData[tableIndex].allData;
    const currentPage = this.tablesData[tableIndex].currentPage;
    let result: unknown[] = [];

    dataBody.forEach((obj, i) => {
      if (i + 1 >= (currentPage - 1) * 10 && i < currentPage * 10)
        result.push(obj);
    });

    this.tablesData[tableIndex].data = result;
  }

  private getTotalPages(data: unknown[]) {
    let result = Math.round(data.length / 10);

    if (result < 1) result = 1;

    return result;
  }
}
