import { FormControl } from '@angular/forms';
import { ITableAbstract } from '@interfaces/shared.interface';

export class TableModel<T extends ITableAbstract> {
	public data: T[] = [];
	public headers: string[];
	public headersMinWidth: number[];
	public headersMaxWidth: number[];
	public headersArrows: boolean[] = [];
	public noCheckBoxes: boolean;
	public checkedIds: number[] = [];

	public pageControl = new FormControl(1);
	public count: number = 10;

	public loading: boolean = false;

	constructor() {}

	/* === Events === */
	public changeCheckId(event: Event, id: number) {
		const target = event.target as HTMLInputElement;
		const value = target.checked;
		const hasExist = this.checkedIds.find((c) => c === id);

		if (hasExist && !value) this.checkedIds = this.checkedIds.filter((c) => c !== id);
		else if (!hasExist && value) this.checkedIds.push(id);
	}

	public changeCheckedAll(checkedAll: boolean) {
		if (!checkedAll) this.checkedIds = [];
		else this.checkedIds = this.data.map((d) => d.id);
	}

	/* === Helpers === */
	public getChecked(id: number) {
		const existId = this.checkedIds.includes(id);

		return existId;
	}

	/* === Getters === */
	public get checkedAll() {
		let invalid = false;

		for (let d of this.data) {
			if (!this.checkedIds.includes(d.id)) {
				invalid = true;
				break;
			}
		}

		return !invalid;
	}
}
