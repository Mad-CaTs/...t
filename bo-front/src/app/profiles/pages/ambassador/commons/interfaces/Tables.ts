export interface ITableService<T> {
	id: string;
	allData: T[];
	data: T[];
	currentPage: number;
	totalPages: number;
}
