import { Component, ViewChild } from '@angular/core';
import {
	activationManagerNav,
	activationManagerTableMock,
	optLevelMock,
	optNearToInvalidateMock,
	optStatusMock
} from './commons/mocks/mock';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { INavigation } from '@init-app/interfaces';
import { ISelect } from '@shared/interfaces/forms-control';
import ModalAccountTreeActivationManagerDetailComponent from './commons/modals/modal-account-tree-activation-manager-detail/modal-account-tree-activation-manager-detail.component';
import { TableAccountTreeActivationManagerComponent } from './commons/componentes/table-account-tree-activation-manager/table-account-tree-activation-manager.component';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { PartnerListResponseDTO } from '../../commons/interfaces/partnerList';
import { IPaginationListPartner } from '../../commons/interfaces/pagination';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { TreeService } from '../../commons/services/tree.service';
import { ProductService } from 'src/app/profiles/pages/partner/pages/my-products/commons/services/product-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';

@Component({
	selector: 'app-activation-manager',
	templateUrl: './activation-manager.component.html',
	styleUrls: ['./activation-manager.component.scss'],
	standalone: true,
	imports: [
		NavigationComponent,
		CommonModule,
		SelectComponent,
		InputComponent,
		TableAccountTreeActivationManagerComponent,
		ReactiveFormsModule
	]
})
export default class ActivationManagerComponent {
	@ViewChild(TableAccountTreeActivationManagerComponent)
	paginator: TableAccountTreeActivationManagerComponent | undefined;

	public navigation: INavigation[] = activationManagerNav;
	public currentTab: number = 1;
	public statesOptions: { content: string; value: any; color?: any }[] = [];
	public optStatus: ISelect[] = optStatusMock;
	public optNearToInvalidate: ISelect[] = optNearToInvalidateMock;
	public optLevels: ISelect[] = optLevelMock;

	bodyTree: IPaginationListPartner = new IPaginationListPartner();
	public form: FormGroup;
	userId: any;
	tableData: PartnerListResponseDTO[] = [];
	totalRecords: number = 0;
	isLoading: boolean = false;
	public disabledUser: boolean = this.userInfoService.disabled;

	allData: PartnerListResponseDTO[] = []; 
	allDataLoaded = false; 
	currentFilter = '';
	filteredCache: PartnerListResponseDTO[] = [];

	constructor(
		private formBuilder: FormBuilder,
		private modal: NgbModal,
		private treeService: TreeService,
		private userInfoService: UserInfoService,
		private productService: ProductService
	) {
		this.userId = userInfoService.userInfo.id;
		this.form = formBuilder.group({
			searchBy: [''],
			status: [],
			brand: [],
			sponsorLevel: [],
			username: ['']
		});
		this.getStates();
	}

	ngOnChanges(): void {
		this.resetDataOnTabChange();
	}

	onTabChange(tab: number): void {
		this.currentTab = tab;
		console.log('Pestaña actual:', this.currentTab);
		this.resetDataOnTabChange();
	}

	resetDataOnTabChange(): void {
		this.tableData = [];
		this.totalRecords = 0;
		if (this.paginator) {
			this.paginator.resetPagination();
		}
	}


	private mapItemWithState(item: any) {
		const state = this.statesOptions.find((s) => s.value === item.idState);
		return {
			...item,
			color: state ? state.color : '#000000',
			stateName: state ? state.content : 'Unknown'
		};
	}

	private matchesSearch(u: any, search: string) {
		if (!search) return true;
		const userName = (u.userName || '').toLowerCase();
		const fullName = (u.fullName || '').toLowerCase();
		const sponsor = (u.sponsorName || '').toLowerCase();
		const lastName = fullName.split(' ').slice(-1)[0] || '';

		return (
			userName.includes(search) ||
			lastName.includes(search) ||
			fullName.includes(search) ||
			sponsor.includes(search)
		);
	}

	private applyFilterAndSetPage(page: number, rows: number) {
		const start = (page - 1) * rows;
		const search = this.currentFilter;

		const filtered = this.allData.filter((u) => this.matchesSearch(u, search));
		this.filteredCache = filtered;
		this.totalRecords = filtered.length;
		this.tableData = filtered.slice(start, start + rows);
	}

	onSearch(): void {
		const selectedStatus = this.form.get('status')?.value;
		this.bodyTree.idState = selectedStatus === null || selectedStatus === -1 ? -1 : selectedStatus;

		const sponsorLevelValue = this.form.get('sponsorLevel')?.value;
		this.bodyTree.sponsorLevel =
			sponsorLevelValue === null || sponsorLevelValue === undefined ? -1 : sponsorLevelValue;

		this.bodyTree.idUser = this.userId;

		const searchValue = this.form.get('searchBy')?.value?.trim() || '';
		this.bodyTree.name = searchValue;

		const usernameValue = this.form.get('username')?.value?.trim() || '';
		this.bodyTree.username = usernameValue;
		this.loadData(1, 10);
	}

	getStates(): void {
		this.treeService.getListAllStates().subscribe((response) => {
			this.statesOptions = response.map((item: any) => ({
				content: item.nameState,
				value: item.idState,
				color: item.colorRGB
			}));
			console.log('Estados obtenidos:', this.statesOptions);
		});
	}

	loadData(page: number, rows: number): void {
		if (this.currentFilter) {
			this.applyFilterAndSetPage(page, rows);
			return;
		}

		const offset = page - 1;
		this.isLoading = true;

		this.treeService.getListPartners(this.bodyTree, offset, rows).subscribe({
			next: (result) => {
				console.log('Respuesta backend:', result); 
				const mapped = result.data.map((item: any) => this.mapItemWithState(item));
				this.tableData = mapped;
				this.totalRecords = result.total ?? mapped.length;
				this.isLoading = false;
			},
			error: (err) => {
				console.error('Error en getListPartners:', err);
				this.isLoading = false;
			}
		});
	}

	public onDetail(id: number): void {
		const ref = this.modal.open(ModalAccountTreeActivationManagerDetailComponent, { centered: true });
		const modal = ref.componentInstance as ModalAccountTreeActivationManagerDetailComponent;

		modal.id = id;
	}

	onPageChange(event: any): void {
		const page = event.page + 1;
		const rows = event.rows;
		if (this.currentFilter) {
			this.applyFilterAndSetPage(page, rows);
		} else {
			this.loadData(page, rows);
		}
	}

	onRefresh(event: any): void {
		const rows = event.rows;
		if (this.currentFilter) {
			this.applyFilterAndSetPage(1, rows);
		} else {
			this.loadData(1, rows);
		}
	}
}
