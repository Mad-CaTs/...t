import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { AbstractControl, FormControl } from '@angular/forms';

@Component({
	selector: 'app-input-file',
	templateUrl: './input-file.component.html',
	styleUrls: ['./input-file.component.scss']
})
export class InputFileComponent implements OnChanges {
	@Input() label = '';
	@Input() titleBox = 'Seleccionar o arrastrar archivo';
	@Input() placeholder = 'JPG, PNG or PDF, file size no more than 10MB';
	@Input() accept = '.csv';
	@Input() control: AbstractControl = new FormControl();
	@Input() helper: string | null = null;
	@Output() fileChange = new EventEmitter<File>();
	imageUrl: string = '';

	ngOnChanges(changes: SimpleChanges): void {
		if (this.accept !== 'image/*' || !this.file || !changes.file) return;

		const newUri = URL.createObjectURL(this.file);

		if (this.imageUrl !== newUri) this.imageUrl = newUri;
	}

	/* === Events === */
	public onClickUpload() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = this.accept;

		input.onchange = () => {
			if (!input.files) return;

			const file = input.files[0];

			this.control.setValue(file);
			this.fileChange.emit(file);
		};

		input.click();
	}

	/* === Getters === */
	get file() {
		const value = this.control.value as File | null;

		return value;
	}

	// get name() {
	// 	const name = this.file?.name || '';
	// 	const extension = name.split('.').pop()?.toUpperCase();
	// 	const filenamewithoutextension = name.replace(/\.[^/.]+$/, '');
	// 	const shortenedFileName =
	// 		filenamewithoutextension.length > 15
	// 			? filenamewithoutextension.substring(0, 15) + '...'
	// 			: filenamewithoutextension;
	// 	const formattedName = `${shortenedFileName} (${extension})`;

	// 	return formattedName;
	// }

	get name() {
		if (!this.control.value) {
			return '';
		}
		const filePath = typeof this.file === 'string' ? this.file : this.file?.name || this.control.value;
		if (!filePath) {
			return '';
		}
		const fileName = filePath.split('/').pop() || '';
		const extension = fileName.split('.').pop()?.toUpperCase() || '';
		const filenameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
		const shortenedFileName =
			filenameWithoutExtension.length > 15
				? filenameWithoutExtension.substring(0, 15) + '...'
				: filenameWithoutExtension;

		const formattedName = extension ? `${shortenedFileName} (${extension})` : shortenedFileName;

		return formattedName;
	}
}
