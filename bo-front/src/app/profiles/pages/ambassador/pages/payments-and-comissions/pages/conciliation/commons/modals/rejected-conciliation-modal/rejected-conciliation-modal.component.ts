import { Component, inject, OnInit } from '@angular/core';
import { RejectedConciliationResponse } from '../../interfaces/conciliation.interface';
import { ConciliationService } from '../../services/conciliation.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
	selector: 'app-rejected-conciliation-modal',
	standalone: true,
	imports: [AccordionModule, DividerModule, ProgressSpinnerModule],
	templateUrl: './rejected-conciliation-modal.component.html',
	styleUrl: './rejected-conciliation-modal.component.scss'
})
export class RejectedConciliationModalComponent implements OnInit {
	public ref: DynamicDialogRef = inject(DynamicDialogRef);
	public config: DynamicDialogConfig = inject(DynamicDialogConfig);
	public isLoading: boolean = false;
	public rejected: RejectedConciliationResponse;
	private _conciliationService: ConciliationService = inject(ConciliationService);

	ngOnInit(): void {
		this.initializeRejectedPaymentDetails();
	}

	initializeRejectedPaymentDetails(): void {
		this.isLoading = true;
		const idConciliation = this.config.data;
		this._conciliationService.getRejectedByIdConciliation(idConciliation).subscribe({
			next: (data) => {
				this.rejected = data;
				setTimeout(() => {
					this.isLoading = false;
				}, 500);
			},
			error: (error) => {
				setTimeout(() => {
					this.isLoading = false;
					this.ref.close();
				}, 500);
			}
		});
	}
}
