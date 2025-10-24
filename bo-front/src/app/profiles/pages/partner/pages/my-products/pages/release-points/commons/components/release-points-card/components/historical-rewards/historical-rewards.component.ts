import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, Input, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { TableComponent } from '@shared/components/table/table.component';
import { UserPointsBalanceService } from '../../../../services/user-points-balance.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { ActivatedRoute } from '@angular/router';
import { RewardsPointsService } from '../../../../services/rewards-points.service';
import localeEs from '@angular/common/locales/es';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { filterTransactions } from '../../../../constants';

registerLocaleData(localeEs);

@Component({
	selector: 'app-historical-rewards',
	standalone: true,
	imports: [CommonModule, SelectComponent, TableComponent, DateComponent, InputComponent],
	providers: [{ provide: LOCALE_ID, useValue: 'es' }],
	templateUrl: './historical-rewards.component.html',
	styleUrl: './historical-rewards.component.scss'
})
export default class HistoricalRewardsComponent {
	public form: FormGroup;
	private idSuscription: number;
	private listRewards: any[];
	public listMoveRewards: any[];
	@Input() isLoading: boolean = false;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private rewardPointsService: RewardsPointsService
	) {
		this.idSuscription = Number(this.route.snapshot.paramMap.get('id'));
		this.form = this.fb.group({
			startDate: [null],
			endDate: [null],
			motion: [null]
		});
	}

	ngOnInit(): void {
		this.isLoading = true;

		if (this.idSuscription) {
			this.obtenerHistorialRewards();
			this.setupMotionListener();
			this.setupDateListener();
		} else {
			console.warn('idSuscription  no disponible');
		}
	}

	obtenerHistorialRewards(startDate?: string, endDate?: string): void {
		this.isLoading = true;
		this.rewardPointsService.getMovements(this.idSuscription, startDate, endDate).subscribe({
			next: (response) => {
				this.loadTransactionsFromMovements(response || []);
				this.isLoading = false;
			},
			error: (err) => {
				this.isLoading = false;
			}
		});
	}

	loadTransactionsFromMovements(movements: any[]) {
		this.listRewards = movements.map((item: any) => ({
			description: 'Uso de USD Rewards',
			date: new Date(item.releasedAt),
			membership: item.packageName,
			portfolio: item.familyPackageName,
			points: (item.rewardsAmount >= 0 ? '+ ' : '- ') + Math.abs(item.rewardsAmount),
			status: item.status
		}));
		this.listMoveRewards = this.listRewards;
	}

	private setupMotionListener(): void {
		this.form.get('motion')?.valueChanges.subscribe((value) => {
			const searchText = value || '';
			const selectedDate = this.form.get('date')?.value || '';
			this.listMoveRewards = filterTransactions(this.listRewards, searchText, selectedDate);
		});
	}

	private setupDateListener(): void {
		this.form.get('startDate')?.valueChanges.subscribe(() => this.handleDateChange());
		this.form.get('endDate')?.valueChanges.subscribe(() => this.handleDateChange());
	}

	private handleDateChange(): void {
		const startDate = this.form.get('startDate')?.value;
		const endDate = this.form.get('endDate')?.value;

		// Validar que ambos estén llenos
		if (!startDate || !endDate) {
			return;
		}

		// Validar que endDate sea mayor o igual a startDate
		if (new Date(endDate) < new Date(startDate)) {
			// Aquí puedes mostrar un error al usuario si quieres
			return;
		}

		// Formatea las fechas a DD/MM/YYYY
		const format = (date: Date) => {
			const d = new Date(date);
			const pad = (n: number) => n.toString().padStart(2, '0');
			return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
		};

		this.obtenerHistorialRewards(format(startDate), format(endDate));
	}
}
