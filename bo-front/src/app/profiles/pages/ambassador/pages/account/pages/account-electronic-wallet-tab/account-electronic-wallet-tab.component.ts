import { Component, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountElectronicWalletTableDataMock } from './_mock';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { MatIconModule } from '@angular/material/icon';
import { ITableAccountElectronicWallet } from '../../commons/interfaces/account';
import { TableService } from '../../../../commons/services/table/table.service';
import { AccountCrudElectonicWalletModalComponent } from './commons/modals/account-crud-electonic-wallet-modal/account-crud-electonic-wallet-modal.component';

@Component({
  selector: 'app-account-electronic-wallet-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    PaginationComponent,
    MatIconModule,
  ],
  templateUrl: './account-electronic-wallet-tab.component.html',
  styleUrls: [],
})
export class AccountElectronicWalletTabComponent
  implements OnChanges, OnDestroy
{
  public dataBody: ITableAccountElectronicWallet[] =
    AccountElectronicWalletTableDataMock;
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

  /* === Events === */
  public onAdd() {
    this.modal.open(AccountCrudElectonicWalletModalComponent, {
      centered: true,
    });
  }

  public onEdit() {
    const ref = this.modal.open(AccountCrudElectonicWalletModalComponent, {
      centered: true,
    });
    const modal =
      ref.componentInstance as AccountCrudElectonicWalletModalComponent;

    modal.data = this.dataBody.find((d) => d.id === this.selected.value);
    modal.isDelete = false;
  }

  public onDelete() {
    const ref = this.modal.open(AccountCrudElectonicWalletModalComponent, {
      centered: true,
    });
    const modal =
      ref.componentInstance as AccountCrudElectonicWalletModalComponent;

    modal.data = this.dataBody.find((d) => d.id === this.selected.value);
    modal.isDelete = true;
  }

  get table() {
    return this.tableService.getTable<ITableAccountElectronicWallet>(this.id);
  }
}
