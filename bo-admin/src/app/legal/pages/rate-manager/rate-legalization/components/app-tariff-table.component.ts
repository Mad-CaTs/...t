import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-tariff-table',
	standalone: true,
	imports: [CommonModule],
	template: `
		<table class="table table-bordered table-hover mt-3">
			<thead class="table-light">
				<tr>
					<th>Ítem</th>
					<th>Solicitado en</th>
					<th>Moneda</th>
					<th>Costo</th>
					<th>Estado</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				<tr *ngFor="let row of data">
					<td>{{ row.item }}</td>
					<td>{{ row.solicitado }}</td>
					<td>{{ row.moneda }}</td>
					<td>S/ {{ row.costo }}</td>
					<td>
						<span
							class="badge"
							[ngClass]="{
								'bg-success': row.estado === 'Activo',
								'bg-secondary': row.estado !== 'Activo'
							}"
						>
							{{ row.estado }}
						</span>
					</td>
					<td>
						<button class="btn btn-sm btn-link p-0 me-2"><i class="bi bi-pencil"></i></button>
						<button class="btn btn-sm btn-link p-0"><i class="bi bi-trash"></i></button>
					</td>
				</tr>
			</tbody>
		</table>
	`
})
export class TariffTableComponent {
	@Input() data: any[] = [];
}
