import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { ITableRentExemption } from '@interfaces/rent-exemption';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConciliationApprobationModalComponent } from '../modal/conciliation-approbation-modal/conciliation-approbation-modal.component';
import { ConciliationService } from '../../../exoneration/services/conciliation.service';

@Component({
	selector: 'app-table-conciliation-validator',
	templateUrl: './table-conciliation-validator.component.html',
	styleUrls: ['./table-conciliation-validator.component.scss']
})
export class TableConciliationValidatorComponent implements OnInit, OnChanges {
	@Input() tableData: any[] = [];
	@Input() totalRecords: number = 0;
	@Input() refresh: boolean = false;
	@Input() loading: boolean = false;
	@Input() disable: boolean = false;
	@Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
	loadingButton: { [key: number]: boolean } = {};
	readonly table: TableModel<any>;

	constructor(private tableService: TableService, private modal: NgbModal, private conciliationService: ConciliationService,
		private cdr: ChangeDetectorRef
	) {
		this.table = this.tableService.generateTable<any>({
			headers: [
				'N°',
				'Fecha de límite',
				'Usuario',
				'Nombres y apellidos',
				'Mes - Año',
				'Monto',
				'Acciones'
			],
			noCheckBoxes: true
		});
		this.table.data = [];
	}

	ngOnInit(): void {

	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['tableData']) {
			this.table.data = this.tableData;
		}
	}

	onPageChange(page: number) {
		this.pageChange.emit(page);
	}

	approveConciliation(data: any) {
		this.loadingButton[data.id] = true;
		this.conciliationService.getConciliationsDetailsForValidation(data.id).subscribe({
			next: (result) => {
				this.loadingButton[data.id] = false;
				this.cdr.detectChanges();
				const modalRef = this.modal.open(ConciliationApprobationModalComponent, { centered: true });
				modalRef.componentInstance.conciliation = result.data;
				modalRef.componentInstance.disable = this.disable;
				modalRef.result.then(
					() => {
						this.pageChange.emit(1);
					},
					() => {
					}
				);
			},
			error: () => {
				this.loadingButton[data.id] = false;
			}
		});
	}
}