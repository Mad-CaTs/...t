import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { ToastService } from '@app/core/services/toast.service';
import { UserService } from '@app/users/services/user.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { ITableRentExemption } from '@interfaces/rent-exemption';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExonerationApprobationModalComponent } from '../modal/exoneration-approbation-modal/exoneration-approbation-modal.component';

@Component({
	selector: 'app-table-exoneration-historical',
	templateUrl: './table-exoneration-historical.component.html',
	styleUrls: ['./table-exoneration-historical.component.scss']
})
export class TableExonerationHistoricalComponent {
	@Input() tableData: any[] = [];
	@Input() totalRecords: number = 0;
	@Input() refresh: boolean = false;
	@Input() loading: boolean = false;
	@Input() disable: boolean = false;
	@Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
	readonly form: FormGroup;
	readonly table: TableModel<ITableRentExemption>;
	statusOpt: ISelectOpt[] = [];
	packageOpt: ISelectOpt[] = [];
	selectedRowId: number | null = null;
	suscriptions: any[] = [];

	constructor(
		private tableService: TableService,
		private builder: FormBuilder,
		private userService: UserService,
		private cdr: ChangeDetectorRef,
		private modal: NgbModal,
		private toastService: ToastService
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableRentExemption>({
			headers: [
				'N°',
				'Fecha de exoneración',
				'Nombres y apellidos',
				'Usuario',
				'Año',
				'N° operación',
				'RUC',
				'Estado',
				'Acciones'
			],
			noCheckBoxes: true
		});
		this.table.data = [];
	}

	ngOnInit(): void {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['tableData']) {
			this.table.data = this.tableData;
		}
	}

	onPageChange(page: number) {
		this.pageChange.emit(page);
	}

	approveExoneration(data: any) {
		const modalRef = this.modal.open(ExonerationApprobationModalComponent, { centered: true });
		modalRef.componentInstance.rentExemption = data;
		modalRef.componentInstance.disable = this.disable;
		modalRef.result.then(
			() => {
				this.pageChange.emit(1);
			},
			() => {}
		);
	}
}
