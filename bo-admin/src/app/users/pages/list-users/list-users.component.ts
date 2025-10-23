import { ChangeDetectorRef, Component } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { asOptMock, dataBodyMock, familyPackageOptMock, packageOptMock, statusOptMock } from './mock';

import {
	ModalPartnersRegisteredComponent,
	ModalDeletePartnerRegisterComponent
} from '../../components/modals';

import type { IPartnersRegisteredSearchForm, IPartnersRegisteredTable } from '@interfaces/partners.interface';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@app/users/services/user.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { ToastService } from '@app/core/services/toast.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-list-users',
	templateUrl: './list-users.component.html',
	styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent {
	tableData: IPartnersRegisteredTable[] = [];
	form: FormGroup;
	selectPartnerName = '';

	// Select opt
	asOpt: ISelectOpt[] = [
		{ id: '1', text: 'Usuario' },
		{ id: '2', text: 'Patrocinador' }
	];
	statusOpt: ISelectOpt[] = [];
	familyPackageOpt: ISelectOpt[] = [];
	packageOpt: ISelectOpt[] = [];
	buttonLoading: boolean = false;

	constructor(private formBuilder: FormBuilder,
		public modalService: NgbModal,
		private userService: UserService,
		private cdr: ChangeDetectorRef,
		private toastService: ToastService,
		private router: Router) {
		this.form = formBuilder.group({
			search: [''],
			as: ['1'],
			status: ['-1'],
			familyPackage: ['0'],
			package: ['0']
		});
	}

	ngOnInit(): void {

		//Estados
		this.userService.getAllStates().subscribe(
			(states) => {
				this.statusOpt = [
					{ id: '-1', text: 'Todos' },
					...states.map(state => ({
						id: state.idState.toString(),
						text: state.nameState
					}))
				];
				this.cdr.detectChanges();
			},
			(error) => {
				console.error('Error fetching states:', error);
			}
		);

		//Family Package
		this.userService.getAllFamilyPackages().subscribe(
			(familyPackages) => {
				this.familyPackageOpt = [
					{ id: '0', text: 'Todos' },
					...familyPackages.map(familyPackage => ({
						id: familyPackage.idFamilyPackage.toString(),
						text: familyPackage.name
					}))
				];
				this.cdr.detectChanges();
			},
			(error) => {
				console.error('Error fetching familypackages:', error);
			}
		);

		// Packages: Con listener
		this.form.get('familyPackage')?.valueChanges.subscribe(value => {
			this.form.get('package')?.setValue('0'); // Resetear el valor de 'package' a '0' cuando 'familyPackage' cambie
			if (value === '0') {
				this.packageOpt = [];
				this.cdr.detectChanges();
			} else {
				this.userService.getPackagesByFamilyPackage(value).subscribe(
					(packages) => {
						this.packageOpt = packages.map(pkg => ({
							id: pkg.idPackage.toString(),
							text: pkg.name
						}));
						const firstPackageId = this.packageOpt.length > 0 ? this.packageOpt[0].id : '0';
						this.form.get('package')?.setValue(firstPackageId);
						this.cdr.detectChanges();
					},
					(error) => {
						console.error('Error fetching packages:', error);
					}
				);
			}
		});


	}

	onSearch() {
		this.buttonLoading = true;
		const searchValue = this.form.get('search')?.value;
		const as = this.form.get('as')?.value;
		const status = this.form.get('status')?.value;
		const familyPackage = this.form.get('familyPackage')?.value;
		const packagee = this.form.get('package')?.value;

		if (!as || !status || !familyPackage || (this.packageOpt.length > 0 && !packagee)) {
			const message = 'Seleccione una opción en los campos obligatorios.';
			this.toastService.addToast(message, 'warning'); // Mostrar mensaje de error
			return;
		}

		this.userService.getUsersByFilter(searchValue, status, familyPackage, packagee, as).subscribe(
			(response) => {
				this.tableData = response.map((user: any) => ({
					id: user.idUser,
					username: user.username,
					fullname: user.name,
					lastname: user.lastName,
					startDate: user.creationDate,
					email: user.email,
					phone: user.cellPhone,
					docNumber: user.documentNumber,
					docType: user.documentName,
					partner: user.sponsorName || user.sponsorLastName ? `${user.sponsorName} ${user.sponsorLastName}`.trim() : 'No hay sponsor',
					status: this.statusOpt.find(opt => opt.id === user.state.toString())?.text || '',
					subscriptionQuantity: 0,
					gender: user.gender
				}));
				this.buttonLoading = false;
				this.cdr.detectChanges();
			},
			(error) => {
				console.error('Error fetching users by filter:', error);
				this.buttonLoading = false;
			}
		);

	}

	onViewSubscriptions(user: any) {
		const modalRef = this.modalService.open(ModalPartnersRegisteredComponent, {
			centered: true,
			size: 'xl'
		});
		const modal = modalRef.componentInstance as ModalPartnersRegisteredComponent;
		modal.idUser = user.id;
		modal.userName = user.username;
		modal.fullName = user.fullname;
		modal.document = user.document;
		modal.typeDocument = user.typeDocument;
	}

	onDeletePartner(user: any) {
		const modalRef = this.modalService.open(ModalDeletePartnerRegisterComponent, { centered: true });
		const modal = modalRef.componentInstance as ModalDeletePartnerRegisterComponent;
		modal.idUser = user.id;
		modal.username = user.username;
	}

	goToByPartner(evt: { id: string }) {
		const u = this.tableData.find(x => x.id === evt.id);
		const displayName =
			`${u?.fullname ?? ''} ${u?.lastname ?? ''}`.trim() || u?.username || '';

		// Guarda en sessionStorage para sobrevivir al refresh
		try {
			sessionStorage.setItem(`partnerName:${evt.id}`, displayName);
		} catch {}

		// Navega pasando el nombre por state y también por query param (sobrevive al F5)
		this.router.navigate(
			['/dashboard/users/list-user-by-id', evt.id],
			{ state: { partnerName: displayName }, queryParams: { name: displayName || undefined } }
		);
	}
}
