import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { tableDataMock } from './mock';

import { TableModel } from '@app/core/models/table.model';

import type { Subscription } from 'rxjs';
import type { ITableWalletPaymentBox } from '@interfaces/payment-validate.interface';

import {
	ModalLoadingComponent,
	ModalManualValidatorComponent,
	ModalPaymentCronogramComponent,
	ModalMassiveValidatorComponent
} from '@app/validation-payments/components/modals';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '@app/core/services/table.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
	selector: 'app-wallet-payment-box',
	standalone: true,
	imports: [CommonModule, TablesModule, InlineSVGModule],
	templateUrl: './wallet-payment-box.component.html',
	styleUrls: ['./wallet-payment-box.component.scss']
})
export class WalletPaymentBoxComponent implements OnDestroy {
	public readonly table: TableModel<ITableWalletPaymentBox>;
	public prevalidate: boolean = false;

	private subs: Subscription[] = [];

	constructor(
		private tableService: TableService,
		private modalService: NgbModal,
		private cdfRef: ChangeDetectorRef
	) {
		this.table = this.tableService.generateTable<ITableWalletPaymentBox>({
			headers: [
				'Fecha',
				'Usuario',
				'Nombres',
				'D.N.I',
				'Concepto',
				'Banco',
				'Tipo de cuenta',
				'N° de Operación',
				'Monto',
				'Estado',
				'Estado Prevalidador',
				'Acciones'
			]
		});
		this.table.data = tableDataMock;
	}

	ngOnDestroy(): void {
		this.subs.forEach((s) => s.unsubscribe());
	}

	/* === Events === */
	public onPreValidate() {
		const ref = this.modalService.open(ModalLoadingComponent, { centered: true });
		const modal = ref.componentInstance as ModalLoadingComponent;

		modal.finishLoad.subscribe(() => {
			this.prevalidate = true;
			this.cdfRef.detectChanges();
		});
	}

	public onValidate() {
		this.modalService.open(ModalMassiveValidatorComponent, { centered: true });
	}

	public onValidateManual(multiple = false) {
		const ref = this.modalService.open(ModalManualValidatorComponent, { centered: true });
		const modal = ref.componentInstance as ModalManualValidatorComponent;

		modal.multiple = multiple;
	}

	public onViewCronogram() {
		this.modalService.open(ModalPaymentCronogramComponent, { centered: true, size: 'lg' });
	}
}
