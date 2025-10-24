import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { PROFORMAS_MOCK } from './mock';
import { ModalConfirmDeleteComponent } from '@shared/components/modal/modal-confirm-delete/modal-confirm-delete.component';
import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-proforma',
  standalone: true,
  imports: [CommonModule, TableGenericComponent, ModalConfirmDeleteComponent, ModalNotifyComponent  ],
  templateUrl: './proforma.component.html',
  styleUrls: ['./proforma.component.scss']
})
export class ProformaComponent {

  columns = ['Marca', 'Modelo', 'Color', 'Precio (USD)', 'Concesionaria', 'Ejecutivo de Ventas', 'Número del Ejecutivo de Ventas'];
  keys = ['brand', 'model', 'color', 'price', 'dealer', 'salesExecutive', 'salesExecutivePhone'];
  columnWidths = ['8%', '15%', '10%', '12%', '15%', '14%', '10%'];

  proformas = (PROFORMAS_MOCK ?? []).map((p: any) => ({
    id: p.id,
    nombre: p.nombre,
    items: (p.items ?? []).map((it: any) => ({
      id: it.id,
      brand: it.marca,
      model: it.modelo,
      color: it.color,
      price: typeof it.precioUSD === 'number' ? it.precioUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : it.precioUSD,
      dealer: it.concesionaria,
      salesExecutive: it.ejecutivoVentas,
      salesExecutivePhone: it.numeroEjecutivoVentas,
    })),
  }));

  constructor(private router: Router, private route: ActivatedRoute) {}

  onEdit(proforma: any, row: any) {
    const proformaId = proforma?.id;
    const documentId = row?.id;
    if (proformaId && documentId) {
      this.router.navigate(['/profile/ambassador/my-awards/car-bonus/proforma', proformaId, 'document', documentId]);
    }
  }

  pendingDelete: { proformaId: number; itemId: number } | null = null;
  showConfirm = false;
  confirmTitle = 'Eliminar ítem';
  confirmMessage = '¿Estás seguro de que deseas eliminar este ítem de la proforma?';

  onDelete(proforma: any, row: any) {
    this.pendingDelete = { proformaId: proforma.id, itemId: row.id };
    this.confirmTitle = `Eliminar ítem #${row.id}`;
    this.confirmMessage = `¿Deseas eliminar el ítem ${row.id} de ${proforma.nombre || 'la proforma'}?`;
    this.showConfirm = true;
  }

  onConfirmDelete() {
    if (!this.pendingDelete) return;
    const { proformaId, itemId } = this.pendingDelete;

    const p = this.proformas.find((x: any) => x.id === proformaId);
    if (p) {
      p.items = p.items.filter((it: any) => it.id !== itemId);
      if (!p.items || p.items.length === 0) {
        this.proformas = this.proformas.filter((pf: any) => pf.id !== proformaId);
      }
    }

    this.showConfirm = false;
    this.pendingDelete = null;

    this.notifyTitle = 'Operación exitosa';
    this.notifyMessage = 'El ítem fue eliminado correctamente.';
    this.notifyIcon = 'success';
    this.showNotify = true;
  }

  onCancelDelete() {
    this.pendingDelete = null;
    this.showConfirm = false;
  }

  onView(proforma: any, row: any) {
    alert('Ver id: ' + (row?.id ?? 'desconocido') + ' (proforma ' + (proforma?.id ?? '-') + ')');
  }

  onAdd() {
    const currentIds = (this.proformas || []).map((p: any) => Number(p.id) || 0);
    const newId = (currentIds.length ? Math.max(...currentIds) : 0) + 1;
    const newGroup = { id: newId, nombre: `Proforma ${newId}`, items: [] };
    this.proformas = [...this.proformas, newGroup];
    this.router.navigate(['/profile/ambassador/my-awards/car-bonus/proforma', newId, 'document', 'new']);
  }

  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyIcon: 'success' | 'error' | 'info' | 'warning' = 'success';

  onCloseNotify() {
    this.showNotify = false;
  }
}
