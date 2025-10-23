import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

import { catchError, finalize, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PackagesApiService } from '@app/core/services/api/manage-business/packages-api.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@app/core/services/toast.service';
import { FamilyPackageAdministratorService } from '@app/manage-business/services/FamilyPackageAdministratorService';
import { MembershipVersionAdministratorService } from '@app/manage-business/services/MembershipVersionAdministratorService';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { IMembershipVersion } from '@interfaces/packageAdministrator';
import { ModalLoadingComponentManageBusiness } from '../modal-loading/modal-loading.component';

@Component({
	selector: 'app-modal-family-edit',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-family-edit.component.html',
	styleUrls: ['./modal-family-edit.component.scss']
})
export class ModalFamilyEditComponent {
	@Input() id: number;
	@Input() name: string;
	@Input() description: string;

	//Versiones
	public activeVersion: Number = 1;
	public lastVersion: Number = 1;
	public versionOptions: ISelectOpt[] = [];

	public view: number = 1;

	public form: FormGroup;
	public formChangeVersion: FormGroup;
	public formProgramChangeVersion: FormGroup;
	private loadingModalRef: NgbModalRef | null = null; 

	public loading: boolean = false;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private modalManager: NgbModal,
		private familyPackageService: FamilyPackageAdministratorService,
		private membershipVersionService: MembershipVersionAdministratorService,
		private toastManager: ToastService,
		private cdr: ChangeDetectorRef,
		public modal: NgbModal, 
	) {

		
		this.form = builder.group({
			name: ['', [Validators.required, Validators.minLength(4)]],
			description: ['', [Validators.required, Validators.minLength(4)]]
		});

		this.formChangeVersion = builder.group({
			version: ['', [Validators.required]]
		});

		this.formProgramChangeVersion = builder.group({
			version: ['', [Validators.required]],
			date: [new Date().toISOString(), [Validators.required]]
		});
	}

	
	ngOnInit(): void {
		this.form.patchValue({
			name: this.name,
			description: this.description
		});

		this.loadVersions();
	}

	/* === Events === */
	public onSubmitFamily() {
		if (this.form.invalid) {
			this.toastManager.addToast('Por favor, complete todos los campos correctamente.', 'error');
			return;
		}
		
		const name = this.form.get('name')?.value;
		const description = this.form.get('description')?.value;
		const idFamilyPackage = this.id.toString();

		this.loading = true;

		this.familyPackageService.editFamilyPackage(idFamilyPackage, name, description).pipe(
			map(res => {
				this.instanceModal.close('success');

				const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
				const modal = ref.componentInstance as ModalConfirmationComponent;

				modal.body = 'Se editó la Familia de paquetes';
				modal.icon = 'bi bi-check-circle-fill text-info fa-2x';
				modal.title = 'Éxito';

				this.toastManager.addToast('Familia de paquetes editada exitosamente.', 'success');
			}),
			catchError(e => {
				this.toastManager.addToast('Hubo un error al editar.', 'error');
				return of(undefined);
			}),
			finalize(() => {
				this.loading = false;
			})
		).subscribe();

	}

	//Versiones
	public loadVersions(){
		this.membershipVersionService.getLastMembershipVersionByFamilyPackage(this.id.toString()).subscribe(
			(data) => {
				if (data) {
					this.lastVersion = data.idMembershipVersion;
					this.cdr.detectChanges();
				} 
				else {
					console.error('No se encontró la última versión de membresía');
				}
			},
			(error) => {
				console.error('Error al obtener la última versión de membresía:', error);
			}
		);

		this.membershipVersionService.getActiveMembershipVersionByFamilyPackage(this.id.toString()).subscribe(
			(data) => {
				if (data) {
					this.activeVersion = data.idMembershipVersion;
					this.formChangeVersion.get('version')?.setValue(this.activeVersion);
					this.cdr.detectChanges();
				} 
				else {
					console.error('No se encontró la versión activa de membresía');
				}
			},
			(error) => {
				console.error('Error al obtener la versión activa de membresía:', error);
			}
		);

		this.membershipVersionService.getAllMembershipVersionByFamilyPackage(this.id.toString()).pipe(
			map((response: IMembershipVersion[]) => response.map((item: IMembershipVersion) => ({
				id: item.idMembershipVersion.toString(),
				text: item.description
		  	}))),
		  	catchError(error => {
				console.error('Error obteniendo versiones:', error);
				return of([]);
		 	})
			).subscribe(versionOptions => {
		  		this.versionOptions = versionOptions;
		  		this.cdr.detectChanges();
			});
		
	}

	public onChangeVersion(){
		this.showLoadingModal();
		const newVersion = this.formChangeVersion.get('version')?.value;
		this.membershipVersionService.activeVersionByFamilyPackage(this.id.toString(), newVersion.toString())
        .subscribe({
            next: (response) => {
                this.loadVersions();
				this.cdr.detectChanges();
				this.hideLoadingModal();
                // Agregar toast de éxito
                this.toastManager.addToast('Versión activada exitosamente.', 'success');
            },
            error: (error) => {
                console.error('Ocurrió un error:', error.message);
				this.cdr.detectChanges();
				this.hideLoadingModal();
				this.toastManager.addToast('Hubo un error al activar la versión.', 'error');
            }
        });	
	}

	public onCreateVersion(){
		this.showLoadingModal();
		this.membershipVersionService.createNewVersionByFamilyPackage(this.id.toString())
        .subscribe({
            next: (response) => {
                this.loadVersions();
				this.cdr.detectChanges();
				this.hideLoadingModal();
                // Agregar toast de éxito
                this.toastManager.addToast('Nueva versión creada exitosamente.', 'success');
            },
            error: (error) => {
                console.error('Ocurrió un error:', error.message);
				this.cdr.detectChanges();
				this.hideLoadingModal();
				this.toastManager.addToast('Hubo un error al crear la nueva versión.', 'error');
            }
        });	
	}


	private showLoadingModal(): void {
		this.loadingModalRef = this.modal.open(ModalLoadingComponentManageBusiness, { centered: true, size: 'sm' });
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}
}
