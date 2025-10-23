import { optGenderMock } from './../../../pages/mocks/mocks';
import { ModalBeneficiaryPresenter } from './beneficiary-creation-modal.presenter';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalConfirmBeneficiaryComponent } from '@app/beneficiaries/components/modals/modal-confirm-beneficiary/modal-confirm-beneficiary.component';

import { BeneficiariesService } from '@app/beneficiaries/service/beneficiaries.service';
import { CountryService } from '@app/event/services/country.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-beneficiary-creation-modal',
  templateUrl: './beneficiary-creation-modal.component.html',
  styleUrls: ['./beneficiary-creation-modal.component.scss'],
  providers: [ModalBeneficiaryPresenter, DatePipe]
})
export class BeneficiaryCreationModalComponent {
  @Input() preselectedSubscriptionId: number | null = null;
  @Output() closed = new EventEmitter<boolean>();
  beneficiaryForm!: FormGroup;
  private destroy$ = new Subject<void>();
  membershipOptions: ISelectOpt[] = [];
  documentTypes: ISelectOpt[] = [];
  nationalitiesList: ISelectOpt[] = [];
  optGenders: ISelectOpt[] = optGenderMock;
  beneficiaryId?: number;
  isEdit = false;
  nextChangeDate: string = '';

  constructor(private beneficiaryService: BeneficiariesService, private ref: DynamicDialogRef,
    public config: DynamicDialogConfig, public modalBeneficiaryPresenter: ModalBeneficiaryPresenter, private datePipe: DatePipe,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.beneficiaryForm = this.modalBeneficiaryPresenter.beneficiaryForm;
    this.loadCountries();

    const userId = this.config.data?.userId ?? null;
    const selectedSid = this.config.data?.selectSubscriptionId ?? null;
    this.membershipOptions = (this.config.data?.membershipOptions || []) as ISelectOpt[];

    if (userId) this.beneficiaryForm.patchValue({ userId }, { emitEvent: false });
    if (selectedSid != null) this.beneficiaryForm.patchValue({ idSubscription: String(selectedSid) }, { emitEvent: false });

    this.beneficiaryId = Number(this.config.data?.beneficiaryId) || undefined;
    this.isEdit = !!this.beneficiaryId;

    if (this.isEdit) this.loadForEdit();

    this.beneficiaryForm.get('residenceCountryId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => this.getDocumentType(v));
    
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    this.nextChangeDate = this.datePipe.transform(d, 'dd/MM/yyyy') ?? '';
  }

  private loadForEdit(): void {
    this.beneficiaryService.findBeneficiaryById(this.beneficiaryId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        const d = data ?? {};

        this.beneficiaryForm.patchValue({
          userId: this.config.data?.userId ?? d.userId,
          idSubscription: String(d.idSubscription ?? this.config.data?.selectSubscriptionId ?? ''),
          name: d.name ?? '',
          lastName: d.lastName ?? '',
          gender: String(d.gender ?? ''),
          email: d.email ?? '',
          documentId: String(d.documentTypeId ?? ''),
          nroDocument: d.nroDocument ?? '',
          residenceCountryId: String(d.residenceCountryId ?? ''),
          ageDate: this.normalizeToDate(d.ageDate)
        }, { emitEvent: false });

        const prefillDocId = d.documentTypeId;
        this.getDocumentType({ idCountry: d.residenceCountryId }, prefillDocId);
      });
  }


  private loadCountries(): void {
    this.beneficiaryService.getCountriesList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((paises: any[]) => {
        this.nationalitiesList = (paises ?? []).map((p: any) => {
          const rawId = p.value ?? p.idCountry ?? p.id;
          return {
            id: String(rawId),
            text: p.content ?? p.nicename ?? p.name ?? '',
            value: Number(rawId),
            idCountry: Number(rawId)
          } as any;
        });
      });
  }


  private getCountryId(evt: any): number {
    const raw =
      evt?.idCountry ??
      evt?.value ??
      evt?.id ??
      evt?.target?.value ??
      this.beneficiaryForm.get('residenceCountryId')?.value;

    const n = Number(raw);
    return isNaN(n) ? 0 : n;
  }

  getDocumentType(evt: any, prefillDocId?: number) {
    const idCountry = this.getCountryId(evt);
    if (!idCountry) {
      this.documentTypes = [];
      this.beneficiaryForm.patchValue({ documentId: null }, { emitEvent: false });
      return;
    }

    this.beneficiaryService.getDocumentType(idCountry)
      .pipe(takeUntil(this.destroy$))
      .subscribe((types: any[]) => {
        this.documentTypes = (types ?? []).map(t => ({ id: String(t.value), text: t.content }));

        const wanted = String(prefillDocId ?? this.beneficiaryForm.get('documentId')?.value ?? '');
        const ok = !!wanted && this.documentTypes.some(d => d.id === wanted);

        this.beneficiaryForm.patchValue({ documentId: ok ? wanted : null }, { emitEvent: false });
      });
  }

  getNationalities() {
    this.beneficiaryService
      .getCountriesList()
      .pipe(
        takeUntil(this.destroy$),
        tap((paises) => (this.nationalitiesList = paises))
      )
      .subscribe();
  }

  save(): void {
    if (this.beneficiaryForm.invalid) {
      this.beneficiaryForm.markAllAsTouched();
      return;
    }

    const v = this.beneficiaryForm.value as any;
    const birth = this.normalizeToDate(v.ageDate);

    const payload = {
      userId: Number(v.userId),
      idSubscription: Number(v.idSubscription),
      name: v.name,
      lastName: v.lastName,
      gender: String(v.gender),
      email: v.email,
      documentTypeId: Number(v.documentId),
      nroDocument: v.nroDocument,
      residenceCountryId: Number(v.residenceCountryId),
      ageDate: this.toISODate(birth),
    };

    const req$ = this.isEdit
      ? this.beneficiaryService.updateBeneficiary(payload, this.beneficiaryId!)
      : this.beneficiaryService.saveBeneficiary(payload);

    req$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        const ref = this.dialogService.open(ModalConfirmBeneficiaryComponent, {
          header: '',
          closable: true,
          width: '520px',
          contentStyle: { background: '#fff', padding: '16px 16px 12px 16px', borderRadius: '16px' },
          data: {
            title: this.isEdit ? 'Edición exitosa' : 'Registro exitoso',
            text:  this.isEdit ? 'El beneficiario se actualizó correctamente.' :
                                 'El nuevo beneficiario fue guardado correctamente en el administrador.',
            icon: 'pi-check-circle'
          }
        });

        ref.onClose.subscribe(() => this.ref.close(true));
      },
      error: () => this.ref.close(false)
    });
  }

  close(result?: any) { this.ref.close(result ?? false); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get ageDisplay(): string {
    const raw = this.beneficiaryForm.get('ageDate')?.value;
    const birth = this.normalizeToDate(raw);
    if (!birth) return '';
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return Math.max(age, 0).toString();
  }

  private normalizeToDate(val: any): Date | null {
    if (!val) return null;

    if (val instanceof Date) return isNaN(val.getTime()) ? null : val;

    if (typeof val === 'string') {
      const s = val.trim();
      let m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
      if (m) {
        const d = new Date(+m[3], +m[2] - 1, +m[1]);
        return isNaN(d.getTime()) ? null : d;
      }

      m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
      if (m) {
        const d = new Date(+m[1], +m[2] - 1, +m[3]);
        return isNaN(d.getTime()) ? null : d;
      }

      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }

    if (val?.day != null && val?.month != null && val?.year != null) {
      const d = new Date(val.year, val.month - 1, val.day);
      return isNaN(d.getTime()) ? null : d;
    }
    if (val?.jsDate instanceof Date) return isNaN(val.jsDate.getTime()) ? null : val.jsDate;
    if (val?.date instanceof Date) return isNaN(val.date.getTime()) ? null : val.date;

    return null;
  }

  private toISODate(d: Date | null): string | null {
    return d ? this.datePipe.transform(d, 'yyyy-MM-dd') : null;
  }

}
