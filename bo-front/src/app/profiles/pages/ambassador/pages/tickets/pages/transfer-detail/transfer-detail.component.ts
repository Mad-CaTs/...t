import { CommonModule } from '@angular/common';
import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	SimpleChanges
} from '@angular/core';
import { IDashboardInfoCard } from '../../commons/interfaces';
import InfoCardComponent from '../../commons/components/info-card/info-card.component';
import TransferFormComponent from '../../commons/components/transfer-form/transfer-form.component';
import { TransferService } from '../commons/services/transfer/transfer.service';
import { UserResponse } from 'src/app/authentication/commons/interfaces/authenticate.interface';
import { mapSponsorToCardData } from '../commons/utils/sponsor-card.mapper';
import { ISelect } from '@shared/interfaces/forms-control';
import { TransferFormPresenter } from './transfer-form.presenter';
import {
	catchError,
	combineLatest,
	debounceTime,
	distinctUntilChanged,
	finalize,
	of,
	startWith,
	Subject,
	take,
	takeUntil,
	tap
} from 'rxjs';
import { NewPartnerService } from '../../../new-partner/commons/services/new-partner.service';
import { ProspectService } from '../../../prospect/services/prospect-service.service';

@Component({
	selector: 'app-transfer-detail',
	standalone: true,
	imports: [CommonModule, InfoCardComponent, TransferFormComponent],
	providers: [TransferFormPresenter],
	templateUrl: './transfer-detail.component.html',
	styleUrl: './transfer-detail.component.scss'
})
export default class TransferDetailComponent implements OnInit {
	@Output() formChange = new EventEmitter<any>();
	@Output() sponsorInfoChange = new EventEmitter<any>();

	@Input() initialData: any;
	@Input() selectedId: any;
	@Input() userInfo!: UserResponse;
	sponsorInfo: IDashboardInfoCard;
	public multicodeList: ISelect[] = [];
	public searchResults: any[] = [];
	membershipResults: any[] = [];
	loadingSearch: boolean = false;
	existingUserData: any = null;
	isDocumentLoading: boolean = false;
	private destroy$ = new Subject<void>();

	constructor(
		public presenter: TransferFormPresenter,
		private transferService: TransferService,
		private newPartnerService: NewPartnerService,
		private changeDetectorRef: ChangeDetectorRef,
		private prospectService: ProspectService
	) {}

	ngOnInit(): void {
		this.onSelectChange(this.selectedId);
		this.checkAndLoadSponsor();
		this.onStepTwoSelectionChange(this.selectedId);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	ngAfterViewInit(): void {
		this.changeDetectorRef.detectChanges();
		const nroControl = this.presenter.form.get('nroDocument');
		const idControl = this.presenter.form.get('idDocument');
		const resControl = this.presenter.form.get('residenceCountryId');
		if (nroControl && idControl && resControl) {
			combineLatest([
				nroControl.valueChanges.pipe(startWith(nroControl.value)),
				idControl.valueChanges.pipe(startWith(idControl.value)),
				resControl.valueChanges.pipe(startWith(resControl.value))
			])
				.pipe(
					debounceTime(300),
					distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
					takeUntil(this.destroy$)
				)
				.subscribe(([nro, idDoc, res]) => {
					this.checkDocumentExists();
				});
		}
	}

	private checkAndLoadSponsor(): void {
		if (this.selectedId === 2) {
			this.loadSponsorByMulticode(this.userInfo.id);
		} else if (this.selectedId === 3 || this.selectedId === 4) {
			this.onMembership(this.userInfo.username);
		}
	}

	onStepTwoSelectionChange(selectedId: any) {
		this.presenter.form.get('stepTwoOption')?.setValue(selectedId);
		this.presenter.form.get('stepTwoOption')?.setValue(selectedId);
	}

	onFormChange(data: any) {
		const username = data?.value?.value?.sponsor_username;
		if (username) {
			const sponsorData = data.value.value;
			this.sponsorInfo = mapSponsorToCardData(sponsorData);
			this.sponsorInfoChange.emit(this.sponsorInfo);
		}

		this.formChange.emit(data);
	}

	onSelectChange(selectedId: number): void {
		this.selectedId = selectedId;
		if ([1, 2, 4].includes(this.selectedId)) {
			this.transferService.getTransferListByUser(this.userInfo.id, this.selectedId).subscribe({
				next: (data) => {
					this.sponsorInfo = mapSponsorToCardData(data);
					this.sponsorInfoChange.emit(data);
				},
				error: (err) => {
					console.error('Error al llamar la API:', err);
				}
			});
		}
	}

	private loadSponsorByMulticode(idMulticode: number): void {
		this.transferService.getSponsorByMulticode(idMulticode).subscribe({
			next: (res) => {
				this.multicodeList = res.map((item: any) => ({
					value: item.child_id,
					content: item.username
				}));
			},
			error: (err) => {
				console.error('Error al obtener multicodes:', err);
			}
		});
	}

	onSearch(sponsorUsername: string): void {
		this.loadingSearch = true;

		if (this.selectedId === 3) {
			// Caso 3: traspaso a socio nuevo
			this.handleNewSponsorSearch(sponsorUsername);
		} else if (this.selectedId === 4) {
			// Caso 4: traspaso a socio vigente
			this.handleExistingUserSearch(sponsorUsername);
		} else {
			this.searchResults = [];
			this.loadingSearch = false;
		}
	}

	private handleNewSponsorSearch(sponsorUsername: string): void {
		this.transferService.getTransferListBySponsor(this.selectedId, sponsorUsername).subscribe({
			next: (data: any) => {
				const sponsors = Array.isArray(data) ? data : [data];
				this.searchResults = sponsors.map((s: any) => ({
					label: `${s.sponsor_name} ${s.sponsor_last_name} (${s.sponsor_username})`,
					value: s
				}));

				this.loadingSearch = false;
			},
			error: (err) => {
				console.error('Error al consultar API:', err);
				this.searchResults = [];
				this.loadingSearch = false;
			}
		});
	}

	private handleExistingUserSearch(sponsorUsername: string): void {
		this.transferService.getTransferListForExistingUser(sponsorUsername).subscribe({
			next: (res: any) => {
				const user = res?.data ? [res.data] : [];
				this.existingUserData = user;
				this.searchResults = user.map((u: any) => ({
					label: `${u.name} ${u.lastName}`,
					value: u
				}));
				this.loadingSearch = false;
			},
			error: (err) => {
				console.error('Error al consultar API:', err);
				this.searchResults = [];
				this.loadingSearch = false;
			}
		});
	}

	onMembership(username: string): void {
		if (!username) {
			console.warn('Ingrese un usuario antes de buscar');
			return;
		}

		this.transferService.getSubscriptionsByUsername(username).subscribe({
			next: (res: any) => {
				const data = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
				this.membershipResults = data.flatMap((item: any) => {
					const memberships = Array.isArray(item.membership?.membership)
						? item.membership.membership
						: [];
					return memberships.map((m: any) => ({
						content: m.namePackage,
						value: m.idMembership
					}));
				});
				const membershipControl = this.presenter.form.get('membership');
				if (!this.membershipResults.length) {
					membershipControl?.reset();
					membershipControl?.disable();
				} else {
					membershipControl?.enable();
					const currentValue = membershipControl?.value;
					const exists = this.membershipResults.some((opt) => opt.value === currentValue);
					if (!exists) {
						membershipControl?.setValue(null);
					}
				}
			},
			error: (err) => {
				console.error('Error al buscar suscripciones:', err);
			}
		});
	}

	public checkEmailExists(): void {
		const email = this.presenter.form.get('email').value;
		if (email) {
			this.newPartnerService
				.checkEmail(email)
				.pipe(
					tap((response: any) => {
						if (response.result && response.data) {
							const gmailControl = this.presenter.form.get('email');
							gmailControl.setErrors({ emailExists: true });
						} else {
							const documentControl = this.presenter.form.get('email');
							documentControl.setErrors(null);
						}
					})
				)
				.subscribe();
		}
	}

	public isValid(val: any): boolean {
		return val !== null && val !== undefined && val !== '';
	}

	public checkDocumentExists(): void {
		const documentControl = this.presenter.form.get('nroDocument');
		const rawDocument = documentControl?.value;
		const documentNumber = rawDocument ? String(rawDocument).trim() : '';
		if (!documentNumber) return;
		const idDocumentType = this.presenter.form.get('idDocument')?.value;
		const idNationality = this.presenter.form.get('residenceCountryId')?.value;
		if (!idDocumentType || !idNationality) {
			this.presenter.form.get('idDocument')?.markAsTouched();
			this.presenter.form.get('residenceCountryId')?.markAsTouched();
			return;
		}

		if (idDocumentType === 2 && idNationality === 167) {
			if (isNaN(Number(documentNumber))) {
				documentControl?.setErrors({ onlyNumbers: true });
				return;
			}
			if (documentNumber.length !== 8) {
				documentControl?.setErrors({ DNI_PERU: true });
				return;
			}
		}

		this.isDocumentLoading = true;

		this.newPartnerService
			.checkDocument(documentNumber, idDocumentType, idNationality)
			.pipe(finalize(() => (this.isDocumentLoading = false)))
			.subscribe(
				(response: any) => {
					if (response.result && response.data) {
						documentControl?.setErrors({ documentExists: true });
						documentControl?.markAsDirty();
					} else {
						if (documentControl?.dirty) {
							documentControl.setErrors(null);
						}
					}
				},
				() => {
					documentControl?.setErrors({ error: true });
				}
			);
	}
}
