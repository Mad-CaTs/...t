import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { FormControl } from '@angular/forms';

@Component({
	selector: 'table-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
	@Input() textBtn: string = '';
	@Input() hasChildren: boolean = false;
	@Input() noTextBtn: boolean = false;
	@Input() page: number = 0;
	@Input() refresh: boolean = false;

	@Input() pageControl = new FormControl(1);
	@Input() count: number = 0;
	@Input() itemsPerPage: number = 10;

	@Output() clickBtn = new EventEmitter();
	@Output() pageChanged = new EventEmitter<number>();

	/* === Getters === */
	get totalPages() {
		return this.count > 0 ? Math.ceil(this.count / this.itemsPerPage) : 0;
	}

	get pages() {
		const result = [];
		for (let i = 1; i <= this.totalPages; i++) result.push(i);
		return result;
	}

	onPageChange(page: number | null) {
		if (page !== null && this.totalPages > 0) {
			this.pageChanged.emit(page);
		}
	}

	ngOnChanges() {
		if (this.refresh) {
			this.pageControl.setValue(1);
		}
	}
}
