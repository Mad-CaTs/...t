import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { FormControlModule } from '../../../shared/components/form-control/form-control.module';
import { ManagementDashboardService } from '@app/report/services/management-dashboard.service';
import { mapTo, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserService } from '@app/users/services/user.service';

@Component({
	selector: 'app-national-affiliates',
	templateUrl: './national-affiliates.component.html',
	styleUrls: ['./national-affiliates.component.scss'],
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, FormControlModule]
})
export class NationalAffiliatesComponent {
	form!: FormGroup;
	// valores de ejemplo
	peruvianCount: number = 0;
	internationalCount: number = 0;
	// Opciones para filtros
	statusOpt: ISelectOpt[] = [
		{ id: 'Activo', text: 'Activo' },
		{ id: 'Inactivo', text: 'Inactivo' }
	];

	constructor(
		private fb: FormBuilder,
		private dashboardService: ManagementDashboardService,
		private userService: UserService,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.form = this.fb.group({
			peruState: ['-1'], // para la card Perú
			intlState: ['-1'] // para la card Internacional
		});

		// Carga inicial
		this.loadNationalData('ALL');

		// Escucha cambios del select peruanos
		this.form.get('peruState')?.valueChanges.subscribe((stateValue) => {
			const parsedState = stateValue !== '-1' ? +stateValue : undefined;
			this.loadNationalData('PE', parsedState);
		});

		// Escucha cambios del select internacionales
		this.form.get('intlState')?.valueChanges.subscribe((stateValue) => {
			const parsedState = stateValue !== '-1' ? +stateValue : undefined;
			this.loadNationalData('EX', parsedState);
		});

		// Carga estados y países en paralelo
		this.loadStates().subscribe({
			error: (err) => console.error('Error cargando estados:', err)
		});
	}

	private loadNationalData(typeNationality: string, state?: number): void {
		this.dashboardService.getAffiliatesNationalitySummary(typeNationality, state).subscribe({
			next: (res: any) => {
				const data = res?.data ?? [];

				// Actualiza valores según tipo
				if (typeNationality === 'PE') {
					this.peruvianCount = data[0]?.total || 0;
				} else if (typeNationality === 'EX') {
					this.internationalCount = data[0]?.total || 0;
				} else if (typeNationality === 'ALL') {
					this.peruvianCount = data[0]?.total || 0;
					this.internationalCount = data[1]?.total || 0;
				}
				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error('Error al cargar datos nacionales:', error);
			}
		});
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
			tap(() => this.cdr.detectChanges()),
			mapTo(void 0)
		);
	}
}
