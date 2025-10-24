import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { TableService } from 'src/app/profiles/pages/ambassador/commons/services/table/table.service';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@shared/components/table/table.component';
import { FormControl } from '@angular/forms';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConciliationCreationModalComponent } from '../../modals/conciliation-creation-modal/conciliation-creation-modal.component';
import { IConciliationDetailTable } from 'src/app/profiles/pages/ambassador/pages/tree/commons/interfaces';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { RejectedConciliationModalComponent } from '../../modals/rejected-conciliation-modal/rejected-conciliation-modal.component';

@Component({
  selector: 'app-table-conciliation',
  standalone: true,
  imports: [
    CommonModule, TableComponent, DynamicDialogModule
  ],
  templateUrl: './table-conciliation.component.html',
  styleUrl: './table-conciliation.component.scss'
})
export class TableConciliationComponent implements OnInit {
  @Input() dataBody: IConciliationDetailTable[] = [];
  @Input() conciliationId: number;
  public id: string = '';
  public selected: FormControl = new FormControl(1);
  dialogRef: DynamicDialogRef;
  public disabledUser: boolean = this.userInfoService.disabled;

  constructor(
    private dialogService: DialogService, 
    public userInfoService: UserInfoService,
    public tableService: TableService) {
    this.id = tableService.addTable(this.dataBody);
  }

	ngOnInit(): void {
		this.selected.setValue(this.dataBody[0]?.idConciliation || 1);
    if (
      this.dataBody.length > 0 &&
      this.dataBody[0]?.idConciliation &&
      Number(this.dataBody[0].idStatus) === 4
    ) {
			this.openRejectedConciliationModal();
		}
	}

	openRejectedConciliationModal() {
		this.dialogService.open(RejectedConciliationModalComponent, {
			width: '29.375vw',
			data: this.dataBody[0].idConciliation,
			breakpoints: {
				'1440px': '35vw',
				'1200px': '40vw',
				'960px': '50vw',
				'768px': '65vw',
				'640px': '80vw',
				'480px': '90vw',
				'320px': '95vw'
			}
		});
	}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['dataBody']) return;
    this.tableService.updateTable(this.dataBody, this.id);
  }

  ngOnDestroy(): void {
    this.tableService.deleteTable(this.id);
  }

  get table() {
    return this.tableService.getTable<IConciliationDetailTable>(this.id);
  }

  get headers() {
    const result = [
      'Periodo',
      'Monto',
      'Estado'
    ];
    return result;
  }

  get minWidthHeaders() {
    const result = [80, 80, 100, 100];
    return result;
  }

  uploadDocument(data: any) {
    const totalAmount = data
      .reduce((sum, item) => sum + item.amount, 0);
    this.dialogRef = this.dialogService.open(ConciliationCreationModalComponent, {
      header: '¿Deseas subir tu documento?',
      width: '50%',
      data: {
        conciliationId: this.conciliationId,
        totalAmount: totalAmount
      }
    });

    this.dialogRef.onClose.subscribe((data) => {
      if (data === true) {
        const ref = this.dialogService.open(ModalSuccessComponent, {
          header: '',
          data: {
            text: 'La subida de la conciliación se hizo correctamente.',
            title: '¡Éxito!',
            icon: 'assets/icons/Inclub.png'
          }
        });
      } else if (data === false) {
        this.dialogService.open(ModalAlertComponent, {
          header: '',
          data: {
            message: 'La subida de la conciliación tuvo errores.',
            title: '¡Error!',
            icon: 'check_circle_outline'
          }
        });
      }
    });
  }

  isConciliate() {
    return this.table.data.some((item: any) => item.idStatus === 2 || item.idStatus === 3);
  }

}
