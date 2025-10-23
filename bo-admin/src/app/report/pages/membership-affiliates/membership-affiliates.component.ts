import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ISelectOpt } from '@interfaces/form-control.interface';
import {
	ApexAxisChartSeries,
	ApexChart,
	ApexXAxis,
	ApexYAxis,
	ApexDataLabels,
	ApexLegend,
	ApexTooltip,
	ApexStroke,
	ApexTitleSubtitle
} from 'ng-apexcharts';
import { AffiliateChartComponent } from './affiliate-chart/affiliate-chart.component';
import { combineLatest, Observable } from 'rxjs';
import { UserService } from '@app/users/services/user.service';
import { debounceTime, mapTo, startWith, tap } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ManagementDashboardService } from '@app/report/services/management-dashboard.service';
import { downloadBlobFile } from '@app/report/helper/download-helper';

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

@Component({
	selector: 'app-membership-affiliates',
	templateUrl: './membership-affiliates.component.html',
	styleUrls: ['./membership-affiliates.component.scss'],
	standalone: true,
	imports: [AffiliateChartComponent, CommonModule]
})
export class MembershipAffiliatesComponent implements OnInit {
	form!: FormGroup;

	tabs = ['Membresías', 'Proyectos'];
	activeSideTab: 'Membresías' | 'Proyectos' = 'Membresías';
	exporting = false;

	statusOpt: ISelectOpt[] = [];

	chartOptions!: ChartOptions;

	monthOpt: ISelectOpt[] = [
		// { id: '-1', text: 'Todos' },
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

	membershipOpt: ISelectOpt[] = [
		{ id: '-1', text: 'Todos' },
		{ id: '1', text: 'Vitalicia' },
		{ id: '2', text: 'Vitalicia plus' },
		{ id: '3', text: 'Premium' },
		{ id: '4', text: 'Ultra premium' },
		{ id: '5', text: 'Ultra plus' }
	];

	membershipChartOptions!: ChartOptions;
	projectChartOptions!: ChartOptions;
	// Para PROYECTOS
	projectOpt: ISelectOpt[] = [];

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private dashboardService: ManagementDashboardService,
		private snackBar: MatSnackBar,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.form = this.fb.group({
			status: ['-1'],
			month: ['1'],
			membership: [''],
			project: ['-1'],
			year: ['2025']
		});

		// Carga estados y países en paralelo
		this.loadStates().subscribe({
			error: (err) => console.error('Error cargando estados:', err)
		});
		this.loadProjects().subscribe({
			error: (err) => console.error('Error cargando proyectos de familia:', err)
		});

		this.listenToFormChanges(); // Escucha cambios en el formulario
	}

	selectSideTab(tab: 'Membresías' | 'Proyectos') {
		this.activeSideTab = tab;

		// Forzar recarga al cambiar de pestaña
		const status = this.form.get('status')!.value;
		const month = this.form.get('month')!.value;
		const membership = this.form.get('membership')!.value;
		const project = this.form.get('project')!.value;
		const year = +this.form.get('year')!.value;

		const s = status !== '-1' ? +status : undefined;
		const m = month !== '-1' ? +month : undefined;

		if (tab === 'Proyectos') {
			const pr = project !== '-1' ? +project : undefined;
			this.loadSubsciptionOrFamily(year, undefined, s, m, pr);
		} else {
			const pr = project !== '-1' ? +project : undefined;
			const p = membership !== '-1' ? +membership : undefined;
			this.loadSubsciptionOrFamily(year, p, s, m, pr);
		}
	}

	private listenToFormChanges(): void {
		// Escuchar CAMBIO DE PROYECTO → cargar membresías
		this.form
			.get('project')!
			.valueChanges.pipe(debounceTime(300), startWith(this.form.get('project')!.value))
			.subscribe((projectId) => {
				// ✅ Ahora SIEMPRE llama al backend sin importar el tab activo
				this.loadMembershipsByFamily(projectId).subscribe({
					error: (err) => console.error('Error cargando membresías:', err)
				});
			});

		combineLatest([
			this.form.get('status')!.valueChanges.pipe(startWith(this.form.get('status')!.value)),
			this.form.get('month')!.valueChanges.pipe(startWith(this.form.get('month')!.value)),
			this.form.get('membership')!.valueChanges.pipe(startWith(this.form.get('membership')!.value)),
			this.form.get('project')!.valueChanges.pipe(startWith(this.form.get('project')!.value))
		])
			.pipe(debounceTime(300))
			.subscribe(([status, month, membership, project]) => {
				const year = 2025;
				const s = status !== '-1' ? +status : undefined;
				const m = month !== '-1' ? +month : undefined;

				if (this.activeSideTab === 'Proyectos') {
					const pr = project !== '-1' ? +project : undefined;
					this.loadSubsciptionOrFamily(year, undefined, s, m, pr);
				} else {
					const p = membership !== '-1' ? +membership : undefined;
					const pr1 = project !== '-1' ? +project : undefined;
					this.loadSubsciptionOrFamily(year, p, s, m, pr1);
				}
			});
	}

	private loadSubsciptionOrFamily(
		year: number,
		packageId?: number,
		state?: number,
		month?: number,
		familyId?: number
	): void {
		this.dashboardService.getSubscribersByPackage(year, packageId, state, month, familyId).subscribe(
			(res: any) => {
				// console.log('Datos de afiliados por membresía o proyecto:', res);
				const grouped = new Map<string, number>();
				let title = '';
				if (this.activeSideTab === 'Proyectos') {
					title = 'Afiliados por Proyecto';
					res.data.forEach((item: any) => {
						grouped.set(item.familyName, (grouped.get(item.familyName) ?? 0) + item.total);
					});
					// console.log('Datos agrupados por proyecto:', grouped);
				} else {
					title = 'Afiliados por Membresía';
					res.data.forEach((item: any) => {
						grouped.set(item.packageName, (grouped.get(item.packageName) ?? 0) + item.total);
					});
					// console.log('Datos agrupados por membresía:', grouped);
				}

				const categories = Array.from(grouped.keys());
				const data = Array.from(grouped.values());
				// console.log('Categorías:', categories);
				// console.log('Datos:', data);
				this.buildChartOptions(title, categories, data);

				this.cdr.detectChanges(); // Forzar actualización de la vista
			},
			(error) => console.error('Error al cargar los datos de afiliados por membresía:', error)
		);
	}

	private buildChartOptions(label: string, categories: string[], data: number[]): void {
		const percentages = data.map((v) => Math.round((v / 1000) * 100));
		const maxAfiliados = Math.max(...data);
		const maxPct = Math.max(...percentages);

		const yLeftMax = Math.ceil(maxAfiliados / 100) * 100;
		const yRightMax = Math.ceil(maxPct / 10) * 10;

		const options: ChartOptions = {
			series: [{ name: 'Afiliados', data }],
			chart: { type: 'bar', height: 400 },
			title: { text: label },
			xaxis: { categories },
			yaxis: [
				{
					min: 0,
					max: yLeftMax,
					tickAmount: 6
				},
				{
					opposite: true,
					title: { text: '% DE CRECIMIENTO' },
					labels: { formatter: (v) => `${v.toFixed(0)}%` },
					min: 0,
					max: yRightMax,
					tickAmount: 4
				}
			],
			legend: { position: 'top' },
			tooltip: {
				enabled: true,
				y: {
					formatter: (val, { dataPointIndex }) => `${val} (${percentages[dataPointIndex]}%)`
				}
			},
			dataLabels: {
				enabled: false
			},
			stroke: { show: true, width: 2 }
		};

		// 🔁 Asignar al gráfico correcto según la pestaña activa
		if (this.activeSideTab === 'Proyectos') {
			this.projectChartOptions = options;
		} else {
			this.membershipChartOptions = options;
		}
	}

	private loadStates(): Observable<void> {
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
			tap(() => this.cdr.detectChanges()), // ← forzamos la actualización
			mapTo(void 0)
		);
	}

	private loadMembershipsByFamily(familyId: string): Observable<void> {
		this.form.get('membership')?.setValue('-1'); // Selecciona "Todos" por defecto

		return this.userService.getPackagesByFamilyPackage(familyId).pipe(
			tap((packages) => {
				const dynamicOptions = packages.map((pkg: any) => ({
					id: pkg.idPackage.toString(),
					text: pkg.name.trim()
				}));

				this.membershipOpt = [
					{ id: '-1', text: 'Todos' }, // Opción fija al inicio
					...dynamicOptions
				];
			}),
			tap(() => this.cdr.detectChanges()),
			mapTo(void 0)
		);
	}

	private loadProjects(): Observable<void> {
		return this.userService.getAllFamilyPackages().pipe(
			tap((families) => {
				const dynamicOptions = families.map((f: any) => ({
					id: f.idFamilyPackage.toString(),
					text: f.name.trim()
				}));

				this.projectOpt = dynamicOptions;

				// Seleccionar el primero por defecto
				if (dynamicOptions.length > 0) {
					this.form.get('project')?.setValue(dynamicOptions[0].id);
				}
			}),
			tap(() => this.cdr.detectChanges()),
			mapTo(void 0)
		);
	}

	private showSuccessMessage(filename: string): void {
		this.snackBar.open(`✅ ${filename} descargado correctamente`, 'Cerrar', { duration: 2000 });
	}

	private showErrorMessage(): void {
		this.snackBar.open('❌ Error al descargar el Excel', 'Cerrar', { duration: 2000 });
	}

	exportExcelSubscribers(): void {
		if (this.exporting) return;
		this.exporting = true;

		const year = +this.form.get('year')!.value;
		const month = +this.form.get('month')!.value;
		const status = this.form.get('status')!.value !== '-1' ? +this.form.get('status')!.value : undefined;
		const packageId =
			this.form.get('membership')!.value !== '-1' ? +this.form.get('membership')!.value : undefined;
		const familyId =
			this.form.get('project')!.value !== '-1' ? +this.form.get('project')!.value : undefined;
		const isProjectTab = this.activeSideTab === 'Proyectos';
		const monthName = this.monthOpt.find(m => +m.id === month)?.text ?? `mes_${month}`;
		const filename = isProjectTab
			? `afiliados_proyecto_mes_${monthName}.xlsx`
			: `afiliados_membresia_mes_${monthName}.xlsx`;

		this.dashboardService
			.downloadSubscribersByPackage(year, isProjectTab ? undefined : packageId, status, month, familyId)
			.subscribe({
				next: (res: Blob) => {
					downloadBlobFile(res, filename);
					this.exporting = false;
					this.showSuccessMessage(filename);
					this.cdr.detectChanges();
				},
				error: () => {
					this.exporting = false;
					this.showErrorMessage();
					this.cdr.detectChanges();
				}
			});
	}

}
