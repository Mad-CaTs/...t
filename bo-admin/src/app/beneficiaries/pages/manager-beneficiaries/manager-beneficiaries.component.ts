import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BeneficiaryCreationModalComponent } from '@app/beneficiaries/components/modals/beneficiary-creation-modal/beneficiary-creation-modal.component';
import { ModalConfirmBeneficiaryComponent } from '@app/beneficiaries/components/modals/modal-confirm-beneficiary/modal-confirm-beneficiary.component';
import { BeneficiariesService } from '@app/beneficiaries/service/beneficiaries.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';



@Component({
  selector: 'app-manager-beneficiaries',
  templateUrl: './manager-beneficiaries.component.html',
  styleUrls: ['./manager-beneficiaries.component.scss']
})
export class ManagerBeneficiariesComponent implements OnInit, OnDestroy {

  form: FormGroup;
  totalRecords: number = 0;
  beneficiaries: any[] = [];
  userInfo: any; private idUser!: number;
  private destroy$ = new Subject<void>();
  loading = false;

  total = 0;
  page = 1;
  size = 10;
  buttonLoading: boolean = false;
  suggestions: any[] = [];
  showSuggestions = false;
  selectedUser: any | null = null;
  currentUserId: number | null = null;
  memberships: Array<{ value: number; label: string }> = [];
  optMemberships: ISelectOpt[] = [{ id: '-1', text: 'Selecciona' }];
  public subscriptionId = 0;
  dialogRef?: DynamicDialogRef;



  constructor(private fb: FormBuilder, private beneficiariesService: BeneficiariesService,
    private cdr: ChangeDetectorRef, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      search: [''],
      typeUser: ['1'],
      membresias: ['-1']
    });
    this.form.get('membresias')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => this.onMembershipModelChange(v));
  }

  onSearch() {
    this.buttonLoading = true;
    const username = (this.form.get('search')?.value || '').trim();
    const typeUser = this.form.get('typeUser')?.value || 'USER';

    if (!username) {
      this.resetUserSelection();
      return;
    }

    this.buttonLoading = true;

    this.beneficiariesService.getUsersByFilter(username, typeUser).subscribe({
      next: (resp: any) => {
        const list = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
        this.suggestions = list;


        if (list.length === 1) {
          this.selectUser(list[0]);
          this.showSuggestions = false;
        } else {
          this.showSuggestions = list.length > 0;
        }
      },
      error: () => {
        this.suggestions = [];
        this.showSuggestions = false;
      },
      complete: () => {
        this.buttonLoading = false;
        this.cdr.detectChanges();
      }
    })
  }

  ngOnDestroy(): void {
    this.dialogRef?.close();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(uiPage: number, size: number, userId: number): void {
    this.loading = true;
    const offset = (uiPage - 1) * size;

    this.beneficiariesService.getBeneficiariesByUserId(userId, offset, size)
      .subscribe({
        next: (result: any) => {
          const list = result?.data ?? result ?? [];
          const mapped = list.map((b: any, idx: number) => ({
            id: b.idBeneficiary ?? b.id,
            name: b.name,
            lastName: b.lastName,
            nroDocument: b.nroDocument,
            email: b.email,
            ageDate: b.ageDate,
            creationDate: b.creationDate,
            expirationDate: b.expirationDate,
            subscriptionId: Number(b.idSubscription ?? b.subscriptionId ?? b.suscriptionId ?? b.subscription?.id ?? 0),
            idx: offset + idx + 1
          }));

          this.beneficiaries = mapped;
          this.totalRecords = Number(result?.total ?? mapped.length);
          this.page = uiPage;
          this.size = size;
        },
        error: () => {
          this.beneficiaries = [];
          this.totalRecords = 0;
        },
        complete: () => {
          this.loading = false;
          Promise.resolve().then(() => this.cdr.detectChanges());
        }
      });
  }

  onMembershipChange(event: Event): void {
    const value = (event?.target as HTMLSelectElement)?.value ?? '-1';
    if (value && value !== '-1') {
      this.subscriptionId = +value;
      this.loadBySubscription(this.subscriptionId);
    } else if (this.currentUserId) {
      this.subscriptionId = 0;
      this.loadData(1, this.size, this.currentUserId);
    }
  }

  onMembershipModelChange(val: any): void {
    const raw = this.normalizeOptionId(val ?? this.form.get('membresias')?.value);


    if (!raw || raw === '-1' || raw === 'ALL' || !/^\d+$/.test(raw)) {
      this.subscriptionId = 0;
      if (this.currentUserId) this.loadData(1, this.size, this.currentUserId);
      return;
    }

    this.subscriptionId = +raw;
    this.loadBySubscription(this.subscriptionId);
  }

  private loadBySubscription(id: number): void {
    this.loading = true;
    this.beneficiariesService.getBeneFiciariesBySubscriptionId(id)
      .subscribe({
        next: (result: any) => {
          const raw = result?.data ?? result ?? [];
          const onlyThisSub = raw.filter((b: any) =>
            Number(b?.idSubscription ?? b?.subscriptionId ?? b?.suscriptionId ?? b?.subscription?.id ?? 0) === id
          );

          const mapped = onlyThisSub.map((b: any, idx: number) => ({
            id: b.idBeneficiary ?? b.id,
            name: b.name,
            lastName: b.lastName,
            nroDocument: b.nroDocument,
            email: b.email,
            ageDate: b.ageDate,
            creationDate: b.creationDate,
            expirationDate: b.expirationDate,
            subscriptionId: Number(b.idSubscription ?? b.subscriptionId ?? b.suscriptionId ?? b.subscription?.id ?? 0),
            idx: idx + 1
          }));

          this.beneficiaries = mapped;
          this.totalRecords = mapped.length;
          this.page = 1;
        },
        error: () => {
          this.beneficiaries = [];
          this.totalRecords = 0;
        },
        complete: () => {
          this.loading = false;
          Promise.resolve().then(() => this.cdr.detectChanges());
        }
      });
  }

  onPageChange(event: any): void {
    const uiPage = Number(event?.page ?? 0) + 1;
    const rows = event?.rows ?? 10;

    if (this.subscriptionId > 0) {
      this.loadBySubscription(this.subscriptionId);
    } else if (this.currentUserId) {
      this.loadData(uiPage, rows, this.currentUserId);
    }
  }

  onRefresh(event: any): void {
    const rows = Number(event?.rows ?? 10);

    if (this.subscriptionId > 0) {
      this.loadBySubscription(this.subscriptionId);
    } else if (this.currentUserId) {
      this.loadData(1, rows, this.currentUserId);
    }
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.currentUserId = Number(user?.idUser ?? user?.id ?? user?.userId);
    this.showSuggestions = false;

    this.subscriptionId = 0;
    this.form.get('membresias')?.setValue('-1', { emitEvent: false });

    this.loadUserMemberships(this.currentUserId!);

    this.loadData(1, this.size, this.currentUserId!);
  }

  private loadUserMemberships(userId: number): void {
    this.beneficiariesService.getMembershipsBySubscriptionId(userId).subscribe({
      next: (resp: any) => {
        const list: any[] = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];

        const seen = new Set<string>();
        const opts: ISelectOpt[] = [];

        for (const item of list) {
          const subId = Number(item?.id ?? item?.idSubscription ?? item?.subscriptionId ?? 0);
          if (!subId) continue;

          const label =
            item?.nameSuscription ??
            item?.membershipName ??
            item?.name ??
            '';

          const idStr = String(subId);
          if (seen.has(idStr)) continue;
          seen.add(idStr);

          opts.push({ id: idStr, text: label });
        }

        this.optMemberships = [{ id: '-1', text: 'Selecciona' }, ...opts];
        this.form.get('membresias')?.setValue('-1', { emitEvent: false });
        this.cdr.detectChanges();
      },
      error: () => {
        this.optMemberships = [{ id: '-1', text: 'Selecciona' }];
        this.cdr.detectChanges();
      }
    });
  }

  resetUserSelection(): void {
    this.selectedUser = null;
    this.currentUserId = null;
    this.suggestions = [];
    this.showSuggestions = false;
    this.beneficiaries = [];
    this.totalRecords = 0;
    this.cdr.detectChanges();
  }



  private normalizeOptionId(v: any): string | null {
    if (v == null) return null;
    if (typeof v === 'number') return String(v);
    if (typeof v === 'string') return v.trim();

    if (typeof v === 'object') {
      const inner = (v as any).id ?? (v as any).value ?? (v as any)?.target?.value ?? null;
      return this.normalizeOptionId(inner);
    }
    return null;
  }

  openCreateBeneficiary(): void {
    if (!this.currentUserId) return;

    const membershipOptions = (this.optMemberships || [])
      .filter(o => o.id !== '-1');

    this.dialogRef = this.dialogService.open(BeneficiaryCreationModalComponent, {
      header: '',
      closable: false,
      width: '750px',
      styleClass: 'beneficiary-dd',
      contentStyle: { background: '#fff', padding: '16px 16px 12px 16px', borderRadius: '16px' },
      data: {
        userId: this.currentUserId,
        selectSubscriptionId: this.subscriptionId > 0 ? this.subscriptionId : null,
        membershipOptions
      }
    });

    this.dialogRef.onClose.pipe(take(1)).subscribe((ok) => {
      if (ok === true && this.currentUserId) {
        if (this.subscriptionId > 0) {
          this.loadBySubscription(this.subscriptionId);
        } else {
          this.loadData(1, this.size, this.currentUserId);
        }
        this.loadUserMemberships(this.currentUserId);
      }
    });
  }

  onEdit(row: any) {
    if (!this.currentUserId) return;

    const membershipOptions = (this.optMemberships || []).filter(o => o.id !== '-1');

    this.dialogRef = this.dialogService.open(BeneficiaryCreationModalComponent, {
      header: '',
      closable: false,
      width: '750px',
      styleClass: 'beneficiary-dd',
      contentStyle: { background: '#fff', padding: '16px 16px 12px 16px', borderRadius: '16px' },
      modal: true,
      dismissableMask: true,
      baseZIndex: 10000,
      data: {
        userId: this.currentUserId,
        selectSubscriptionId: row.subscriptionId ?? null,
        membershipOptions,
        beneficiaryId: row.id
      }
    });

    this.dialogRef.onClose.pipe(take(1)).subscribe((ok) => {
      if (ok === true) {
        if (this.subscriptionId > 0) this.loadBySubscription(this.subscriptionId);
        else if (this.currentUserId) this.loadData(1, this.size, this.currentUserId);
      }
    });
  }


  onRemove(row: any) {
    if (!row?.id) return;

    const askRef = this.dialogService.open(ModalConfirmBeneficiaryComponent, {
      header: '',
      closable: true,
      width: '460px',
      styleClass: 'beneficiary-dd',
      contentStyle: { background: '#fff', padding: '16px 16px 12px 16px', borderRadius: '16px' },
      modal: true,
      dismissableMask: true,
      baseZIndex: 10000,
      data: {
        title: 'Eliminar beneficiario',
        text: '¿Estás seguro de eliminar este beneficiario? Esta acción no se puede deshacer.',
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar'
      }
    });

    askRef.onClose.subscribe((res: any) => {
      if (!res?.confirmed) return;

      this.beneficiariesService.deleteBeneficiary(row.id).subscribe({
        next: () => {
          if (this.subscriptionId > 0) this.loadBySubscription(this.subscriptionId);
          else if (this.currentUserId) this.loadData(1, this.size, this.currentUserId);

          const okRef = this.dialogService.open(ModalConfirmBeneficiaryComponent, {
            header: '',
            width: '520px',
            contentStyle: { background: '#fff', padding: '16px 16px 12px 16px', borderRadius: '16px' },
            data: {
              title: 'Eliminado',
              text: 'El beneficiario se eliminó correctamente.',
              icon: 'pi-check-circle'
            }
          });
          okRef.onClose.subscribe(() => { });
        },
        error: () => {
        }
      });
    });
  }


}
