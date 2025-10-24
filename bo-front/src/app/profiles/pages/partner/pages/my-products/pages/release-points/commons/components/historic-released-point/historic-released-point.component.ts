import { Component, inject, Input, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../../../../../../shared/components/form-control/input/input.component';
import { DateComponent } from '../../../../../../../../../../shared/components/form-control/date/date.component';
import { TableComponent } from '../../../../../../../../../../shared/components/table/table.component';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { filterTransactions } from '../../constants';
import { RewardsPointsService } from '../../services/rewards-points.service';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);
@Component({
	selector: 'app-historic-released-point',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		InputComponent,
		DateComponent,
		TableComponent,
		CommonModule,
		ProgressSpinnerModule
	],
	providers: [{ provide: LOCALE_ID, useValue: 'es' }],
	templateUrl: './historic-released-point.component.html',
	styleUrl: './historic-released-point.component.scss'
})
export class HistoricReleasedPointComponent {
	transactions: any[] = [];
	displayedTransactions: any[] = [];
	maxVisibleRows = 4;
	@Input() idSuscription: number;
	isLoading: boolean = false;

	form: FormGroup;
	private fb: FormBuilder = inject(FormBuilder);
	headersTable: string[] = ['Información', 'Membresía', 'Portafolio', 'Puntos', 'Status'];
	constructor(private rewardPointsService: RewardsPointsService) {
		this.createForm();
	}

	ngOnInit() {
		this.getInitData();
	}

	public getInitData() {
		this.getMovements();
		this.setupMotionListener();
		this.setupDateListener();
	}

	private setupMotionListener(): void {
		this.form.get('motion')?.valueChanges.subscribe((value) => {
			const searchText = value || '';
			const selectedDate = this.form.get('date')?.value || '';
			this.displayedTransactions = filterTransactions(
				this.transactions,
				searchText,
				selectedDate,
				this.maxVisibleRows
			);
		});
	}

	private setupDateListener(): void {
		this.form.get('date')?.valueChanges.subscribe((value) => {
			const searchText = this.form.get('motion')?.value || '';
			const selectedDate = value || '';
			this.displayedTransactions = filterTransactions(
				this.transactions,
				searchText,
				selectedDate,
				this.maxVisibleRows
			);
		});
	}

	private createForm() {
		this.form = this.fb.group({
			motion: [null],
			date: [null]
		});
	}

	getMovements(): void {
		this.isLoading = true;
		this.rewardPointsService.getRecentMovements(this.idSuscription).subscribe({
			next: (data: any[]) => {
				this.loadTransactionsFromMovements(data);
				this.isLoading = false;
			},
			error: (err) => {
				console.error('Error al obtener movimientos:', err);
				this.isLoading = false;
			}
		});
	}

	loadTransactionsFromMovements(movements: any[]) {
		this.transactions = movements.map((item: any) => ({
			description: 'Uso de USD Rewards',
			date: new Date(item.releasedAt),
			membership: item.packageName,
			portfolio: item.familyPackageName,
			points: (item.rewardsAmount >= 0 ? '+ ' : '- ') + Math.abs(item.rewardsAmount),
			status: item.status
		}));
		this.transactions.reverse();
		this.displayedTransactions = this.transactions.slice(0, this.maxVisibleRows);
	}
}
