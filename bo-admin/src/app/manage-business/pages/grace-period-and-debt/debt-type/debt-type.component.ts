import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { PercentOverdueTypeService } from '@app/manage-business/services/percent-overdue-type-service.service';
import { ITablePercentOverdueType } from '@interfaces/percent-overdue';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-debt-type',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormControlModule,
    TablesModule
  ],
  templateUrl: './debt-type.component.html',
  styleUrls: ['./debt-type.component.scss']
})
export class DebtTypeComponent {
  form: FormGroup;
  loading: boolean = false;
  public readonly table: TableModel<ITablePercentOverdueType>;

  constructor(private tableService: TableService, private formBuilder: FormBuilder, private modal: NgbModal,
    private percentOverdueTypeService: PercentOverdueTypeService, private cdRef: ChangeDetectorRef) {
    this.form = this.formBuilder.group({
      valueDays: ['', Validators.required],
    });
    this.loadPercentOverdueTypes();
    this.table = this.tableService.generateTable<ITablePercentOverdueType>({
      headers: [
        'N°',
        'Nombre',
        'Descripción',
        'Estado',
        'Fecha de creación',
        'Fecha de modificación'
      ],
      noCheckBoxes: true
    });
  }

  loadPercentOverdueTypes() {
    this.loading = true;
    this.percentOverdueTypeService.getPercentOverdueTypes().subscribe({
      next: (response) => {
        this.table.data = response;
        this.loading = false;
        this.cdRef.detectChanges(); 
      },
      error: (error) => {
        alert('Error al cargar los tipos de deuda');
        this.cdRef.detectChanges(); 
      }
    });
  }


}
