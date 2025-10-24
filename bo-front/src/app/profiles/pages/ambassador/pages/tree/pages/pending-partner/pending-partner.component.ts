import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { IPaginationListPartner } from '../../commons/interfaces/pagination';
import { PartnerListResponseDTO } from '../../commons/interfaces/partnerList';
import { TreeService } from '../../commons/services/tree.service';
import { optStatesMock, optBrandMock } from '../partner-list/commons/mocks/mock';
import { TablePendingPartnerListComponent } from './commons/components/table-pending-partner-list/table-pending-partner-list.component';

@Component({
  selector: 'app-pending-partner',
  standalone: true,
  imports: [
    CommonModule,
    TablePendingPartnerListComponent,
    InputComponent,
    SelectComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './pending-partner.component.html',
  styleUrl: './pending-partner.component.scss'
})
export class PendingPartnerComponent {
  @ViewChild(TablePendingPartnerListComponent)
  paginator: TablePendingPartnerListComponent | undefined;
  public form: FormGroup;
  public statesOptions: { content: string; value: any; color?: any }[] = [];
  public optStates = optStatesMock;
  public optBrands = optBrandMock;
  tableData: PartnerListResponseDTO[] = [];
  userId: any;
  bodyTree: IPaginationListPartner = new IPaginationListPartner();
  totalRecords: number = 0;
  isLoading: boolean = false;
  public disabledUser: boolean = this.userInfoService.disabled;

  constructor(private formBuilder: FormBuilder, private modal: NgbModal,
    private treeService: TreeService, private userInfoService: UserInfoService
  ) {
    this.userId = userInfoService.userInfo.id;
    this.form = formBuilder.group({
      searchBy: [''],
      status: [],
      brand: [],
    });
    this.getStates();
  }

  onSearch() {
    this.bodyTree.name = this.form.get('searchBy').value;
    this.bodyTree.idState = this.form.get('status').value == null ? -1 : this.form.get('status').value;
    this.bodyTree.branch = this.form.get('brand').value == null ? -1 : this.form.get('brand').value;;
    this.bodyTree.idUser = this.userId;
    if (this.paginator) {
      this.paginator.resetPagination();
    }
    this.loadData(1, 10);
  }

  private getStates() {
    this.treeService.getListAllStates().subscribe((response) => {
      this.statesOptions = response.map((item: any) => ({
        content: item.nameState,
        value: item.idState,
        color: item.colorRGB
      }));
    });
  }

  loadData(page: number, rows: number) {
    const offset = (page - 1);
    this.isLoading = true;
    this.treeService.getListPartners(this.bodyTree, offset, rows).subscribe({
      next: (result) => {
        this.tableData = [];
        this.tableData = result.data.map((item: any) => {
          const state = this.statesOptions.find(s => s.value === item.idState);
          return {
            ...item,
            color: state ? state.color : '#000000',
            stateName: state ? state.content : 'Unknown'
          };
        });
        this.tableData = this.tableData.filter((data: any) => data.idState == 4);
        this.totalRecords = result.total;
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: any): void {
    const page = event.page + 1;
    const rows = event.rows;
    this.loadData(page, rows);
  }

  onRefresh(event: any): void {
    const rows = event.rows;
    this.loadData(1, rows);
  }
}
