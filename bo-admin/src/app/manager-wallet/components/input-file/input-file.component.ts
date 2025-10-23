import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
	selector: 'app-input-filedrawal',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './input-file.component.html',
	styleUrls: ['./input-file.component.scss']
})
export class InputFileOfWithdrawalComponent implements OnChanges {
	@Input() label = '';
	@Input() titleBox = 'Subir un archivo';
	@Input() accept = '.csv';
	@Input() maxSizeMB = 1.2;
	@Input() control: AbstractControl = new FormControl();
	@Input() helper: string | null = 'Formatos admitidos: csv. Tamaño máximo de archivo: 1.2mb.';

	@Output() fileChange = new EventEmitter<File>();
	@Output() fileError = new EventEmitter<string>();
	@Output() fileRemoved = new EventEmitter<void>();
	@ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

	hasError = false;
	errorMessage = '';
	selectedFile: File | null = null;

	constructor(private cdr: ChangeDetectorRef) { }

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['control'] && this.control.value === null) {
			this.hasError = false;
			this.errorMessage = '';
		}
	}

	public onClickUpload() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = this.accept;

		input.onchange = () => {
			if (!input.files || input.files.length === 0) return;

			const file = input.files[0];

			const validation = this.validateFile(file);

			if (!validation.isValid) {
				this.hasError = true;
				this.errorMessage = validation.error || 'Archivo no válido';
				this.control.setValue(file);
				this.fileError.emit(this.errorMessage);
				this.cdr.detectChanges();
				return;
			}

			this.hasError = false;
			this.errorMessage = '';
			this.control.setValue(file);
			this.fileChange.emit(file);
			this.cdr.detectChanges();
		};

		input.click();
	}

	public removeFile(event: Event) {
		event.stopPropagation();
		this.control.setValue(null);
		this.hasError = false;
		this.errorMessage = '';
		this.fileRemoved.emit();
		this.cdr.detectChanges();
	}

	private validateFile(file: File): { isValid: boolean; error?: string } {
		const acceptedTypes = this.accept.split(',').map(type => type.trim());
		const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

		const isValidType = acceptedTypes.some(type => {
			if (type.includes('*')) {
				const mimeType = type.split('/')[0];
				return file.type.startsWith(mimeType);
			}
			return type === fileExtension || file.type === type;
		});

		if (!isValidType) {
			return {
				isValid: false,
				error: `Formato no permitido. Solo se aceptan: ${this.accept}`
			};
		}

		// Validar tamaño
		const maxSizeBytes = this.maxSizeMB * 1024 * 1024;
		if (file.size > maxSizeBytes) {
			return {
				isValid: false,
				error: `El archivo excede el tamaño máximo de ${this.maxSizeMB}MB`
			};
		}

		return { isValid: true };
	}

	/* === Getters === */
	get file(): File | null {
		return this.control.value as File | null;
	}

	get name(): string {
		if (!this.file) return '';

		const fileName = this.file.name;
		const extension = fileName.split('.').pop()?.toUpperCase() || '';
		const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));

		// Truncar si es muy largo
		const maxLength = 30;
		const truncatedName = nameWithoutExt.length > maxLength
			? nameWithoutExt.substring(0, maxLength) + '...'
			: nameWithoutExt;

		return `${truncatedName}.${extension.toLowerCase()}`;
	}

	public clearFile(): void {
		this.selectedFile = null;

		if (this.fileInput?.nativeElement) {
			this.fileInput.nativeElement.value = '';
		}
	}
}