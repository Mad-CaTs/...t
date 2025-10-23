import { ChangeDetectorRef, Component } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';

import { FixDataModalComponent } from '../../components/modals';

import type {
	ICivilStatus,
	ICountry,
	IDocumentType,
	IRequestFixDataService,
	IRequestSearchUser
} from '@interfaces/users.interface';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@app/users/services/user.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
	selector: 'app-modify-data-users',
	templateUrl: './modify-data-users.component.html',
	styleUrls: ['./modify-data-users.component.scss']
})
export class ModifyDataUsersComponent {
	tableData: IRequestSearchUser[] | null = null;
	form: FormGroup;
	countries: ICountry[] | null = null;
	civilStatus: ICivilStatus[] | null = null;
	documents: IDocumentType[] | null = null;
	allData: IRequestFixDataService | null = null;
	buttonLoading: boolean = false;

	constructor(
		public formBuilder: FormBuilder,
		public modal: NgbModal,
		private userService: UserService,
		private cdr: ChangeDetectorRef
	) {
		this.form = formBuilder.group({ search: [''] });
	}

	ngOnInit(): void {
		this.userService.getAllCountries().subscribe((countries) => {
			this.countries = countries;
			this.cdr.detectChanges();
		});
		this.userService.getAllCivilStatus().subscribe((statuses) => {
			this.civilStatus = statuses;
			this.cdr.detectChanges();
		});
	}

	onSearch() {
		const searchValue = this.form.get('search')?.value;
		if (searchValue) {
			this.buttonLoading = true;
			this.userService.getUsersByUsernameAndFullname(searchValue).subscribe(
				(users) => {
					if (users && users.length > 0) {
						const uniqueCountries = Array.from(
							new Set(users.map((user) => user.idResidenceCountry))
						).filter((id): id is number => id !== null && id !== undefined);
						const documentRequests = uniqueCountries.map((countryId) =>
							this.userService.getDocumentsTypebyCountry(countryId.toString())
						);

						forkJoin(documentRequests).subscribe((documentsResponses) => {
							const allDocuments = documentsResponses.reduce(
								(acc, curr) => acc.concat(curr),
								[]
							);
							this.mapUsersResponseToTableData(users, allDocuments);
						});
						this.buttonLoading = false;
					} else {
						this.tableData = null;
						this.buttonLoading = false;
						this.cdr.detectChanges();
					}
				},
				(error) => {
					this.tableData = null;
					this.buttonLoading = false;
					this.cdr.detectChanges();
				},
			);
		}
	}

	onEdit(username: string) {
		this.userService.getUserByUsername(username).subscribe((user) => {
			const idCountry = user.idResidenceCountry != null ? user.idResidenceCountry.toString() : null;

			const openModal = (documents: IDocumentType[]) => {
				const ref = this.modal.open(FixDataModalComponent, { centered: true });
				const modal = ref.componentInstance as FixDataModalComponent;

				modal.id = user.idUser.toString();
				modal.allData = user;
				modal.countries = this.countries;
				modal.civilStatus = this.civilStatus;
				modal.documents = documents;

				this.cdr.detectChanges();
			};

			if (idCountry) {
				this.userService.getDocumentsTypebyCountry(idCountry).subscribe((documents) => {
					openModal(documents);
				}, () => openModal([]));
			} else {
				openModal([]);
			}
		});
	}

	mapUsersResponseToTableData(users: IRequestSearchUser[], documents: IDocumentType[]) {
		this.tableData = users.map((user) => {
			const documentType =
				documents.find((doc) => doc.idDocumentType === user.idTypeDocument)?.name || 'Desconocido';
			const country =
				this.countries?.find((country) => country.idCountry === user.idResidenceCountry)?.countrydesc ||
				'Desconocido';

			return {
				idUser: user.idUser,
				username: user.username,
				creationDate: user.creationDate,
				documentNumber: user.documentNumber,
				name: user.name,
				gender: user.gender,
				lastName: user.lastName,
				email: user.email,
				cellPhone: user.cellPhone,
				state: user.state,
				idTypeDocument: user.idTypeDocument,
				docType: documentType,
				address: user.address,
				districtAddress: user.districtAddress,
				idResidenceCountry: user.idResidenceCountry,
				country: country
			};
		});
		this.cdr.detectChanges();
	}
}
