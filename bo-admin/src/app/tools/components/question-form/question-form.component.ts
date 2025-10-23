import { Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-question-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './question-form.component.html',
	styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent implements OnInit {
	@Input() formGroup!: FormGroup;
	@Input() imageurl: string | null = null;
	@ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

	invalidImage: File | null = null;
	imagePreviewURL: string | null = null;
	pendingImageFile: File | null = null;
	imageDragOver = false;

	constructor(private cd: ChangeDetectorRef) {}

	ngOnInit(): void {
		// Si hay imageurl y no hay archivo seleccionado, setea el control 'image' con un objeto especial para que el template lo detecte
		if (this.imageurl && !this.formGroup.get('image')?.value) {
			// Simula un archivo virtual solo para la vista previa
			this.formGroup.patchValue({ image: { name: 'Imagen actual', url: this.imageurl, isUrl: true } });
			this.imagePreviewURL = this.imageurl;
		}

		this.applyDefaultValidators();

		// Asegura que el control image exista
		if (!this.formGroup.get('image')) {
			// Hacer image requerido
			this.formGroup.addControl('image', new FormControl(null, Validators.required));
		}

		this.formGroup.updateValueAndValidity({ emitEvent: false });
	}

	onDrop(event: DragEvent): void {
		event.preventDefault();
		this.imageDragOver = false; // Siempre restablecer el estado visual al soltar
		if (event.dataTransfer && event.dataTransfer.files.length > 0) {
			const file = event.dataTransfer.files[0];
			const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
			const imageControl = this.formGroup.get('image')!;
			// Primero validar tipo
			this.pendingImageFile = file;
			if (!allowedTypes.includes(file.type)) {
				this.invalidImage = null;
				imageControl.setErrors({ invalidType: true });
				imageControl.markAsTouched();
				imageControl.markAsDirty();
				imageControl.updateValueAndValidity();
				this.imageDragOver = false;
				return;
			}
			if (file.size > 1.2 * 1024 * 1024) {
				this.invalidImage = file;
				imageControl.setErrors({ maxSize: true });
				imageControl.markAsTouched();
				imageControl.markAsDirty();
				imageControl.updateValueAndValidity();
				this.imageDragOver = false;
				return;
			}
			// Si pasa ambos filtros, actualizar imagen
			this.invalidImage = null;
			this.formGroup.patchValue({ image: file });
			this.imagePreviewURL = URL.createObjectURL(file);
			imageControl.setErrors(null);
			imageControl.updateValueAndValidity();
		}
	}

	// Update image handlers to always store file and show its size even when exceeding limit
	onImageSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			// Validación de tipo
			const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
			const imageControl = this.formGroup.get('image')!;
			this.pendingImageFile = file;
			if (!allowedTypes.includes(file.type)) {
				this.invalidImage = null;
				imageControl.setErrors({ invalidType: true });
				imageControl.markAsTouched();
				imageControl.markAsDirty();
				imageControl.updateValueAndValidity();
				if (this.fileInputRef?.nativeElement) {
					this.fileInputRef.nativeElement.value = '';
				}
				return;
			}
			if (file.size > 1.2 * 1024 * 1024) {
				this.invalidImage = file;
				imageControl.setErrors({ maxSize: true });
				imageControl.markAsTouched();
				imageControl.markAsDirty();
				imageControl.updateValueAndValidity();
				if (this.fileInputRef?.nativeElement) {
					this.fileInputRef.nativeElement.value = '';
				}
				return;
			}
			// Si pasa ambos filtros, actualizar imagen
			this.invalidImage = null;
			this.formGroup.patchValue({ image: file });
			this.imagePreviewURL = URL.createObjectURL(file);
			imageControl.setErrors(null);
			imageControl.updateValueAndValidity();
		} else {
			// Si se borra el archivo, pero hay imageUrl, restaurar el virtual
			if (this.imageurl) {
				this.formGroup.patchValue({
					image: { name: 'Imagen actual', url: this.imageurl, isUrl: true }
				});
				this.imagePreviewURL = this.imageurl;
			}
		}
	}

	// Quitar imagen y limpiar vista previa
	removeImage(): void {
		const imageControl = this.formGroup.get('image')!;
		this.formGroup.patchValue({ image: null });
		this.invalidImage = null;
		if (this.imagePreviewURL && typeof this.imagePreviewURL !== 'string') {
			URL.revokeObjectURL(this.imagePreviewURL);
		}
		this.imagePreviewURL = null;
		// Si hay imageurl, restaurar el virtual
		if (this.imageurl) {
			this.formGroup.patchValue({ flyer: { name: 'Flyer actual', url: this.imageurl, isUrl: true } });
			this.imagePreviewURL = this.imageurl;
		} else {
			imageControl.setErrors({ required: true });
		}
		imageControl.markAsTouched();
		imageControl.markAsDirty();
		// Limpiar valor del input file para permitir re-subir el mismo fichero
		if (this.fileInputRef && this.fileInputRef.nativeElement) {
			this.fileInputRef.nativeElement.value = '';
		}
		imageControl.updateValueAndValidity();
	}

	private applyDefaultValidators(): void {
		const config: { [key: string]: any[] } = {
			question: [Validators.required],
			description: [Validators.required]
		};

		Object.entries(config).forEach(([key, validators]) => {
			const control = this.formGroup.get(key);
			if (control && (!control.validator || !control.validator({} as any))) {
				control.setValidators(validators);
				control.updateValueAndValidity({ emitEvent: false });
			}
		});
	}

	// Prevent typing a space at the beginning of the field
	preventLeadingSpace(event: KeyboardEvent): void {
		const input = event.target as HTMLInputElement | HTMLTextAreaElement;
		if (event.key === ' ' && input.selectionStart === 0) {
			event.preventDefault();
		}
	}

	// Prevent typing two consecutive spaces
	preventDoubleSpace(event: KeyboardEvent): void {
		const input = event.target as HTMLInputElement | HTMLTextAreaElement;
		const pos = input.selectionStart || 0;
		if (event.key === ' ' && pos > 0 && input.value.charAt(pos - 1) === ' ') {
			event.preventDefault();
		}
	}

	// Prevent typing segments of 30+ chars without space, slash or colon
	preventLongSegmentOnType(event: KeyboardEvent): void {
		const key = event.key;
		if (key.length !== 1) return; // solo caracteres imprimibles
		if (/[\s\/:]/.test(key)) return; // separadores permitidos
		const input = event.target as HTMLInputElement;
		const pos = input.selectionStart ?? 0;
		const end = input.selectionEnd ?? pos;
		const value = input.value;
		const newValue = value.slice(0, pos) + key + value.slice(end);
		const segments = newValue.split(/[\s\/:]+/);
		if (segments.some((seg) => seg.length >= 30)) {
			event.preventDefault();
		}
	}

	// Prevent pasting segments of 30+ chars without space, slash or colon
	preventLongSegmentOnPaste(event: ClipboardEvent): void {
		const paste = event.clipboardData?.getData('text') || '';
		const segments = paste.split(/[\s\/:]+/);
		if (segments.some((seg) => seg.length >= 30)) {
			event.preventDefault();
		}
	}

	onFlyerDragOver(state: boolean) {
		this.imageDragOver = state;
	}
}
