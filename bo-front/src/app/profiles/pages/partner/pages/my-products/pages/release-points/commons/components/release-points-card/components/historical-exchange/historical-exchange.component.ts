import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { TableComponent } from '@shared/components/table/table.component';
import {
	optBrandMock,
	optStatesMock
} from 'src/app/profiles/pages/ambassador/pages/tree/pages/partner-list/commons/mocks/mock';
import { UserPointsBalanceService } from '../../../../services/user-points-balance.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-historical-exchange',
	standalone: true,
	imports: [CommonModule, SelectComponent, TableComponent],
	templateUrl: './historical-exchange.component.html',
	styleUrl: './historical-exchange.component.scss'
})
export default class HistoricalExchangeComponent {
	public form: FormGroup;
	public optStates = optStatesMock;
	public optBrands = optBrandMock;
	idUsuario: number;
	idUserTest: number;
	@Input() isLoading: boolean = false;

	constructor(
		private fb: FormBuilder,
		private userPointsBalanceService: UserPointsBalanceService,
		private userInfoService: UserInfoService
	) {
		this.form = this.fb.group({
			status: [''], // Inicializa con un valor por defecto o vacío
			brand: ['']
		});
	}

	ngOnInit(): void {
		this.isLoading = true;
		this.idUsuario = this.userInfoService.userInfo?.id;

		if (this.idUsuario) {
			this.obtenerHistorialPuntos(this.idUsuario);
		} else {
			console.warn('ID de usuario no disponible');
		}
	}

	obtenerHistorialPuntos(userId: number): void {
		this.isLoading = true;
		//this.idUserTest = 1;
		this.userPointsBalanceService.getPointsRedemptionHistoryByUser(this.idUsuario).subscribe({
			next: (response) => {
				console.log('Datos recibidos:', response);
				this.table.data = response.data ?? [];
				this.isLoading = false;
				console.log('Tipo de respuesta:', typeof response);
				console.log('Contenido de respuesta:', response);
			},
			error: (err) => {
				console.error('Error al obtener historial de puntos:', err);
				this.isLoading = false;
			}
		});
	}

	get headers() {
		const result = [
			'Fecha de uso',
			'Tipo de canje',
			'Cód. canje',
			'Servicio',
			'Descripción',
			'Check-in',
			'Check-out',
			'Cant. puntos',
			'Pts. usados'
		];
		return result;
	}

	get minWidthHeaders() {
		const result = [100, 100, 100, 100, 100, 100, 100, 100, 100];
		return result;
	}

	public table = {
		data: [
			{
				id: 1,
				userName: 'jdoe',
				fullName: 'John Doe'
			},
			{
				id: 2,
				userName: 'asmith',
				fullName: 'Alice Smith'
			},
			{
				id: 2,
				userName: 'asmith',
				fullName: 'Alice Smith'
			},
			{
				id: 2,
				userName: 'asmith',
				fullName: 'Alice Smith'
			},
			{
				id: 2,
				userName: 'asmith',
				fullName: 'Alice Smith'
			},
			{
				id: 2,
				userName: 'asmith',
				fullName: 'Alice Smith'
			},
			{
				id: 2,
				userName: 'asmith',
				fullName: 'Alice Smith'
			}
		]
	};
}
