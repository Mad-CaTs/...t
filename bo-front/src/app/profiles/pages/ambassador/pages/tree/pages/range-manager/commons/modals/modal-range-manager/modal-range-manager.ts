import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { ModalDashboardRangeManager } from '../modal-dashboard-range-manager/modal-dashboard-range-manager';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RangeManagerService } from '../../service/range-manager.service';

@Component({
	selector: 'app-enterprise-bank-details',
	standalone: true,
	providers: [MessageService, DatePipe],
	imports: [CommonModule, MatIconModule, DialogModule, ToastModule, ProgressSpinnerModule],
	templateUrl: './modal-range-manager.html',
	styleUrl: './modal-range-manager.scss'
})
export class ModalRangeManager implements OnInit {
	data: any;
	isLoading = false;
	dialogRef: DynamicDialogRef;
	/*   @Input() selectedRecord: any;
	 */ pointsData: any;
	/*   dataPoints: any;
	 */
	modalReady = false;

	constructor(
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		private dialogService: DialogService,
		private dashboardService: DashboardService,
		private _rangeManagerService: RangeManagerService,
	) {
		this.data = config.data.record;
	}
	ngOnInit(): void {
		this.getPoints(this.data.idUser);
	}

	closeModal() {
		this.ref.close();
	}

	private getPoints(id: number): void {
		this.isLoading = true;
		const idUser = id;
		this.dashboardService.getPoints(idUser).subscribe({
			next: (response) => {
				this.isLoading = false;
				this.pointsData = response?.data ?? [];
				this.modalReady = true;
			},
			error: (err) => {
				console.error('Error occurred:', err);
				this.isLoading = false;
				this.pointsData = [];
				this.modalReady = true;
			}
		});
	}

	openDashboard() {
		if (this.ref) {
			this.ref.close();
			this.ref = null!;
		}
		this._rangeManagerService.setFlagRangeManager(false);
	}
}
