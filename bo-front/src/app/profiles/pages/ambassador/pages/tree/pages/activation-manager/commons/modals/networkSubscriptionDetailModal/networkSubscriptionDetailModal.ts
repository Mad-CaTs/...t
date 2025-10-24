import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';

@Component({
	selector: 'app-enterprise-bank-details',
	standalone: true,
	providers: [MessageService],
	imports: [CommonModule, MatIconModule, DialogModule, ToastModule],
	templateUrl: './networkSubscriptionDetailModal.html',
	styleUrl: './networkSubscriptionDetailModal.scss'
})
export class NetworkSubscriptionDetailModal implements OnInit {
	data: any;
	cronograma: any;

	private nextExpirationDateIso: string | null;

	constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
		this.data = config.data.row;
		this.cronograma = config.data.cronograma;
		this.nextExpirationDateIso = config.data.nextExpirationDateIso ?? null;
	}
	ngOnInit(): void {
		const primeraCuota = this.firstCuota;
	}

	closeModal() {
		this.ref.close();
	}

	get firstCuota(): any {
		if (!this.cronograma || this.cronograma.length === 0) {
			console.warn('El cronograma está vacío o no ha sido asignado.');
			return null;
		}

		const cuota = this.cronograma.find(
			(cuota) =>
				cuota.quoteDescription.startsWith('Cuota') && !cuota.quoteDescription.startsWith('Inicial')
		);

		return cuota;
	}

	get nextPayDate(): string {
		const cuotaInactiva = this.cronograma.find((cuota) => cuota.statusName === 'INACTIVO');

		if (cuotaInactiva) {
			return cuotaInactiva.payDate
				? new Date(cuotaInactiva.payDate).toLocaleDateString('es-ES', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric'
				  })
				: '';
		}

		const todasActivas = this.cronograma.every((cuota) => cuota.statusName === 'ACTIVO');
		return todasActivas ? 'Cuotas al día' : '';
	}

	get observation(): string {
	const cuotaInactiva = this.cronograma.find((cuota) => cuota.statusName === 'INACTIVO');

	if (cuotaInactiva) {
		const maxPosition = Math.max(...this.cronograma.map(c => c.positionOnSchedule));
		return `Próxima cuota por pagar, ${cuotaInactiva.quoteDescription} de ${maxPosition-1}`;
	}

	const todasActivas = this.cronograma.every((cuota) => cuota.statusName === 'ACTIVO');
	return todasActivas ? 'Al día' : '';
	}

	formatDate(dateArray: number[]): string {
		if (dateArray && dateArray.length === 3) {
			const [year, month, day] = dateArray;
			const formattedDate = new Date(year, month - 1, day);
			return formattedDate.toLocaleDateString('es-ES', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			});
		}
		return '';
	}

	get nextExpirationDate(): Date | null {
    return (
      this.parseToDate(this.nextExpirationDateIso) ||
      this.parseToDate(this.firstCuota?.nextExpirationDate) ||
      null
    );
  }

  private parseToDate(iso?: string | null): Date | null {
    if (!iso) return null;

    if (iso.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      const [y, m, d] = iso.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

}
