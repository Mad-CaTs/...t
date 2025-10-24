import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { PackageToTransfer } from '../../commons/interfaces/new-partner-select-package';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-package-to-transfer',
	standalone: true,
	imports: [CommonModule, RadioButtonModule, DividerModule, FormsModule, ReactiveFormsModule],
	templateUrl: './package-to-transfer.component.html',
	styleUrl: './package-to-transfer.component.scss'
})
export class PackageToTransferComponent implements OnInit {
	@Input() package: PackageToTransfer;
	public statusName: string = '';
	public selected: number = null;
	@Output() packageSelected = new EventEmitter<number>();
	@Input() form: FormGroup;
	@Input() controlName: string;

	ngOnInit() {
		this.setStatusColor();
	}

	setStatusColor() {
		if (this.package.idStatus === 16) {
			this.statusName = 'PVCA';
			return {
				'background-color': '#FFFC4D33',
				color: '#FFFC4D'
			};
		}
		if (this.package.idStatus === 1) {
			this.statusName = 'Activo';
			return {
				'background-color': '#16A34A33',
				color: '#16A34A'
			};
		}
		return {
			'background-color': '#EDEDED',
			color: '#ACAFB3'
		};
	}

	selectPackage() {
		this.form.get(this.controlName)?.setValue(this.package.idSubscription);
		this.packageSelected.emit(this.package.idSubscription);
	}
}
