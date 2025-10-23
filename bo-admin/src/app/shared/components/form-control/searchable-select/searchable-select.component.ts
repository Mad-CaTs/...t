import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';

@Component({
	selector: 'app-searchable-select',
	templateUrl: './searchable-select.component.html',
	styleUrls: ['./searchable-select.component.scss']
})
export class SearchableSelectComponent {
	@Input() label: string = '';
	@Input() placeholder: string = 'Selecciona uno';
	@Input() options: ISelectOpt[] = [];
	@Input() searchFn!: (term: string) => Observable<ISelectOpt[]>;
	@Input() formGroup!: FormGroup;
	@Input() controlName!: string;

	@Output() searchTermChanged = new EventEmitter<string>();
	@Output() loading = new EventEmitter<boolean>();
	@Input() isLoading: boolean = false;

	displayText: string = '';

	search = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			tap((term) => {
				if (term.length >= 3) {
					this.loading.emit(true);
				}
			}),
			switchMap((term) => {
				if (term.length < 3) {
					this.loading.emit(false);
					return of([]);
				}

				this.searchTermChanged.emit(term);

				return (this.searchFn ? this.searchFn(term) : of([])).pipe(
					finalize(() => this.loading.emit(false))
				);
			})
		);

	formatter = (opt: ISelectOpt) => opt?.text || '';

	// Maneja la selección de un ítem
	onItemSelected(event: { item: ISelectOpt }) {
		const selectedItem = event.item;
		this.formGroup.get(this.controlName)?.setValue(selectedItem.id);
		this.displayText = selectedItem.text;
	}

	onInputChange(value: string) {
		this.displayText = value;
		if (!value) {
			this.formGroup.get(this.controlName)?.setValue(null);
		}
	}

	get formValue(): AbstractControl {
		return this.formGroup.get(this.controlName) as AbstractControl;
	}

	get existErrors() {
		return this.formValue.touched && this.formValue.errors;
	}
}
