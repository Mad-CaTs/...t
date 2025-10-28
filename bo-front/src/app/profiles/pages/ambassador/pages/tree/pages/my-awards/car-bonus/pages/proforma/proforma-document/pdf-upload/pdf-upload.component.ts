import { CommonModule } from '@angular/common';
import {
	Component,
	ElementRef,
	EventEmitter,
	Optional,
	Self,
	ViewChild,
	OnDestroy,
	OnChanges,
	SimpleChanges,
	Output,
	Input
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-pdf-upload',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './pdf-upload.component.html',
	styleUrls: ['./pdf-upload.component.scss']
})
export class PdfUploadComponent implements ControlValueAccessor, OnDestroy, OnChanges {
	// API
	/** Tamaño máximo en MB (default 10) */
	maxSizeMB = 10;

	/** URL externa para previsualizar PDF existente */
	@Input() externalUrl: string | null = null;

	/** Emite la URL segura para que el padre pueda previsualizar en un <iframe> si quiere */
	@Output() urlChange = new EventEmitter<SafeResourceUrl | null>();

	// UI state
	dragOver = false;
	disabled = false;

	file: File | null = null;
	pdfName = '';
	private objectUrl?: string;
	safeUrl: SafeResourceUrl | null = null;

	@ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

	// CVA plumbing
	private onChange: (v: File | string | null) => void = () => {};
	private onTouched: () => void = () => {};

	constructor(@Optional() @Self() public ngControl: NgControl, private sanitizer: DomSanitizer) {
		if (this.ngControl) this.ngControl.valueAccessor = this;
	}

	// ======= ControlValueAccessor =======
	writeValue(value: File | string | null): void {
		if (typeof value === 'string') {
			this.setUrl(value);
		} else {
			this.setFile(value, /*validate*/ false);
		}
	}
	registerOnChange(fn: (v: File | string | null) => void): void {
		this.onChange = fn;
	}
	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}
	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	// ======= Handlers =======
	onPickClick(e: MouseEvent) {
		e.stopPropagation();
		if (this.disabled) return;
		this.fileInput?.nativeElement.click();
	}

	onSelected(evt: Event) {
		const input = evt.target as HTMLInputElement;
		const file = input.files?.[0] ?? null;
		this.setFile(file, /*validate*/ true);
		if (this.fileInput) this.fileInput.nativeElement.value = '';
		this.onTouched();
	}

	onDragOver(evt: DragEvent, state: boolean) {
		evt.preventDefault();
		if (this.disabled) return;
		this.dragOver = state;
	}

	onDrop(evt: DragEvent) {
		evt.preventDefault();
		if (this.disabled) return;
		this.dragOver = false;
		const file = evt.dataTransfer?.files?.[0] ?? null;
		this.setFile(file, /*validate*/ true);
		this.onTouched();
	}

	removeFile(evt?: MouseEvent) {
		evt?.stopPropagation();
		this.clearFile();
		this.onTouched();
	}

	// ======= Internals =======
	private setFile(file: File | null, validate: boolean) {
		const ctrl = this.ngControl?.control ?? null;

		// limpia errores propios antes de validar
		this.clearOwnErrors();

		if (validate && file) {
			const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
			if (!isPdf) {
				ctrl?.setErrors({ ...(ctrl.errors ?? {}), invalidType: true });
				ctrl?.markAsTouched();
				return;
			}
			const max = this.maxSizeMB * 1024 * 1024;
			if (file.size > max) {
				ctrl?.setErrors({ ...(ctrl.errors ?? {}), maxSize: true });
				ctrl?.markAsTouched();
				return;
			}
		}

		this.file = file;
		this.pdfName = file?.name ?? '';
		this.onChange(this.file);

		// gestiona URL para preview
		if (this.objectUrl) {
			URL.revokeObjectURL(this.objectUrl);
			this.objectUrl = undefined;
		}
		if (file) {
			this.objectUrl = URL.createObjectURL(file);
			this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
		} else {
			this.safeUrl = null;
		}
		this.urlChange.emit(this.safeUrl);
	}

	private clearOwnErrors() {
		const ctrl = this.ngControl?.control ?? null;
		if (!ctrl || !ctrl.errors) return;
		const { invalidType, maxSize, ...rest } = ctrl.errors;
		const hasOthers = Object.keys(rest).length > 0;
		ctrl.setErrors(hasOthers ? rest : null);
	}

	private clearFile() {
		this.setFile(null, /*validate*/ false);
	}

	private setUrl(url: string): void {
		this.file = null;
		this.pdfName = 'Documento.pdf';
		this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
		this.urlChange.emit(this.safeUrl);
		this.onChange(url);
	}

	get displayPdfName(): string {
		const name = this.pdfName || '';
		if (!name) return '';
		const dot = name.lastIndexOf('.');
		const base = dot > 0 ? name.slice(0, dot) : name;
		const short = base.length > 12 ? base.slice(0, 12) + ' ... ' : base + ' ';
		return `${short}.pdf`;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['externalUrl'] && this.externalUrl) {
			this.setUrl(this.externalUrl);
		}
	}

	ngOnDestroy(): void {
		if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
	}
}
