import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {
	ApexAxisChartSeries,
	ApexChart,
	ApexXAxis,
	ApexYAxis,
	ApexDataLabels,
	ApexLegend,
	ApexTooltip,
	ApexStroke,
	ApexTitleSubtitle,
	NgApexchartsModule
} from 'ng-apexcharts';

import { ISelectOpt } from '@interfaces/form-control.interface';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { UserService } from '@app/users/services/user.service';
import { ManagementDashboardService } from '@app/report/services/management-dashboard.service';
import { combineLatest, Observable } from 'rxjs';
import { mapTo, startWith, tap, debounceTime } from 'rxjs/operators';
import { RangeAffiliatesComponent } from '../range-affiliates/range-affiliates.component';
import { downloadBlobFile } from '@app/report/helper/download-helper';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export type ChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	xaxis: ApexXAxis;
	yaxis: ApexYAxis[];
	title: ApexTitleSubtitle;
	legend: ApexLegend;
	tooltip: ApexTooltip;
	dataLabels: ApexDataLabels;
	stroke: ApexStroke;
};

type MonthlyHistory = {
	month: number;
	monthName: string;
	total: number;
};

@Component({
	selector: 'app-historical-affiliates',
	templateUrl: './historical-affiliates.component.html',
	styleUrls: ['./historical-affiliates.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InlineSVGModule,
		NgApexchartsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatOptionModule,
		MatSnackBarModule,
		FormControlModule,
		RangeAffiliatesComponent
	]
})
export class HistoricalAffiliatesComponent implements OnInit {
	form!: FormGroup;
	activeTab = 'meses';
	selectedCountryIds: number[] = [];
	selectedCountryId?: number;
	searchTerm: string = '';
	exporting = false;
	filteredCountries: typeof this.countries = [];

	statusOpt: ISelectOpt[] = [];
	monthOpt: ISelectOpt[] = [
		{ id: '-1', text: 'Todos' },
		{ id: '1', text: 'Enero' },
		{ id: '2', text: 'Febrero' },
		{ id: '3', text: 'Marzo' },
		{ id: '4', text: 'Abril' },
		{ id: '5', text: 'Mayo' },
		{ id: '6', text: 'Junio' },
		{ id: '7', text: 'Julio' },
		{ id: '8', text: 'Agosto' },
		{ id: '9', text: 'Septiembre' },
		{ id: '10', text: 'Octubre' },
		{ id: '11', text: 'Noviembre' },
		{ id: '12', text: 'Diciembre' }
	];

	yearOpt: ISelectOpt[] = [
		{ id: '2018', text: '2018' },
		{ id: '2019', text: '2019' },
		{ id: '2020', text: '2020' },
		{ id: '2021', text: '2021' },
		{ id: '2022', text: '2022' },
		{ id: '2023', text: '2023' },
		{ id: '2024', text: '2024' },
		{ id: '2025', text: '2025' }
	];

	// 🔹 Ahora países será llenado dinámicamente
	countries: {
		id: number;
		name: string;
		count: number;
		color: string;
		checked: boolean;
	}[] = [];

	chartOptions!: ChartOptions;

	constructor(
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private userService: UserService,
		private dashboardService: ManagementDashboardService,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.buildForm();

		// Carga estados y países en paralelo
		this.loadStates().subscribe({
			error: (err) => console.error('Error cargando estados:', err)
		});

		this.loadCountries(+this.form.get('year')!.value); // Llamado inmediato

		this.form
			.get('year')!
			.valueChanges.pipe(debounceTime(300))
			.subscribe((year: string) => this.loadCountries(+year));

		this.listenToFormChanges(); // Mueve fuera del subscribe
	}

	private buildForm(): void {
		this.form = this.fb.group({
			status: ['-1'],
			month: ['-1'],
			search: [''],
			year: ['2025'],
			year1: ['2024'],
			year2: ['2025']
		});
	}

	setActiveTab(tab: string): void {
		this.activeTab = tab;

		// Limpieza inteligente según el tab
		if (tab !== 'meses') {
			this.form.get('month')?.setValue('-1');
			this.form.get('status')?.setValue('-1');
		}

		if (tab !== 'años') {
			this.form.get('status')?.setValue('-1');
			this.form.get('year1')?.setValue('2024');
			this.form.get('year2')?.setValue('2025');
		}
	}

	private listenToFormChanges(): void {
		// Escucha cambios en el formulario y actualiza el gráfico con debounce
		this.buildChartOptions([], [], '');

		combineLatest([
			this.form.get('status')!.valueChanges.pipe(startWith(this.form.get('status')!.value)),
			this.form.get('month')!.valueChanges.pipe(startWith(this.form.get('month')!.value)),
			this.form.get('year')!.valueChanges.pipe(startWith(this.form.get('year')!.value)),
			this.form.get('year1')!.valueChanges.pipe(startWith(this.form.get('year1')!.value)),
			this.form.get('year2')!.valueChanges.pipe(startWith(this.form.get('year2')!.value))
		])
			.pipe(debounceTime(300))
			.subscribe(([status, month, year, year1, year2]) => {
				// console.log('Active tab:', this.activeTab);
				const s = status !== '-1' ? +status : undefined;

				// Cuando cambian año, mes o estado → recargar países
				this.loadCountries(+year);
				this.selectedCountryIds = []; // Reinicia selección de países (arreglo)

				if (this.activeTab === 'meses') {
					// Carga datos históricos por mes
					const m = month !== '-1' ? +month : undefined;
					const y = +year;
					this.loadHistoricalData(y, s, m, this.selectedCountryIds );
				} else if (this.activeTab === 'años') {
					this.loadComparisonData(+year1, +year2, s, this.selectedCountryIds);
				} else if (this.activeTab === 'trimestres') {
					const y = +year;
					this.loadQuarterData(y, s, this.selectedCountryIds );
				}
			});

		// 🔹 Escucha el campo de búsqueda en tiempo real
		this.form
			.get('search')!
			.valueChanges.pipe(debounceTime(300), startWith(this.form.get('search')!.value))
			.subscribe((searchTerm: string) => {
				const term = searchTerm.toLowerCase().trim();
				this.filteredCountries = this.countries.filter((c) => c.name.toLowerCase().includes(term));
				this.cdr.detectChanges();
			});
	}

	private loadHistoricalData(year: number, state?: number, month?: number, countries?: number[]): void {
		// Llama al servicio para obtener datos históricos según filtros y actualiza el gráfico
		this.dashboardService.getByMonth(year, state, countries, month).subscribe(
			(res: any) => {
				const history: MonthlyHistory[] = res.data?.monthlyHistory || [];
				const categories = history.map((h) => h.monthName);
				const data = history.map((h) => h.total);
				let title = `Afiliados por Mes Histórico (${this.form.get('year')!.value})`;
				this.buildChartOptions(categories, data, title);

				this.cdr.detectChanges();
			},
			(error) => console.error('Error cargando data histórica:', error)
		);
	}

	private loadComparisonData(year1: number, year2: number, state?: number, countries?: number[]): void {
		this.dashboardService.compareByYear(year1, year2, state, countries).subscribe(
			(res: any) => {
				const comparison = res?.data?.annualComparison ?? [];

				const categories = comparison.map((item: any) => item.nameMonth);
				const series: ApexAxisChartSeries = [
					{
						name: `${year1}`,
						data: comparison.map((item: any) => item.totalYear1)
					},
					{
						name: `${year2}`,
						data: comparison.map((item: any) => item.totalYear2)
					}
				];

				this.buildComparisonChart(categories, series, year1, year2);
				this.cdr.detectChanges();
			},
			(error) => console.error('Error cargando comparación anual:', error)
		);
	}

	private buildComparisonChart(
		categories: string[],
		series: ApexAxisChartSeries,
		year1: number,
		year2: number
	): void {
		// ① Calcular el valor máximo entre TODAS las barras (+10 % de margen)
		const allValues = series.reduce((acc: number[], s) => acc.concat(s.data as number[]), []); // ← REEMPLAZO DE flatMap

		const maxValue = Math.max(...allValues) * 1.1;

		this.chartOptions = {
			series,
			chart: { type: 'bar', height: 400, stacked: false, toolbar: { show: false } },
			title: { text: `Afiliados ${year1} vs ${year2}`, align: 'center' },
			xaxis: { categories, title: { text: 'Meses' } },
			yaxis: [
				{
					title: { text: 'Afiliados' },
					min: 0,
					max: maxValue
				}
			],
			tooltip: {
				shared: true,
				intersect: false,
				y: { formatter: (val: number) => `${val}` }
			},
			legend: {
				position: 'right',
				markers: { fillColors: ['#1E90FF', '#00C49F'] }
			},
			dataLabels: { enabled: false },
			stroke: { show: true, width: 2 }
		};
	}

	private loadStates(): Observable<void> {
		// Obtiene los estados disponibles y los carga en el select
		return this.userService.getAllStates().pipe(
			tap((states: any[]) => {
				this.statusOpt = [
					{ id: '-1', text: 'Todos' },
					...states.map((state: any) => ({
						id: state.idState.toString(),
						text: state.nameState
					}))
				];
			}),
			mapTo(void 0)
		);
	}

	private loadCountries(year: number): void {
		const month = this.form.get('month')?.value;
		const state = this.form.get('status')?.value;

		const parsedMonth = month !== '-1' ? +month : undefined;
		const parsedState = state !== '-1' ? +state : undefined;

		this.dashboardService.getAffiliatesByCountry(year, parsedMonth, parsedState).subscribe({
			next: (res: any) => {
				const rawCountries = res?.data?.data || [];
				this.countries = rawCountries.map((item: any, index: number) => ({
					id: item.countryid,
					name: item.countryname,
					count: item.totalaffiliates,
					color: '#f1c40f',
					checked: false
				}));
				this.filteredCountries = [...this.countries];

				this.cdr.detectChanges();
			},
			error: (err) => console.error('Error al cargar países:', err)
		});
	}

	public applyFilter(): void {
		const searchTermLower = this.searchTerm.trim().toLowerCase();

		this.filteredCountries = this.countries.filter((country) =>
			country.name.toLowerCase().includes(searchTermLower)
		);

		this.cdr.detectChanges();
	}

	public refreshData(): void {
		this.searchTerm = '';
		this.filteredCountries = [...this.countries]; // Restaurar copia completa
		this.cdr.detectChanges();
	}

	private loadQuarterData(year: number, state?: number,  countries?: number[]): void {
		this.dashboardService.getByQuarter(year, state, countries).subscribe(
			(res: any) => {
				const quarters = res?.data?.quarterlyAffiliates ?? [];
				const categories = quarters.map((q: any) => `Trim. ${q.trimestre}`);
				const series = quarters.map((q: any) => q.total);
				this.buildChartOptions(categories, series, `Afiliados por Mes Histórico (${year})`);
				this.cdr.detectChanges();
			},
			(error) => console.error('Error cargando trimestres:', error)
		);
	}

	onSingleCountryCheck(country: any): void {
		country.checked = !country.checked;

	this.selectedCountryIds = this.countries
		.filter(c => c.checked)
		.map(c => c.id);

	// Obtener filtros
	const status = this.form.get('status')!.value !== '-1' ? +this.form.get('status')!.value : undefined;
	const month = this.form.get('month')!.value !== '-1' ? +this.form.get('month')!.value : undefined;
	const year = +this.form.get('year')!.value;
	const year1 = +this.form.get('year1')!.value;
	const year2 = +this.form.get('year2')!.value;

	if (this.activeTab === 'meses') {
		this.loadHistoricalData(year, status, month, this.selectedCountryIds);
	} else if (this.activeTab === 'años') {
		this.loadComparisonData(year1, year2, status, this.selectedCountryIds);
	} else if (this.activeTab === 'trimestres') {
		this.loadQuarterData(year, status, this.selectedCountryIds);
	}
	}

	private buildChartOptions(categories: string[], data: number[], title: string): void {
		// Configura las opciones del gráfico ApexCharts con los datos proporcionados
		const maxVal = data.length ? Math.max(...data) : 0;
		const yLeftMax = Math.ceil(maxVal / 100) * 100;

		this.chartOptions = {
			series: [{ name: 'Afiliados', data }],
			chart: { type: 'bar', height: 400 },
			title: { text: title },
			xaxis: { categories },
			yaxis: [
				{ min: 0, max: yLeftMax, tickAmount: 7 },
				{
					opposite: true,
					title: { text: '% DE CRECIMIENTO' },
					labels: { formatter: (v: number) => `${v.toFixed(0)}%` },
					min: 0,
					max: 800,
					tickAmount: 4
				}
			],
			legend: { position: 'top' },
			tooltip: { enabled: true, y: { formatter: (v: number) => `${v}` } },
			dataLabels: { enabled: false },
			stroke: { show: true, width: 2 }
		};
	}

	get totalAfiliados(): number {
		return this.countries.reduce((sum, c) => sum + c.count, 0);
	}

	private showSuccessMessage(filename: string): void {
		this.snackBar.open(`✅ ${filename} descargado correctamente`, 'Cerrar', { duration: 2000 });
	}

	private showErrorMessage(): void {
		this.snackBar.open('❌ Error al generar el archivo Excel', 'Cerrar', { duration: 2000 });
	}

	exportExcel(): void {
		this.exporting = true;
		const status = this.form.get('status')?.value !== '-1' ? +this.form.get('status')!.value : undefined;
		const month = this.form.get('month')?.value !== '-1' ? +this.form.get('month')!.value : undefined;
		const year = +this.form.get('year')!.value;
		const year1 = +this.form.get('year1')!.value;
		const year2 = +this.form.get('year2')!.value;
		const countries = this.selectedCountryIds;
		const country = this.selectedCountryId;

		const handleSuccess = (res: Blob, filename: string) => {
			downloadBlobFile(res, filename);
			this.exporting = false;
			this.showSuccessMessage(filename);
			this.cdr.detectChanges(); 
		};

		const handleError = () => {
			this.exporting = false;
			this.showErrorMessage();
			this.cdr.detectChanges(); 
		};

		if (this.activeTab === 'meses') {
			const monthName = this.monthOpt.find(m => +m.id === month)?.text ?? `todos`;
			// const filename = `afiliados_mes_${month ?? 'todos'}_año_${year}.xlsx`;
			const filename = `afiliados_mes_${monthName}_año_${year}.xlsx`;
			this.dashboardService
				.downloadByMonth(year, status, countries, month)
				.subscribe((res) => handleSuccess(res, filename), handleError);
		} else if (this.activeTab === 'años') {
			const filename = `afiliados_comparativa_${year1}_vs_${year2}.xlsx`;
			this.dashboardService
				.downloadByTwoYears(year1, year2, status, countries)
				.subscribe((res) => handleSuccess(res, filename), handleError);
		} else if (this.activeTab === 'trimestres') {
			const filename = `afiliados_trimestres_año_${year}.xlsx`;
			this.dashboardService
				.downloadByQuarter(year, status, countries)
				.subscribe((res) => handleSuccess(res, filename), handleError);
		}
	}
}