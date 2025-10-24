import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { activationManagerTableMock } from '../../../../activation-manager/commons/mocks/mock';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';

@Component({
	selector: 'app-modal-account-tree-range-manager',
	templateUrl: './modal-account-tree-range-manager.component.html',
	standalone: true,
	imports: [CommonModule, ModalComponent],
	styleUrls: []
})
export class ModalAccountTreeRangeManagerComponent implements OnInit {
	@Input() id: number = 0;

	public view: number = 1;
	public pointsData: any = null;
	public isLoading: boolean = false;

	constructor(
		public instanceModal: NgbActiveModal,
		private dashboardService: DashboardService
	) {}

	get userData() {
		const result = activationManagerTableMock.find((a) => a.id === this.id);

		return result || activationManagerTableMock[0];
	}

	get title() {
		if (this.view === 2) return 'Flyer';
		if (this.view === 3) return 'Dashboard';

		return 'Detalle';
	}

	ngOnInit(): void {
		if (this.id) {
			this.loadPointsData();
		}
	}

	loadPointsData(): void {
		this.isLoading = true;
		this.dashboardService.getPoints(this.id).subscribe({
			next: (response: any) => {
				if (response?.data) {
					this.pointsData = response.data;
				}
				this.isLoading = false;
			},
			error: (error) => {
				console.error('Error cargando datos de puntos:', error);
				this.isLoading = false;
			}
		});
	}
}
