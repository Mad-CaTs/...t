import { Component, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountBankTableDataMock } from './commons/mocks/_mock';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { ITableBankData } from '../../commons/interfaces/account';
import { TableService } from '../../../../commons/services/table/table.service';
import { AccountDetailDeleteBankDataModalComponent } from './commons/modals/account-detail-delete-bank-data-modal/account-detail-delete-bank-data-modal.component';
import { AccountEditBankDataModalComponent } from './commons/modals/account-edit-bank-data-modal/account-edit-bank-data-modal.component';

@Component({
  selector: 'app-account-bank-data-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    PaginationComponent,
    MatIconModule,
  ],
  templateUrl: './account-bank-data-tab.component.html',
  styleUrls: [],
})
export class AccountBankDataTabComponent {
  public dataBody: ITableBankData[] = AccountBankTableDataMock;
  public id: string = '';
  public selected: FormControl = new FormControl(1);

  constructor(public tableService: TableService, private modal: NgbModal) {
    this.id = tableService.addTable(this.dataBody);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['dataBody']) return;

    this.tableService.updateTable(this.dataBody, this.id);
  }

  ngOnDestroy(): void {
    this.tableService.deleteTable(this.id);
  }

  public onClickDetails() {
    const id = this.selected.value;
    const ref = this.modal.open(AccountDetailDeleteBankDataModalComponent, {
      centered: true,
    });
    const modal =
      ref.componentInstance as AccountDetailDeleteBankDataModalComponent;

    modal.data = this.dataBody.find((d) => d.id === id);
    modal.isDetail = true;
  }

  public onAdd() {
    this.modal.open(AccountEditBankDataModalComponent, { centered: true });
  }

  public onEdit() {
    const id = this.selected.value;
    const ref = this.modal.open(AccountEditBankDataModalComponent, {
      centered: true,
    });
    const modal = ref.componentInstance as AccountEditBankDataModalComponent;

    modal.data = this.dataBody.find((d) => d.id === id);
  }

  public onDelete() {
    const id = this.selected.value;
    const ref = this.modal.open(AccountDetailDeleteBankDataModalComponent, {
      centered: true,
    });
    const modal =
      ref.componentInstance as AccountDetailDeleteBankDataModalComponent;

    modal.data = this.dataBody.find((d) => d.id === id);
    modal.isDetail = false;
  }

  get table() {
    return this.tableService.getTable<ITableBankData>(this.id);
  }
}
