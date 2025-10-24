import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { concatMap, of } from 'rxjs';
import { SponsorService } from '../../services/sponsor.service';
import { SearchSelectComponent } from '@shared/components/form-control/search-select/search-select.component';

@Component({
	selector: 'app-modal-reactivacion',
	templateUrl: './modal-reactivacion.component.html',

	standalone: true,
	providers: [DialogService],
	imports: [CommonModule, ReactiveFormsModule, SearchSelectComponent],
	styleUrls: ['./modal-reactivacion.component.css']
})
export default class ModalReactivacionComponent {
	optSponsors: any[] = [];
	isLoading = true;
	selectedSponsorId: any = null;
	form: FormGroup;
	showSearchSelect = true;

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		public ref: DynamicDialogRef,
		private sponsorService: SponsorService,
		public config: DynamicDialogConfig,
		private cdr: ChangeDetectorRef
	) {
		this.form = this.fb.group({
			sponsor: [null]
		});
	}

	closeModal() {
		this.ref.close();
	}

	nextStep() {
		if (this.selectedSponsorId) {
			this.ref.close(this.selectedSponsorId);
		} else {
			console.warn('No se seleccionó ningún patrocinador.');
		}
	}
	onSearchSponsor(searchText: string) {
		this.sponsorService
			.getSponsors(searchText)
			.pipe(
				concatMap((users) => {
					this.optSponsors = users.map((user) => ({
						value: user.idUser,
						content: `${user.name} ${user.lastName}`
					}));
					this.cdr.detectChanges();
					return of(users);
				})
			)
			.subscribe(
				(response) => {
					console.log('Data processed successfully');
				},
				(error) => {
					console.error('❌ Error al buscar patrocinadores:', error);
				}
			);
	}

	onSponsorSelected(sponsor: any) {
		this.selectedSponsorId = sponsor;
	}
}
