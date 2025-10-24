import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PeriodService } from 'src/app/profiles/pages/ambassador/commons/components/box-cycle-weekly/commons/services/period.service';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { TreeService } from '../../../../../commons/services/tree.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-range-manager-state-data',
	standalone: true,
	providers: [DatePipe],
	imports: [CommonModule],
	templateUrl: './range-manager-state-data.component.html',
	styleUrl: './range-manager-state-data.component.scss'
})
export class RangeManagerStateDataComponent implements OnInit {
	@Input() data: any;
	@Input() pointsData: any;
	public currentDateTime: string;
	initialDate: string = '';
	endDate: string = '';
	rangoPeriodo: any;
	userStates: any[] = [];
	userStatus: string = '';
	statusColor: { textColor: string; backgroundColor: string } = { textColor: '', backgroundColor: '' }; // Inicializamos vacío, ya que el color se obtiene de la API

	/*   pointsData: any;
	 */

	constructor(
		private periodService: PeriodService,
		private datePipe: DatePipe,
		private treeService: TreeService,
		private userInfoService: UserInfoService
	) {}

	ngOnInit(): void {
		this.setCurrentDateTime();
		this.obtenerRangoPeriodo();
		this.getListAllStates();
	}

	private setCurrentDateTime() {
		const today = new Date();
		const dateOptions: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};
		const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

		let datePart = today.toLocaleDateString('es-ES', dateOptions);
		const timePart = today.toLocaleTimeString('en-US', timeOptions);

		datePart = this.capitalizeFirstLetter(datePart).replace(' de ', ' de ');

		this.currentDateTime = `${datePart}, ${timePart}`;
	}
	private capitalizeFirstLetter(string: string): string {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	obtenerRangoPeriodo(): void {
		this.periodService.getRangeBetween().subscribe({
			next: (data) => {
				this.rangoPeriodo = data;
				this.initialDate = this.formatDate(this.rangoPeriodo.data.initialDate);
				this.endDate = this.formatDate(this.rangoPeriodo.data.endDate);
			},
			error: (error) => {
				console.error('Error al obtener el rango:', error);
			}
		});
	}

	private formatDate(dateArray: number[]): string {
		if (dateArray && dateArray.length >= 3) {
			const [year, month, day] = dateArray;
			const date = new Date(year, month - 1, day);
			return this.datePipe.transform(date, 'dd/MM/yy') || '';
		}
		return '';
	}

	getListAllStates(): void {
		this.treeService.getListAllStates().subscribe({
			next: (states) => {
				this.userStates = states;
				this.setUserStatus();
			},
			error: (err) => {
				console.error('Error al obtener los estados:', err);
			}
		});
	}

	setUserStatus(): void {
		const userIdStatus = this.data.idState;
		if (this.userStates && this.userStates.length > 0) {
			const userState = this.userStates.find((state) => state.idState === userIdStatus);
			if (userState) {
				this.userStatus = userState.nameState;
				this.statusColor = this.getStatusColor(userState.colorRGB);
			} else {
				this.userStatus = 'Estado desconocido';
				this.statusColor = { textColor: '', backgroundColor: '' };
			}
		} else {
			this.userStatus = 'Estado desconocido';
			this.statusColor = { textColor: '', backgroundColor: '' };
		}
	}

	getStatusColor(colorRGB: string): { textColor: string; backgroundColor: string } {
		if (colorRGB) {
			return {
				textColor: colorRGB,
				backgroundColor: this.hexToRgba(colorRGB, 0.2)
			};
		}

		return { textColor: '', backgroundColor: '' };
	}

	private hexToRgba(hex: string, alpha: number): string {
		let r = parseInt(hex.slice(1, 3), 16);
		let g = parseInt(hex.slice(3, 5), 16);
		let b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}
}
