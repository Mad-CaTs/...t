import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { FormControlModule } from "../../../../shared/components/form-control/form-control.module";
import { PercentOverdueTypeService } from '@app/manage-business/services/percent-overdue-type-service.service';
import { PercentOverdueDetailService } from '@app/manage-business/services/percent-overdue-detail.service';
import { ITablePercentDetail } from '@interfaces/percent-overdue';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPercentOverdueDetailDeleteComponent } from '@app/manage-business/components/modals/modal-percent-overdue-detail-delete/modal-percent-overdue-detail-delete.component';
import { ModalPercentOverdueDetailAddComponent } from '@app/manage-business/components/modals/modal-percent-overdue-detail-add/modal-percent-overdue-detail-add.component';
import { ModalPercentOverdueDetailEditComponent } from '@app/manage-business/components/modals/modal-percent-overdue-detail-edit/modal-percent-overdue-detail-edit.component';

@Component({
  selector: 'app-debt',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    TablesModule,
    FormControlModule
  ],
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.scss']
})
export class DebtComponent {
  form: FormGroup;
  percentOverdueTypes: any[] = [];
  buttonLoading: boolean = false;
  loading: boolean = false;
  tableLoading: boolean = false;
  public readonly table: TableModel<ITablePercentDetail>;

  constructor(private modal: NgbModal, private tableService: TableService, private formBuilder: FormBuilder, private percentOverdueTypeService: PercentOverdueTypeService,
    private percentOverdueDetailService: PercentOverdueDetailService, private cdRef: ChangeDetectorRef) {
    this.loadPercentOverdueTypes();
    this.form = this.formBuilder.group({
      option: ['']
    });
    this.table = this.tableService.generateTable<ITablePercentDetail>({
      headers: [
        'N°',
        'Porcentaje de mora',
        'Estado',
        'Fecha de creación',
        'Fecha de modificación',
        'Acciones'
      ],
      noCheckBoxes: true
    });
  }

  loadPercentOverdueTypes() {
    this.loading = true;
    this.percentOverdueTypeService.getPercentOverdueTypes().subscribe({
      next: (response: any) => {
        this.loading = false;
        this.percentOverdueTypes = response;
        this.cdRef.detectChanges();
      },
      error: (error: any) => {
        this.loading = false;
        alert('Error al obtener la lista de tipos de porcentaje de mora');
        this.cdRef.detectChanges();
      }
    });
  }

  loadPercentOverdueDetailByPercentOverdueTypeId(id: number) {
    this.percentOverdueDetailService.getPercentOverdueDetailByPercentOverdueTypeId(id).subscribe({
      next: (response: any) => {
        this.tableLoading = false;
        this.table.data = response;
        this.cdRef.detectChanges();
      },
      error: (error: any) => {
        this.tableLoading = false;
        this.cdRef.detectChanges();
        alert('Error al obtener la lista de porcentajes de mora');
      }
    });
  }

  onSelectionOverdueType(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const selectedValue = target.value;
      this.tableLoading = true;
      this.table.data = [];
      this.loadPercentOverdueDetailByPercentOverdueTypeId(Number(selectedValue));
    }
  }

  addPercentOverdue(id: number) {
    const modalRef = this.modal.open(ModalPercentOverdueDetailAddComponent, { centered: true });
    modalRef.componentInstance.percentOverdueTypeId = id;
    modalRef.result.then(
      () => {
        this.loadPercentOverdueDetailByPercentOverdueTypeId(id);
      },
      () => {
      }
    );
  }

  onModify(data: any, id: any) {
    const modalRef = this.modal.open(ModalPercentOverdueDetailEditComponent, { centered: true });
    modalRef.componentInstance.percentOverdueDetail = data;
    modalRef.componentInstance.percentOverdueTypeId = id;
    modalRef.result.then(
      () => {
        this.loadPercentOverdueDetailByPercentOverdueTypeId(id);
      },
      () => {
      }
    );
  }

  onDelete(idPercentOverdueDetail: number, idPercentOverdueType: number) {
    const modalRef = this.modal.open(ModalPercentOverdueDetailDeleteComponent, { centered: true });
    modalRef.componentInstance.idPercentOverdueDetail = idPercentOverdueDetail;
    modalRef.result.then(
      () => {
        this.loadPercentOverdueDetailByPercentOverdueTypeId(idPercentOverdueType);
      },
      () => {
      }
    );
  }

}
