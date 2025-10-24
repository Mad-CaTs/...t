import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IAccountTreeOrganizationManagerTable } from '../../../../../commons/interfaces';
import { TableService } from 'src/app/profiles/pages/ambassador/commons/services/table/table.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
  selector: 'app-table-account-organization-manager',
  templateUrl: './table-account-organization-manager.component.html',
  standalone: true,
  imports: [CommonModule, PaginationComponent, TableComponent],
  styleUrls: [],
})
export class TableAccountOrganizationManagerComponent {
  @Input() dataBody: IAccountTreeOrganizationManagerTable[] = [];

  @Output() btnClick = new EventEmitter<number>();

  public id: string = '';
  public selected: FormControl = new FormControl(1);
  public disabledUser: boolean = this.userInfoService.disabled;

  constructor(
    public userInfoService: UserInfoService,
    public tableService: TableService) {
    this.id = tableService.addTable(this.dataBody);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['dataBody']) return;

    this.tableService.updateTable(this.dataBody, this.id);
  }

  ngOnDestroy(): void {
    this.tableService.deleteTable(this.id);
  }

  onClickBtn() {
    const id = this.selected.value;
    this.btnClick.emit(id);
  }

  get table() {
    return this.tableService.getTable<IAccountTreeOrganizationManagerTable>(
      this.id
    );
  }
}
