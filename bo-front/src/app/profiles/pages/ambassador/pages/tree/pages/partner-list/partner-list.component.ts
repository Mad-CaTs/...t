import { IPaginationPartner } from './../../commons/interfaces/paginationPartner';
import { Component, ViewChild } from '@angular/core';

import {
  optBrandMock,
  optStatesMock,
  partnerListTableMock,
  searchAsMock,
} from './commons/mocks/mock';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDetailAccountTreePartnerListComponent } from './commons/modals/modal-detail-account-tree-partner-list/modal-detail-account-tree-partner-list.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { TableAccountTreePartnerListComponent } from './commons/components/table-account-tree-partner-list/table-account-tree-partner-list.component';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { TreeService } from '../../commons/services/tree.service';
import { IPaginationListPartner } from '../../commons/interfaces/pagination';
import { PartnerListResponseDTO } from '../../commons/interfaces/partnerList';
import { CommonModule } from '@angular/common';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { finalize } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    SelectComponent,
    TableAccountTreePartnerListComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  styleUrls: [],
})

export default class PartnerListComponent {
  @ViewChild(TableAccountTreePartnerListComponent)
  paginator: TableAccountTreePartnerListComponent | undefined;
  public form: FormGroup;
  public statesOptions: { content: string; value: any; color?: any }[] = [];
  public optStates = optStatesMock;
  public optBrands = optBrandMock;
  public first: number = 0;
  tableData: PartnerListResponseDTO[] = [];
  userId: any;
  rangeOptions: { content: string; value: number }[] = [];
  bodyTree: IPaginationPartner = new IPaginationPartner();
  totalRecords: number = 0;
  isLoading: boolean = false;
  showModal = false;
  public disabledUser: boolean = this.userInfoService.disabled;
  exporting = false;

  constructor(private formBuilder: FormBuilder, private modal: NgbModal,
    private treeService: TreeService, private userInfoService: UserInfoService
  ) {
    this.userId = userInfoService.userInfo.id;
    this.form = formBuilder.group({
      searchBy: [''],
      searchSponsor: [''],
      range: [],
      status: [],
      brand: [],
    });
    this.getStates();
    this.loadRanges();
  }
  onSearch() {
    this.bodyTree = {

      partnerSearch: this.form.value.searchBy?.trim() ?? '',
      sponsorName: this.form.value.searchSponsor?.trim() ?? '',
      rangeId: Number(this.form.value.range ?? -1),
      idState: this.form.value.status ?? -1,
      branch: this.form.value.brand ?? -1,
      idUser: this.userId,
      username: this.form.value.username?.trim() ?? ''
    };

    if (this.paginator) {
      this.paginator.resetPagination();
    }
    this.loadData(1, 10);
  }

  onExport(): void {
    if (this.disabledUser) return;

    const payload = {
      idUser: this.userId,
      sponsorName: this.form.value.searchSponsor?.trim() ?? '',
      partnerSearch: this.form.value.searchBy?.trim() ?? '',
      rangeId: Number(this.form.value.range ?? -1),
      idState: Number(this.form.value.status ?? -1),
      branch: this.form.value.brand ?? -1
    };

    this.exporting = true;
    this.treeService.exportListPartnersExcel(payload).subscribe({
      next: (resp) => {
        this.downloadExcelFromResponse(resp, payload);
        this.exporting = false;
      },
      error: (err) => {
        console.error('Error exportando Excel', err);
        this.exporting = false;
      }
    });
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

  onOpenDetail(row: PartnerListResponseDTO) {
    const ref = this.modal.open(ModalDetailAccountTreePartnerListComponent, {
      centered: true,
      size: 'xl'
    });

    const modal = ref.componentInstance as ModalDetailAccountTreePartnerListComponent;
    modal.id = row.idUser;
    modal.summary = row;
  }

  loadData(page: number, rows: number) {
    const offset = page - 1;
    this.isLoading = true;

    this.treeService.getListPartnersUpdate(this.bodyTree, offset, rows)
      .subscribe({
        next: (result) => {

          this.tableData = [];
          this.tableData = result.data.map((item: any) => {
            const state = this.statesOptions.find(s => s.value === item.idState);
            return {
              ...item,
              color: state ? state.color : '#000000',
              stateName: state ? state.content : 'Unknown'
            }
          });

          this.totalRecords = result.total;
          this.isLoading = false;
        },
        error: (err) => console.error('Error cargando data', err)
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


  onPageChange(event: any): void {
    const page = event.page + 1;
    const rows = event.rows;
    this.loadData(page, rows);
  }

  onRefresh(event: any): void {
    const rows = event.rows;
    this.loadData(1, rows);
  }

  private downloadExcelFromResponse(resp: HttpResponse<Blob>, payload: any) {
    const blob = resp.body ?? new Blob();

    const cd = resp.headers.get('Content-Disposition') || resp.headers.get('content-disposition') || '';
    const m = cd.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
    const suggested = m ? decodeURIComponent(m[1]) : '';

    const readableBranch = (b: any) => {
      if (b === null || b === undefined || b === '' || Number(b) === -1) return 'all';
      return String(b);
    };

    const fallback = `partners_${readableBranch(payload.branch)}.xlsx`;
    const filename = suggested || fallback;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

}
