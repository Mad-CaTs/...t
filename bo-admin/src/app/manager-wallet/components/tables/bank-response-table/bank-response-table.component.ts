import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AuthService } from '@app/auth';
import { RetirosService } from '@app/manager-wallet/services/retiros.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { InputFileOfWithdrawalComponent } from '../../input-file/input-file.component';
import { FormControlModule } from "@shared/components/form-control/form-control.module";
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from "@app/event/components/shared/empty-state/empty-state.component";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TablePaginatorComponent } from "@shared/components/tables/table-paginator/table-paginator.component";
import { BankStatus } from '@app/manager-wallet/model/solicitudRetiro';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalsImportSuccessComponent } from '../../modals/modals-import-success/modals-import-success.component';
import { ModalsBulkNotificationComponent } from '../../modals/modals-bulk-notification/modals-bulk-notification.component';

@Component({
  selector: 'app-bank-response-table',
  standalone: true,
  imports: [InputFileOfWithdrawalComponent, FormControlModule, CommonModule, EmptyStateComponent, TablePaginatorComponent],
  templateUrl: './bank-response-table.component.html',
  styleUrls: ['./bank-response-table.component.scss']
})
export class BankResponseTableComponent {
  @Input() table: any;
  @Input() form: any;
  @Input() loading: boolean;
  @Input() statusOpt: ISelectOpt[];
  @Input() visiblePages: number[];
  @Input() formatDate: (fecha: number[]) => string;
  @Input() allBankStatuses: BankStatus[] = [];
  @Input() viewDetail: (row: any) => void;
  @Input() pageIndex: number;
  @Input() totalPages: number;
  @Input() prevPage: () => void;
  @Input() nextPage: () => void;
  @Input() goToPage: (page: number) => void;
  @Input() onPageChange: (newPage: number) => void;
  @Input() onPageSizeChange: (newSize: number) => void;
  @Input() total: number;
  @Input() pageSize: number = 3;
  modalDownnloadSuccess: any;
  modalImportSuccess: any;
  buttonLoadingImport: boolean = false;
  modalNotification: any;

  @Output() dataImported = new EventEmitter<void>();
  @Output() searchTriggered = new EventEmitter<void>();
  @Output() detailClicked = new EventEmitter<any>();

  selectedFile: File | null = null;

  @ViewChild(InputFileOfWithdrawalComponent) fileInputComponent!: InputFileOfWithdrawalComponent;

  constructor(
    private authService: AuthService,
    private retiroService: RetirosService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit() {
    if (this.form) {
      this.form.get('search')?.valueChanges
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(() => {
          this.searchTriggered.emit();
        });

      this.form.get('status')?.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(() => {
          this.searchTriggered.emit();
        });
    }
  }

  onFileSelected(event: any) {
    const file: File = event;
    if (file) {
      this.selectedFile = file;
    }
  }

  getBorderColor(idBankStatus: number): { color: string, background: string } {
    const status = this.allBankStatuses.find(i => i.id === idBankStatus);
    if (!status) return { color: "", background: "" };
    return { color: status.fontColor, background: status.backgroundColor };
  }

  getNameOfStates(id: number): string {
    return this.statusOpt.find(state => +state.id === id)?.text || '';
  }

  uploadExcelOfBcp() {
    if (!this.selectedFile) {
      console.error('Archivo no encontrado');
      return;
    }

    const fileToUpload = this.selectedFile;

    this.buttonLoadingImport = true;
    const username = this.authService.getUsernameOfCurrentUser();

    this.retiroService.uploadExcelOfBcp(fileToUpload, username).subscribe({
      next: (response) => {
        const totalRecords = response?.totalRecords || 0;
        this.buttonLoadingImport = false;
        this.showModalImportFileSuccess(totalRecords);
        this.selectedFile = null;
        this.dataImported.emit();
        this.cdr.detectChanges();
      },
      error: () => {
        this.buttonLoadingImport = false;
        this.selectedFile = null;
        this.cdr.detectChanges();
      }
    });
  }

  private showModalImportFileSuccess(totalRecords: number) {
    this.modalImportSuccess = this.modalService.open(ModalsImportSuccessComponent, {
      centered: true,
      size: 'md',
      backdrop: 'static',
      keyboard: false
    });

    if (this.modalImportSuccess?.componentInstance) {
      this.modalImportSuccess.componentInstance.recordCount = totalRecords;
    }
  }

  updateBankWithdrawalAll() {
    this.showModalNotificationConfirm();
  }

  private showModalNotificationConfirm() {
    this.modalNotification = this.modalService.open(ModalsBulkNotificationComponent, {
      centered: true,
      size: 'sm',
      backdrop: 'static',
      keyboard: false
    });

    this.modalNotification.componentInstance.body = this.table;
    this.modalNotification.componentInstance.config = 'rejection';

    this.modalNotification.result.then(
      (result: any) => {
        if (result && result.success) {
          this.clearFileInput();
        }
      },
      () => {
        console.log('Modal cancelado');
      }
    );
  }

  onFileRemoved() {
    this.selectedFile = null;
  }


  private clearFileInput() {
    if (this.fileInputComponent) {
      this.fileInputComponent.clearFile();
    }

    this.selectedFile = null;
    this.cdr.detectChanges();
  }
}
