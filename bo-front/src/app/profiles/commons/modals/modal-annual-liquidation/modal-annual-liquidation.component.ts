
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-modal-annual-liquidation',
	standalone: true,
	imports: [],
	templateUrl: './modal-annual-liquidation.component.html',
})
export class ModalAnnualLiquidationComponent {

	constructor(public ref: DynamicDialogRef, private router: Router) {	
	}

	closeModal(): void {
		this.ref.close();
	}

	onClick(): void {
		this.ref.close();
		this.router.navigate([`/profile/partner/my-products`])
	}

}
