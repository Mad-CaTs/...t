import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	activationManagerNav,
	activationManagerTableMock,
	optStatusMock
} from '../activation-manager/commons/mocks/mock';
import { ModalAccountTreeRangeManagerComponent } from './commons/modals/modal-account-tree-range-manager/modal-account-tree-range-manager.component';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { TableAccountTreeActivationManagerComponent } from '../activation-manager/commons/componentes/table-account-tree-activation-manager/table-account-tree-activation-manager.component';
import { INavigation } from '@init-app/interfaces';
import { PartnerListResponseDTO } from '../../commons/interfaces/partnerList';
import { ISelect } from '@shared/interfaces/forms-control';
import { IPaginationListPartner } from '../../commons/interfaces/pagination';
import { TreeService } from '../../commons/services/tree.service';
import { CommonModule } from '@angular/common';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { TableAccountTreeRangeManagerComponent } from './commons/componentes/table-account-tree-range-manager.component/table-account-tree-range-manager.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { optBrandMock } from '../partner-list/commons/mocks/mock';
import { DashboardRangeManagerComponent } from './commons/componentes/dashboard-range-manager/dashboard-range-manager.component';
import { RangeManagerService } from './commons/service/range-manager.service';
import { IPaginationPartner } from '../../commons/interfaces/paginationPartner';

@Component({
	selector: 'app-range-manager',
	templateUrl: './range-manager.component.html',
	standalone: true,
	imports: [
		CommonModule,
		NavigationComponent,
		SelectComponent,
		TableAccountTreeRangeManagerComponent,
    DashboardRangeManagerComponent,
		InputComponent
	],
	styleUrls: []
})
export default class RangeManagerComponent {
	@ViewChild(TableAccountTreeRangeManagerComponent)
  paginator: TableAccountTreeRangeManagerComponent | undefined;

  public navigation: INavigation[] = activationManagerNav;
  public currentTab: number = 1;
  public form: FormGroup;
  public isLoading: boolean = false;
  public tableData: PartnerListResponseDTO[] = [];
  public totalRecords: number = 0;
  public bodyTree: IPaginationPartner = new IPaginationPartner();
  public userId: any;
  public statesOptions: { content: string; value: any; color?: any }[] = [];
  public rangeOptions: { content: string; value: number }[] = [];
  public allData: PartnerListResponseDTO[] = [];
  public allDataLoaded = false;
  public currentFilter = '';
  public filteredCache: PartnerListResponseDTO[] = [];
  public optStates: ISelect[] = optStatusMock;
  public optLevels: ISelect[] = optBrandMock
disabledUser: any;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private treeService: TreeService,
    private userInfoService: UserInfoService,
    public _rangeManagerService: RangeManagerService
  ) {
    this.userId = this.userInfoService.userInfo.id;
    this.form = this.formBuilder.group({
      searchBy: [''],
      status: [],
      sponsorLevel: [],
      range: [-1]
    });
    this.getStates();
    this.loadRanges();
  }

  ngOnChanges(): void {
    this.resetDataOnTabChange();
  }

  onTabChange(tab: number): void {
    this.currentTab = tab;
    this.resetDataOnTabChange();
  }

  resetDataOnTabChange(): void {
    this.tableData = [];
    this.totalRecords = 0;
    if (this.paginator) {
      this.paginator.resetPagination();
    }
  }

  getStates(): void {
    this.treeService.getListAllStates().subscribe((response) => {
      this.statesOptions = response.map((item: any) => ({
        content: item.nameState,
        value: item.idState,
        color: item.colorRGB
      }));
    });
  }

  private loadRanges(): void {
    this.treeService.getAllRangesSelected().subscribe({
      next: list => {
        this.rangeOptions = [{ content: 'Todos', value: -1 }, ...list.map(r => ({
          content: r.name,
          value: r.idRange
        }))];
      },
      error: err => {
        console.error('Error cargando rangos', err);
        this.rangeOptions = [{ content: 'Todos', value: -1 }];
      }
    });
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
    const searchBy = (u.searchBy || '').toLowerCase();
    const fullName = (u.fullName || '').toLowerCase();
    const sponsor = (u.sponsorName || '').toLowerCase();
    const lastName = fullName.split(' ').slice(-1)[0] || '';

    return (
      searchBy.includes(search) ||
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
    this.bodyTree.idState = selectedStatus == null || selectedStatus === -1 ? -1 : selectedStatus;
    this.bodyTree.sponsorName = '';

    const searchValue = this.form.get('searchBy')?.value?.trim() || '';
    this.bodyTree.partnerSearch = searchValue;

    const selectedRange = this.form.get('range')?.value;
    this.bodyTree.rangeId = selectedRange === -1 ? null : selectedRange;

    this.bodyTree.idUser = this.userId;

    if (this.paginator) {
      this.paginator.resetPagination();
    }

    this.loadData(1, 10);
  }

  loadData(page: number, rows: number): void {
    if (this.currentFilter) {
      this.applyFilterAndSetPage(page, rows);
      return;
    }

    const offset = page - 1;
    this.isLoading = true;

    this.treeService.getListPartnersUpdate(this.bodyTree, offset, rows).subscribe({
      next: (result) => {
        this.tableData = result.data.map((item: any) => this.mapItemWithState(item));
        this.totalRecords = result.total ?? this.tableData.length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
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

  onDetail(id: number): void {
    const ref = this.modal.open(ModalAccountTreeRangeManagerComponent, { centered: true });
    const modal = ref.componentInstance as ModalAccountTreeRangeManagerComponent;
    modal.id = id;
  }
}