import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	AfterViewChecked,
	ChangeDetectorRef
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IPlacementListTable } from '../../../../../commons/interfaces';
import { TableService } from 'src/app/profiles/pages/ambassador/commons/services/table/table.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { DropdownModule } from 'primeng/dropdown';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { IPlacement } from '../../interfaces/placement.interface';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { PlacementService } from '../../services/placement.service';
import { TreeService } from '../../../../../commons/services/tree.service';
import { ModalRejectPlacementComponent } from '../../modals/modal-reject-placement/modal-reject-placement.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core';

@Component({
	selector: 'app-table-account-tree-placement',
	templateUrl: './table-account-tree-placement.component.html',
	standalone: true,
	imports: [
		CommonModule,
		PaginationComponent,
		TableComponent,
		DropdownModule,
		InputComponent,
		ModalRejectPlacementComponent,
		SelectComponent
	],
	styleUrls: []
})
export class TableAccountTreePlacementComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
	@Input() dataBody: IPlacementListTable[] = [];
	@Input() btnText: string = 'Posicionar';
	@Input() sponsorId: number = 0;
	@Input() fullnames: { name: string; id: number }[] = [];
	@Input() selectedId: number = 1;
	@Input() dataUnplacement: IPlacementListTable[] = [];
	@Input() loading: boolean = false;
	@Input() loadingUnplacement: boolean = false;

	public id: string = '';
	public selected: FormControl = new FormControl();
	public selectedFullname: { name: string; id: number } | undefined;
	public form: FormGroup;
	@Output() btnClick = new EventEmitter<{
		selectedData: IPlacementListTable | undefined;
		fullnames: { name: string; id: number }[];
	}>();

	@Output() selectedData = new EventEmitter<IPlacementListTable>();

	placement: IPlacement | undefined;

	public body = {
		idSocioMaster: 0,
		idSocioNuevo: 0
	};

	public filteredData: IPlacementListTable[] = [];
	public membershipOptions: { label: string; value: any }[] = [];
	public statesOptions: { content: string; value: any; color?: any }[] = [];
	private dataBodyInitialized: boolean = false;

	constructor(
		public userInfoService: UserInfoService,
		private placementService: PlacementService,
		private treeService: TreeService,
		public tableService: TableService,
		private cdr: ChangeDetectorRef,
		private modalService: NgbModal
	) {
		this.id = tableService.addTable(this.dataBody);
	}

	ngOnInit(): void {
		this.form = new FormGroup({
			selected: new FormControl(),
			searchBy: new FormControl(),
			membership: new FormControl(),
			state: new FormControl()
		});
		this.getListMemberships();
		this.getStates();

		this.form.get('searchBy')?.valueChanges.subscribe((searchTerm) => {
			this.filterTable();
		});

		this.form.get('membership')?.valueChanges.subscribe((value) => {
			this.filterTable();
		});

		this.form.get('state')?.valueChanges.subscribe((value) => {
			this.filterTable();
		});
		this.filteredData = [...this.dataBody];
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['dataBody'] && changes['dataBody'].currentValue.length > 0) {
			this.applyStatesToData();
			if (this.selectedId === 1) {
				this.filteredData = [...this.dataBody];
				this.loading = false;
			} else if (this.selectedId === 2) {
				this.filteredData = [...this.dataUnplacement];
				this.loading = this.loadingUnplacement;
			}
			this.updateTableData(this.filteredData);
			this.dataBodyInitialized = true;
		}
	}

	ngAfterViewChecked(): void {
		if (!this.dataBodyInitialized && this.dataBody.length > 0) {
			this.applyStatesToData();
			if (this.selectedId === 1) {
				this.filteredData = [...this.dataBody];
			} else if (this.selectedId === 2) {
				this.filteredData = [...this.dataUnplacement];
			}
			this.updateTableData(this.filteredData);
			this.dataBodyInitialized = true;
		}
		this.cdr.detectChanges();
	}

	ngOnDestroy(): void {
		this.tableService.deleteTable(this.id);
	}

	onClickBtn() {
		const id = this.body.idSocioNuevo;
		const selectedData = this.dataBody.find((item) => item.id === id);
		let component;

		if (selectedData) {
			if (selectedData?.status === 1) {
				this.btnClick.emit({
					selectedData: selectedData,
					fullnames: this.fullnames
				});
				this.updateBody();
			} else {
				this.openRejectModal();
			}
		} else {
			console.log('Error en el clickBtn, no hay data seleccionada');
		}
	}

	openRejectModal() {
		this.modalService.open(ModalRejectPlacementComponent, {
			centered: true
		});
	}

	get table() {
		return this.tableService.getTable<IPlacementListTable>(this.id);
	}

	private updateTableData(data: IPlacementListTable[]): void {
		this.tableService.updateTable(data, this.id);
	}

	private filterTable(): void {
		const searchTerm = this.form.get('searchBy')?.value || '';
		const selectedMembership = this.form.get('membership')?.value;
		const selectedState = this.form.get('state')?.value;
		let filteredData = [...this.dataBody];
		if (searchTerm) {
			filteredData = filteredData.filter(
				(item) =>
					item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.membership.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
			);
		}

		if (selectedMembership) {
			filteredData = filteredData.filter((item) => item.membership === selectedMembership);
		}

		if (selectedState !== null && selectedState !== undefined) {
			filteredData = filteredData.filter((item) => item.status === selectedState);
		}
		

		this.filteredData = filteredData.map((item) => {
			const state = this.statesOptions.find((state) => state.value === item.status);
			return {
				...item,
				stateContent: state ? state.content : 'Estado desconocido',
				stateColor: state ? state.color : '#000000'
			};
		});
		this.updateTableData(this.filteredData);
	}

	private updateBody(idNuevo?: number): void {
		this.selected.setValue(idNuevo);

		this.body.idSocioMaster = this.sponsorId;
		this.body.idSocioNuevo = idNuevo || this.body.idSocioNuevo;
	}

	private getListMemberships(): void {
		this.placementService.getListAllMembership().subscribe((response) => {
			this.membershipOptions = response.map((item: any) => ({
				content: item.name,
				value: item.name
			}));
		});
	}

	private getStates() {
		this.treeService.getListAllStates().subscribe((response) => {
			this.statesOptions = response.map((item: any) => ({
				content: item.nameState,
				value: item.idState,
				color: item.colorRGB
			}));
			this.applyStatesToData();
			this.updateTableWithStates();
		});
	}

	private applyStatesToData(): void {
		this.dataBody = this.dataBody.map((item) => {
			const state = this.statesOptions.find((state) => state.value === item.status);
			return {
				...item,
				stateContent: state ? state.content : 'Estado desconocido',
				stateColor: state ? state.color : '#000000'
			};
		});

		this.dataUnplacement = this.dataUnplacement.map((item) => {
			const state = this.statesOptions.find((state) => state.value === item.status);
			return {
				...item,
				stateContent: state ? state.content : 'Estado desconocido',
				stateColor: state ? state.color : '#000000'
			};
		});
	}

	private updateTableWithStates(): void {
		if (this.selectedId === 1) {
			this.filteredData = [...this.dataBody];
		} else if (this.selectedId === 2) {
			this.filteredData = [...this.dataUnplacement];
		}
		this.filterTable();
	}

	private hexToRgba(hex: string, opacity: number, factor: number): string {
		const bigint = parseInt(hex.replace('#', ''), 16);
		let r = (bigint >> 16) & 255;
		let g = (bigint >> 8) & 255;
		let b = bigint & 255;

		r = Math.floor(r * factor);
		g = Math.floor(g * factor);
		b = Math.floor(b * factor);

		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

	getTransparentColor(color: string): string {
		return this.hexToRgba(color, 0.4, 1);
	}

	getSolidColor(color: string): string {
		return this.hexToRgba(color, 1, 0.8);
	}
}
