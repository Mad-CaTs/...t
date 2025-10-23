import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { TableModel } from '@app/core/models/table.model';
import { ITableGracePeriod } from '@interfaces/grace-period';
import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGracePeriodEditComponent } from '@app/manage-business/components/modals';
import { GracePeriodParameterService } from '@app/manage-business/services/grace-period-parameter-service.service';
import { ModalGracePeriodDeleteComponent } from '@app/manage-business/components/modals/modal-grace-period-delete/modal-grace-period-delete.component';

@Component({
  selector: 'app-grace-period-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormControlModule,
    TablesModule
  ],
  templateUrl: './grace-period-register.component.html',
  styleUrls: ['./grace-period-register.component.scss']
})
export class GracePeriodRegisterComponent {
  loading: boolean = false;
  buttonLoading: boolean = false;
  form: FormGroup;
  public readonly table: TableModel<ITableGracePeriod>;

  constructor(private tableService: TableService, private formBuilder: FormBuilder, private modal: NgbModal,
    private gracePeriodParameterService: GracePeriodParameterService, private cdf: ChangeDetectorRef) {
    this.form = this.formBuilder.group({
      valueDays: ['', Validators.required],
    });
    this.loadGracePeriodParameters();
    this.table = this.tableService.generateTable<ITableGracePeriod>({
      headers: [
        'N°',
        'Días de gracia',
        'Estado',
        'Fecha de creación',
        'Fecha de actualización',
        'Acciones'
      ],
      noCheckBoxes: true
    });
  }

  loadGracePeriodParameters() {
    this.loading = true;
    this.gracePeriodParameterService.getGracePeriodParameters().subscribe({
      next: (response) => {
        this.table.data = response;
        this.loading = false;
        this.cdf.detectChanges();
      },
      error: (error) => {
        alert('Error al cargar los parámetros de periodo de gracia');
        this.loading = false;
        this.cdf.detectChanges();
      }
    });
  }

  addGracePeriod() {
    this.buttonLoading = true;
    this.gracePeriodParameterService.saveGracePeriodParameter(this.form.value).subscribe({
      next: (response) => {
        this.loadGracePeriodParameters();
        this.buttonLoading = false;
        this.form.reset();
        this.cdf.detectChanges();
      },
      error: (error) => {
        alert('Error al guardar el parámetro de periodo de gracia');
        this.buttonLoading = false;
        this.cdf.detectChanges();
      }
    });
  }

  onModify(data: any) {
    const modalRef = this.modal.open(ModalGracePeriodEditComponent, { centered: true });
    modalRef.componentInstance.gracePeriodData = data;
    modalRef.result.then(
      () => {
        this.loadGracePeriodParameters();
      },
      () => {
      }
    );
  }

  onDelete(data: any) {
    const modalRef = this.modal.open(ModalGracePeriodDeleteComponent, { centered: true });
    modalRef.componentInstance.gracePeriodData = data;
    modalRef.result.then(
      () => {
        this.loadGracePeriodParameters();
      },
      () => {
      }
    );
  }

}
