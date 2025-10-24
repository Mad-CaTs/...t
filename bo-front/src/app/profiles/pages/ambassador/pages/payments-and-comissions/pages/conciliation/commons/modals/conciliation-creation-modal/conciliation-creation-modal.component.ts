import { CommonModule, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from '@shared/components/form-control/checkbox/checkbox.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { TextAreaComponent } from '@shared/components/form-control/text-area/text-area.component';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ModalConciliationPresenter } from './conciliation-creation-modal.presenter';
import { ConciliationService } from '../../services/conciliation.service';
import { ISelect } from '@shared/interfaces/forms-control';
import { ModalPaymentService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/commons/sevices/modal-payment.service';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-conciliation-creation-modal',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    SelectComponent,
    DialogModule,
    DynamicDialogModule,
    InputComponent,
    CheckboxComponent,
    InputNumberModule,
    DateComponent,
    FileComponent,
    ProgressSpinnerModule,
    TextAreaComponent],
  templateUrl: './conciliation-creation-modal.component.html',
  styleUrl: './conciliation-creation-modal.component.scss',
  providers: [ModalConciliationPresenter]
})
export class ConciliationCreationModalComponent {
  conciliationForm: FormGroup;
  isLoading: boolean = false;
  documentTypes: ISelect[] = [];
  currencies: ISelect[] = [];
  exchange: any;

  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig, private modalPaymentService: ModalPaymentService,
    public modalConciliationPresenter: ModalConciliationPresenter, private conciliationService: ConciliationService
  ) {
    this.conciliationService.getDocumentTypes().subscribe({
      next: (result) => {
        this.documentTypes = result.data.map((item: any) => ({
          value: item.id,
          content: item.name,
        }));
      }
    });
    this.modalPaymentService.getCurrency().subscribe({
      next: (result) => {
        this.currencies = result.map((item: any) => ({
          value: item.idCurrency,
          content: item.content,
        }));
      }
    });
    this.modalPaymentService.getTipoCambio().subscribe({
      next: (result) => {
        this.exchange = result;
      }
    });
  }

  ngOnInit(): void {
    this.conciliationForm = this.modalConciliationPresenter.conciliationForm;
    this.conciliationForm.get('amount').setValue(this.config.data.totalAmount);
    this.conciliationForm.get('amount').disable();
    this.conciliationForm.get('file')?.valueChanges.subscribe((file) => {
      if (file) {
        this.onFileChange(file);
      }
    });
    this.conciliationForm.get('currency')?.valueChanges.subscribe((data) => {
      if (data) {
        this.changeAmount(data);
      }
    });
    this.conciliationForm.get('documentType')?.valueChanges.subscribe((documentType) => {
      if (documentType === 'RECIBO POR HONORARIOS') {
        this.conciliationForm.get('detraction').setValue(false);
        this.conciliationForm.get('detractionValue').setValue(0);
      } else if (documentType === 'FACTURA') {
        this.conciliationForm.get('rent').setValue(false);
        this.conciliationForm.get('rentValue').setValue(0);
      } else {
        this.conciliationForm.get('rent').setValue(false);
        this.conciliationForm.get('rentValue').setValue(0);
        this.conciliationForm.get('detraction').setValue(false);
        this.conciliationForm.get('detractionValue').setValue(0);
      }
    });
  }

  changeAmount(id: any) {
    this.conciliationForm.get('amount').setValue(this.convertCurrency(this.config.data.totalAmount, id));
  }

  onFileChange(files: File[]) {
    /* const totalCost = this.config.data.totalAmount;
    let totalExtractedAmount = 0;
    let nroDocumentSet = new Set<string>();
    let currencySet = new Set<string>();
    let latestDate: Date | null = null;
    this.conciliationForm.get('number')?.setValue('');
    this.conciliationForm.get('date')?.setValue('');
    this.conciliationForm.get('currency')?.setValue(''); */
    if (files && files.length) {
      const fileObservables = files.map((fileItem: File) => {
        const formData = new FormData();
        formData.append('file', fileItem);
        return this.conciliationService.getDataFromPdf(formData);
      });
      forkJoin(fileObservables).subscribe({
        next: (responses) => {
          /* responses.forEach((response) => {
            const extractedAmount = response.data?.amount || 0;
            const extractedNroDocument = response.data?.nroDocument;
            const extractedCurrency = response.data?.currency;
            const extractedDate = response.data?.date;
            totalExtractedAmount += extractedAmount;
            if (extractedNroDocument) {
              nroDocumentSet.add(extractedNroDocument);
            }
            if (extractedCurrency) {
              currencySet.add(extractedCurrency);
            }
            if (extractedDate) {
              const currentDate = new Date(
                extractedDate[0],
                extractedDate[1] - 1,
                extractedDate[2]
              );
              if (!latestDate || currentDate > latestDate) {
                latestDate = currentDate;
              }
            }
          });
          if (nroDocumentSet.size === 1) {
            this.conciliationForm.get('number')?.setValue(Array.from(nroDocumentSet)[0]);
          }
          if (latestDate) {
            this.conciliationForm.get('date')?.setValue(latestDate);
          }
          if (currencySet.size === 1) {
            const extractedCurrency = Array.from(currencySet)[0];
            const matchedCurrency = this.currencies.find(
              (currency) => currency.content.toLowerCase() === extractedCurrency.toLowerCase()
            );
            if (matchedCurrency) {
              this.conciliationForm.get('currency')?.setValue(matchedCurrency.value);
            }
          } */
        },
        error: () => {
          console.log('Error al procesar uno o más archivos PDF.');
        },
      });
    }
  }

  convertCurrency(amount: number, currencyId: number): number | null {
    const selectedCurrency = this.currencies.find((currency) => currency.value === currencyId);
    if (!selectedCurrency || !this.exchange) {
      return amount;
    }
    const currencyContent = selectedCurrency.content.toLowerCase();
    const { buys, sale } = this.exchange;

    let convertedAmount: number;
    switch (currencyContent) {
      case 'soles':
        convertedAmount = amount * sale;
        break;
      case 'dólar':
      case 'dolares':
        convertedAmount = amount;
        break;
      default:
        convertedAmount = amount;
    }
    return Math.floor(convertedAmount * 100) / 100;
  }

  saveConciliation(): void {
    this.isLoading = true;
    const formData = new FormData();
    const formValues = this.conciliationForm.value;
    const formattedDate = formatDate(formValues.date, 'yyyy-MM-dd', 'en-US');
    const convertedAmount = this.convertCurrency(this.config.data.totalAmount, formValues.currency);
    const { buys, sale } = this.exchange;
    formData.append('amount', convertedAmount.toString());
    formData.append('amountUsd', this.config.data.totalAmount);
    formData.append('exchangeRate', sale);
    formData.append('registerDate', formattedDate);
    formData.append('additionalNote', formValues.noteAditional);
    formData.append('conciliationId', this.config.data.conciliationId);
    formData.append('voucherNumber', formValues.number);
    formData.append('documentType', formValues.documentType);
    formData.append('currencyId', formValues.currency);
    formData.append('detraction', formValues.detraction);
    formData.append('detractionValue', formValues.detractionValue);
    formData.append('rent', formValues.rent);
    formData.append('rentValue', formValues.rentValue);
    if (formValues.file && formValues.file.length) {
      formValues.file.forEach((file: File) => {
        formData.append('file', file);
      });
    }

    this.conciliationService.postDocumentForConciliation(formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe({
        next: () => {
          this.ref.close(true);
        },
        error: () => {
          this.ref.close(false);
        }
      });
  }

}
