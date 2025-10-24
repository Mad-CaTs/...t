import { CommonModule } from '@angular/common';
import {
	AfterViewChecked,
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ImagenData, ImagenUri } from '@shared/constants';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-file',
	templateUrl: './file.component.html',
	standalone: true,
	imports: [CommonModule],
	styleUrls: ['./file.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent implements AfterViewInit {
	@Input() control: FormControl | undefined = undefined;
	@Input() controlName: string | undefined = undefined;
	@Input() form: FormGroup | undefined = new FormGroup({});
	@Input() label: string = '';
	@Input() placeholder: string = 'JPG, PNG or PDF, file size no more than 10MB';
	@Input() disabled: boolean = false;
	@Input() helper: string | null = null;
	@Input() accept: string = '';
	@Input() maxLength: number = 9999999999;
	@Input() sendAsBase64: boolean = false;
	@Input() multiple: boolean = false;
	public file: File | null = null;
	public files: File[] = [];
	/* public disabledUser: boolean = this.userInfoService.disabled; */

	@Input() inline: boolean = true;

	constructor(private userInfoService: UserInfoService, private cdRef: ChangeDetectorRef) {}

	ngAfterViewInit() {
		this.restoreFilesFromForm();
		Promise.resolve().then(() => this.cdRef.detectChanges());
	}

	private restoreFilesFromForm(): void {
	const value = this.formControl?.value;
	if (!value) {
		this.file = null;
		this.files = [];
		return;
	}

	if (this.multiple) {
		if (Array.isArray(value)) {
			// soporta File[] directo o [{file: File}]
			this.files = value.map((v: any) => (v instanceof File ? v : v.file)).filter(Boolean);
		} else {
			this.files = [];
		}
	} else {
		// soporta File directo o {file: File}
		this.file = value instanceof File ? value : value?.file || null;
	}
}


	/* private restoreFilesFromForm(): void {
		const value = this.formControl?.value;
		if (!value) return;

		this.multiple
			? Array.isArray(value) && value[0]?.file && (this.files = value.map((v: any) => v.file))
			: value?.file && (this.file = value.file);
	} */

	onSelectFile() {
		const input = document.createElement('input');
		const control = this.formControl;

		input.type = 'file';
		input.accept = this.accept;
		input.maxLength = this.maxLength;
		if (this.multiple) {
			input.multiple = true;
			input.onchange = () => {
				if (input && input.files) {
					let selectedFiles = Array.from(input.files);
					if (this.maxLength && selectedFiles.length > this.maxLength) {
						selectedFiles = selectedFiles.slice(0, this.maxLength);
						alert(`Solo se permiten ${this.maxLength} archivos. Los demás fueron ignorados.`);
					}

					this.files = selectedFiles;

					if (this.sendAsBase64) {
						const readers = this.files.map((file) => {
							return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
								const reader = new FileReader();
								reader.readAsDataURL(file);
								reader.onload = () => resolve(reader.result);
								reader.onerror = reject;
							});
						});

						Promise.all(readers).then((results) => {
							const base64Files = results.map((result) =>
								result?.toString().split(';base64,').pop()
							);
							const fileData = this.files.map((file, index) => ({
								base64: base64Files[index],
								file
							}));
							control?.setValue(fileData);
							this.cdRef.detectChanges();
						});
					} else {
						control?.setValue(this.files);
						setTimeout(() => {
							this.cdRef.detectChanges();
						});
					}
				}
			};
		} else {
			input.onchange = () => {
				if (input && input.files) {
					const file = input.files[0];
					this.file = file;

					if (this.sendAsBase64) {
						const reader = new FileReader();
						reader.readAsDataURL(file);
						reader.onload = (e: any) => {
							const base64 = e.target.result.split(';base64,').pop();
							control.setValue({ base64, file });
							setTimeout(() => {
								this.cdRef.detectChanges();
							});
						};
					} else {
						control.setValue(file);
						setTimeout(() => {
							this.cdRef.detectChanges();
						});
					}
				}
			};
		}

		input.click();
	}

	get formControl() {
		return this.form.get(this.controlName);
	}

	getImageUri(file: File) {
		return ImagenUri(file);
	}

	get imageUri() {
		return ImagenUri(this.file || this.formControl.value?.file);
	}

	getFileName(fullName: string): string {
		const lastDotIndex = fullName.lastIndexOf('.');
		if (lastDotIndex > 0) {
			return fullName.substring(0, Math.min(lastDotIndex, 7));
		}
		return fullName;
	}

	getFileExtension(fullName: string): string {
		const lastDotIndex = fullName.lastIndexOf('.');
		if (lastDotIndex > 0) {
			return fullName.substring(lastDotIndex + 1);
		}
		return '';
	}

	get value() {
		if (this.multiple) {
			return this.sendAsBase64
				? this.files.map((f) => ImagenData(f))
				: this.files.map((f) => ImagenData(f));
		}
		return this.sendAsBase64
			? ImagenData(this.file || this.formControl.value?.file)
			: ImagenData(this.file || this.formControl.value?.file);
	}

	clearFile(): void {
		this.file = null;
		this.files = [];
		if (this.formControl) {
			this.formControl.setValue(null);
			this.formControl.markAsPristine();
			this.formControl.markAsUntouched();
		}
		this.cdRef.detectChanges();
	}
}
