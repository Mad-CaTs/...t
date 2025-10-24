import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	SimpleChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { TableService } from 'src/app/profiles/pages/ambassador/commons/services/table/table.service';
import { IPaymentDetailComissionTable } from '../../../../../interfaces/payments-and-comissions.interfaces';
import { CommonModule } from '@angular/common';
import { TablePaginationService } from '@shared/services/table-pagination.service';

@Component({
	selector: 'app-table-payments-comission',
	templateUrl: './table-payments-comission.component.html',
	standalone: true,
	imports: [CommonModule, PaginationComponent, TableComponent],
	styleUrl: './table-payments-comission.component.scss'
})
export class TablePaymentsComissionComponent implements OnInit {
	@Input() dataBody: IPaymentDetailComissionTable[] = [];
	@Input() isDirectRecomendation: boolean = false;
	@Input() isProductComission: boolean = false;
	isloading: boolean = true;
	@Input() hasData: boolean = false;
	/*   private initialLoad: boolean = true;
	 */
	@Output() btnClick = new EventEmitter<any>();
	@Output() selectionChange = new EventEmitter<any>();
	@Input() customHeaders: string[] | null = null;

	public id: string = '';
	public selected: FormControl = new FormControl(1);
	public selectedItem: any;

	constructor(public tableService: TablePaginationService, private cdr: ChangeDetectorRef) {
		this.id = tableService.addTable(this.dataBody, 999);
	}

	ngOnInit(): void {
		this.selected.setValue(this.dataBody[0]?.id || 1);
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.isloading = true;
		if (changes['dataBody']) {
			if (this.dataBody) {
				this.selected.setValue(this.dataBody[0]?.id || 1);
				this.tableService.updateTable(this.dataBody, this.id, 999);
				this.isloading = false;
			} else {
				setTimeout(() => {
					this.isloading = false;
				}, 1000);
			}
		}
	}

	ngOnDestroy(): void {
		this.tableService.deleteTable(this.id);
	}

	onSelectionChange(item: any) {
		this.selectedItem = item;
		this.selectionChange.emit(this.selectedItem);
	}

	onClickBtn() {
		if (this.selectedItem) {
			this.btnClick.emit(this.selectedItem);
		} else {
			console.warn('No hay un elemento seleccionado para enviar al padre.');
		}
	}

	get table() {
		return this.tableService.getTable<IPaymentDetailComissionTable>(this.id);
	}

	get headers() {
		if (this.customHeaders && this.customHeaders.length > 0) {
			return this.customHeaders;
		}

		const result = [
			'Nombre',
			'Tipo de Comisión',
			'Nivel',
			'Fecha',
			'Puntaje',
			'Porcentaje (%)',
			'Monto',
			'Por estado'
		];

		if (this.isDirectRecomendation) result.push('Por nivel');
		else if (this.isProductComission) result[result.length - 1] = 'Por Tipo de Monto';
		else result.push('Por Tipo de Membresía');

		return result;
	}

	get minWidthHeaders() {
		const result = [280, 300, 100, 150, 100, 150, 200, 120];

		if (this.isProductComission) result.push(170);
		else if (!this.isDirectRecomendation) result.push(...[120, 202]);

		return result;
	}
}
