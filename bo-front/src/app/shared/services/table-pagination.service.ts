import { Injectable } from '@angular/core';
import { ITableService } from 'src/app/profiles/pages/ambassador/commons/interfaces/Tables';

@Injectable({
	providedIn: 'root'
})
export class TablePaginationService {
	private tablesData: ITableService<unknown>[] = [];

	constructor() {}

	public addTable(data: unknown[], rowsPerPage: number) {
		const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
		const copyData = [...data];
		const totalPages = this.getTotalPages(copyData, rowsPerPage);

		this.tablesData.push({
			id,
			allData: copyData,
			data: copyData,
			currentPage: 1,
			totalPages
		});

		this.setTableData(id, rowsPerPage);

		return id;
	}

	public changePage(newPage: number, id: string, rowsPerPage: number) {
		const tableIndex = this.tablesData.findIndex((t) => t.id === id);

		if (tableIndex === -1) return;

		this.tablesData[tableIndex].currentPage = newPage;

		this.setTableData(id, rowsPerPage);
	}

	public updateTable(data: unknown[], id: string, rowsPerPage: number) {
		const tableIndex = this.tablesData.findIndex((t) => t.id === id);
		const copyData = [...data];
		const totalPages = this.getTotalPages(copyData, rowsPerPage);
		if (tableIndex === -1) return;
		this.tablesData[tableIndex].allData = copyData;
		this.tablesData[tableIndex].totalPages = totalPages;
		this.setTableData(id, rowsPerPage);
	}

	public deleteTable(id: string) {
		this.tablesData = this.tablesData.filter((t) => t.id !== id);
	}

	public getTable<T>(id: string): ITableService<T> {
		const tableIndex = this.tablesData.findIndex((t) => t.id === id);

		if (tableIndex === -1) return { id: '', data: [], allData: [], totalPages: 1, currentPage: 1 };

		return this.tablesData[tableIndex] as ITableService<T>;
	}

	private setTableData(id: string, rowsPerPage: number) {
		const tableIndex = this.tablesData.findIndex((t) => t.id === id);

		if (tableIndex === -1) return;

		const dataBody = this.tablesData[tableIndex].allData;
		const currentPage = this.tablesData[tableIndex].currentPage;
		const startIndex = (currentPage - 1) * rowsPerPage;
		const endIndex = currentPage * rowsPerPage;

		this.tablesData[tableIndex].data = dataBody.slice(startIndex, endIndex);
	}

	private getTotalPages(data: unknown[], rowsPerPage: number) {
		const totalPages = Math.ceil(data.length / rowsPerPage);
		return totalPages < 1 ? 1 : totalPages;
	}
}
