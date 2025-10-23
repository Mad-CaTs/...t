import { Injectable } from '@angular/core';

import type { ITableAbstract } from '@interfaces/shared.interface';

import { TableModel } from '../models/table.model';

interface IGenerateTableOptions {
	headers: string[];
	noCheckBoxes?: boolean;
	headersMinWidth?: number[];
	headersMaxWidth?: number[];
	headersArrows?: boolean[];
}

@Injectable({
	providedIn: 'root'
})
export class TableService {
	constructor() {}

	public generateTable<T extends ITableAbstract>({
		headers,
		headersMinWidth = [],
		headersMaxWidth = [],
		noCheckBoxes = false,
		headersArrows = []
	}: IGenerateTableOptions) {
		const table = new TableModel<T>();

		table.data = [];
		table.headers = headers;
		table.headersMinWidth = headersMinWidth;
		table.headersMaxWidth = headersMaxWidth;
		table.headersArrows = headersArrows;
		table.noCheckBoxes = noCheckBoxes;
		table.checkedIds;

		return table;
	}
}
