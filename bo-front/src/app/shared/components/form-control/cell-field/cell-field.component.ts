import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ISelect } from '@shared/interfaces/forms-control';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-cell-field',
  standalone: true,
  templateUrl: './cell-field.component.html',
  styleUrl: './cell-field.component.scss',
  imports: [DropdownModule, CommonModule, FormsModule,ReactiveFormsModule],
})
export class CellFieldComponent {
  
  @Input() controlName: string;
	@Input() label: string;
	@Input() placeholder: string;
	@Input() options: ISelect[] = [];
	@Input() form: FormGroup;
	@Input() disabled: boolean;



  onChange(event: DropdownChangeEvent): void {    
		this.form.get(this.controlName).setValue(event.value.value);
	}
 /*  countries: any[] | undefined;

    selectedCountry: string | undefined;

    ngOnInit() {
        this.countries = [
            { name: 'Australia', code: 'AU' },
            { name: 'Brazil', code: 'BR' },
            { name: 'China', code: 'CN' },
            { name: 'Egypt', code: 'EG' },
            { name: 'France', code: 'FR' },
            { name: 'Germany', code: 'DE' },
            { name: 'India', code: 'IN' },
            { name: 'Japan', code: 'JP' },
            { name: 'Spain', code: 'ES' },
            { name: 'United States', code: 'US' }
        ];
    } */

}
