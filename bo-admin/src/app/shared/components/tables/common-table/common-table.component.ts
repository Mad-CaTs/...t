import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-common-table',
	templateUrl: './common-table.component.html',
	styleUrls: ['./common-table.component.scss']
})
export class CommonTableComponent {
	@Input() headers: string[] = [];
	@Input() headersMinWidth: number[] = [];
	@Input() headersMaxWidth: number[] = [];
	@Input() headersArrows: boolean[] = [];
	@Input() noCheckboxes: boolean = false;
	@Input() checkedAll: boolean = false;
	@Input() firstEmpty: boolean = false;
	@Input() maxHeight: number = 0;
	@Output() onCheckedAll = new EventEmitter<boolean>();

	/* === Events === */
	onChangeGroupCheckbox(event: Event) {
		const target = event.target as HTMLInputElement;

		this.onCheckedAll.emit(target.checked);
	}

	/* === Helpers === */
	getMinWidthHeader(index: number) {
		const maxIndex = this.headersMinWidth.length - 1;
		const isNotExist = maxIndex < index;

		if (isNotExist) return '0px';

		return `${this.headersMinWidth[index]}px`;
	}

	getMaxWidthHeader(index: number) {
		const maxIndex = this.headersMaxWidth.length - 1;
		const isNotExist = maxIndex < index;

		if (isNotExist) return 'none';

		return `${this.headersMaxWidth[index]}px`;
	}
}
