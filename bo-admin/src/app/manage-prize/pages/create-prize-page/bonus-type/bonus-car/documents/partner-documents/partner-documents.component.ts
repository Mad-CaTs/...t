import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { PARTNER_DOCUMENTS_MOCK } from './mock';
import { Router } from '@angular/router';
import { ModalDocumentUploadComponent, DocTypeOption } from '@app/manage-prize/components/modals/payments/modal-document-upload/modal-document-upload.component';

@Component({
  selector: 'app-partner-documents',
  standalone: true,
  imports: [CommonModule, FilterGenericComponent, TableGenericComponent, TablePaginatorComponent, EmptyStateComponent, ModalDocumentUploadComponent],
  templateUrl: './partner-documents.component.html',
  styleUrls: ['./partner-documents.component.scss']
})
export class PartnerDocumentsComponent {
  filters: FilterGenericConfig[] = [];
  filterValues: Record<string, any> = {};
  extraButtons: FilterExtraButton[] = [
    { key: 'upload', label: 'Subir documento', variant: 'primary', iconClass: 'bi bi-upload' }
  ];

  genericColumns: string[] = [
    'N°', 'Tipo de documento', 'Nombre de archivo', 'Fecha de registro', 'Tamaño'
  ];
  genericKeys: string[] = [
    'item', 'tipoDocumento', 'nombreArchivo', 'fechaRegistro', 'tamano'
  ];
  genericWidths: string[] = [
    '6%', '20%', '20%', '15%', '15%'
  ];

  private allRows = PARTNER_DOCUMENTS_MOCK.map(x => ({ ...x }));
  private filteredRows = this.allRows.slice();

  pageSize = 8;
  pageIndex = 1;

  get totalFiltered(): number { return this.filteredRows.length; }
  get pagedData() {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize).map((row, idx) => ({
      ...row,
      item: start + idx + 1,
    }));
  }

  onExtraAction(btn: FilterExtraButton) {
    if (btn.key === 'upload') {
      this.showUpload = true;
    }
  }

  onPageChange(index: number) { this.pageIndex = index; }
  onPageSizeChange(size: number) { this.pageSize = size; this.pageIndex = 1; }

  onViewRow(row: any) {
    const docId = row?.id ?? '';
    const segments = this.router.url.split('/');
    const partnerIdx = segments.findIndex(s => s === 'partner');
    const partnerId = partnerIdx >= 0 ? segments[partnerIdx + 1] : '';
    if (!partnerId || !docId) {
      alert('No se pudo determinar el socio o el documento');
      return;
    }
    this.router.navigate(['/dashboard/manage-prize/bonus-type/car/documents/partner', partnerId, 'documents', docId]);
  }

  onEditRow(row: any) {
    const id = row?.id ?? '';
    alert(`Editar documento: ${row?.nombreArchivo ?? ''} (ID: ${id})`);
  }

  constructor(private router: Router) {}
  onBack() {
    this.router.navigate(['/dashboard/manage-prize/bonus-type/car/documents']);
  }

  showUpload = false;
  uploadLoading = false;
  uploadDocTypes: DocTypeOption[] = [
    { label: 'Contrato', value: 'Contrato' },
    { label: 'Tarjeta de propiedad Vehicular', value: 'Tarjeta de propiedad Vehicular' },
    { label: 'Cronograma', value: 'Cronograma' },
    { label: 'Pagaré', value: 'Pagaré' },
    { label: 'Otros Documentos', value: 'Otros Documentos' },
  ];

  onUploadCancel() {
    if (this.uploadLoading) return;
    this.showUpload = false;
  }

  onUploadSubmit(evt: { file: File; docType: any }) {
    this.uploadLoading = true;
    setTimeout(() => {
      this.uploadLoading = false;
      this.showUpload = false;
      alert(`Subido: ${evt.file.name} | Tipo: ${evt.docType}`);

    }, 200);
  }
}
