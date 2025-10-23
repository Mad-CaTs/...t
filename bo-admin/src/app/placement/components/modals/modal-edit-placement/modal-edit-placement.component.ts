import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */

import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-modal-edit-placement',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-edit-placement.component.html',
	styleUrls: ['./modal-edit-placement.component.scss']
})
export class ModalEditPlacementComponent {
	@Input() idUser: number = 0;
	@Input() placementDate: Date;

	public form: FormGroup;
	public loading: boolean = false;
	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private cdr: ChangeDetectorRef,
	) {
		this.form = builder.group({
			placementDate: ['']
		});
	}

	ngOnInit(): void {
        if (this.placementDate) {
            const placementDate = new Date(this.placementDate);
    
            if (!isNaN(placementDate.getTime())) {
                this.form.patchValue({
                    placementDate: placementDate
                });
            } else {
                console.error('Invalid Date:', this.placementDate);
            }
        }
    }
    

	/* === Events === */
}
