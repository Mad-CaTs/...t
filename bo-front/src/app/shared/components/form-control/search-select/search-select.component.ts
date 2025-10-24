import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { SelectComponent } from '../select/select.component';
import { InputComponent } from '../input/input.component';

@Component({
	selector: 'app-search-select',
	templateUrl: './search-select.component.html',
	styleUrls: ['./search-select.component.scss'],
	standalone: true,
	imports: [CommonModule, FormsModule, SelectComponent, InputComponent]
})
export class SearchSelectComponent {
	searchText: string = '';
	@Input() options: any[] = [];
	@Output() searchInput = new EventEmitter<string>();
	@Output() selected = new EventEmitter<any>();
	selectedValue: any = null;
	filteredOptions: any[] = [];
	isLoading: boolean = false;
	@Input() placeholderText: string = 'Seleccione una opción';
	@Input() filteredOptionsHidden: boolean = false;
	form: FormGroup = new FormGroup({
		searchBy: new FormControl('', [Validators.minLength(2)]),
		selectedOption: new FormControl('')
	});

	onClickBtn() {
		const searchText = this.form.get('searchBy')?.value;
		this.isLoading = true;
		this.searchInput.emit(searchText);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['options']) {
			this.isLoading = false;

			this.filteredOptions = [...this.options];
			this.searchText = this.form.get('searchBy')?.value || '';
			if (this.filteredOptions.length === 0 && this.searchText) {
				this.placeholderText = 'No hay resultados en la búsqueda';
			} else if (this.filteredOptions.length > 0) {
				this.placeholderText = 'Seleccione una opción';
			}
		}
	}

	ngOnInit() {
		this.onSelectOption();
	}

	/* get selectedOptionValue() {
		return this.form.get('selectedOption')?.value;
	} */

	onSelectOption() {
		this.form.get('selectedOption')?.valueChanges.subscribe((value) => {
			this.selected.emit(value);
		});
		this.form.get('searchBy')?.valueChanges.subscribe((value) => {
			if (!value || value.trim() === '') {
				this.searchInput.emit(value);
			}
		});
	}
	get isSearchButtonEnabled() {
		const searchText = this.form.get('searchBy')?.value;
		return searchText?.length >= 2 && !this.isLoading;
	}
}
