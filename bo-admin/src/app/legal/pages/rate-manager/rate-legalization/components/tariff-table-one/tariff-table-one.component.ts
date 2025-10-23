import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LegalService } from '@app/legal/services/LegalService';
import { ILegalRateOne, ITariffItem } from '@interfaces/legal-module.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tariff-table-one',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './tariff-table-one.component.html',
	styleUrls: ['./tariff-table-one.component.scss']
})
export class TariffTableOneComponent {
	@Input() data: ILegalRateOne[] = [];

	editItemX: ILegalRateOne = {} as ILegalRateOne;
	editItem?: ILegalRateOne;

	localOptions = [
		{ id: 1, name: 'Lima' },
		{ id: 2, name: 'Provincia' },
		{ id: 3, name: 'Extranjero' }
	];

	//
	@ViewChild('editModal') editModal: TemplateRef<any> = {} as TemplateRef<any>;

	constructor(private modalService: NgbModal, private legalService: LegalService) {}

	openEditModal(item: ILegalRateOne): void {
		this.editItem = { ...item };
		this.modalService.open(this.editModal);
	}

	saveChangesX(): void {
		console.log('Cambios guardados:', this.editItem);

		this.modalService.dismissAll();
	}

	saveChangesXX(): void {
		const requestBody = {
			legalType: this.editItemX.legalType,
			documentType: this.editItemX.documentType,
			localType: this.editItemX.localType,
			price: this.editItemX.price,
			status: this.editItemX.status
		};

		this.legalService.editRate(requestBody).subscribe({
			next: (res) => {
				console.log('Tarifa actualizada:', res);
				const index = this.data.findIndex(
					(item) =>
						item.legalType === this.editItemX.legalType &&
						item.documentType === this.editItemX.documentType &&
						item.localType === this.editItemX.localType
				);

				if (index !== -1) {
					this.data[index] = { ...this.editItemX };
				}

				this.modalService.dismissAll();
			},
			error: (err) => {
				console.error('Error al guardar cambios:', err);
			}
		});
	}

	saveChanges(): void {
		if (!this.editItem) return;

		const requestBody = {
			legalType: this.editItem.legalType,
			documentType: this.editItem.documentType,
			localType: this.editItem.localType,
			price: this.editItem.price,
			status: this.editItem.status
		};

		this.legalService.editRate(requestBody).subscribe({
			next: (res) => {
				console.log('Tarifa actualizada:', res);
				const index = this.data.findIndex(
					(item) =>
						item.legalType === this.editItem!.legalType &&
						item.documentType === this.editItem!.documentType &&
						item.localType === this.editItem!.localType
				);

				if (index !== -1) {
					this.data[index] = { ...this.editItem! };
				}

				this.modalService.dismissAll();
			},
			error: (err) => {
				console.error('Error al guardar cambios:', err);
			}
		});
	}

	onStatusChange(event: Event): void {
		if (!this.editItem) return;
		const target = event.target as HTMLInputElement;
		this.editItem.status = target.checked ? 1 : 0;
	}
}
