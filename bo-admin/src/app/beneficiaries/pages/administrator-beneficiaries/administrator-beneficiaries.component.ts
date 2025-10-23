import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { optRangosMock } from '@app/beneficiaries/pages/mocks/mocks';
import { FamilyPackageAdministratorService } from '@app/manage-business/services/FamilyPackageAdministratorService';
import { MembershipVersionAdministratorService } from '@app/manage-business/services/MembershipVersionAdministratorService';
import { PackageDetailRewardsService } from '@app/manage-business/services/package-detail-rewards.service';
import { PackageAdministratorService } from '@app/manage-business/services/PackageAdministratorService';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { combineLatest, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, finalize, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

type Row = {
  id: number;
  idPackage: number;
  portfolio: string;
  packageName: string;
  beneficiaries: number;
  rangeId: number | null;
  rangeText: string; 
};

@Component({
  selector: 'app-administrator-beneficiaries',
  templateUrl: './administrator-beneficiaries.component.html',
  styleUrls: ['./administrator-beneficiaries.component.scss']
})
export class AdministratorBeneficiariesComponent {
  @Input() familyPackageOptions: ISelectOpt[] = [];
  packageOptions: ISelectOpt[] = [];

  form!: FormGroup;
  loading = false;
  loadingPackages = false;

  private destroy$ = new Subject<void>();
  public versionOptions: ISelectOpt[] = [];
  optRangos: ISelectOpt[] = optRangosMock;
  rows: Row[] = [];

  constructor(private packageService: PackageAdministratorService,
    private packageDetailService: PackageDetailRewardsService,
    private familyPackageAdministratorService: FamilyPackageAdministratorService,
    private membershipVersionService: MembershipVersionAdministratorService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      family: [null],
      idPackage: [null],
      version: [null],
      rangos: [null]
    });

    this.familyPackageAdministratorService.getAllFamilyPackages().pipe(
      map((res: any) => (res?.data ?? res ?? []).map((f: any) => ({ id: String(f.idFamilyPackage), text: f.name }) as ISelectOpt)),
      catchError(() => of([] as ISelectOpt[])),
      takeUntil(this.destroy$)
    ).subscribe(opts => { this.familyPackageOptions = opts; this.cdr.detectChanges(); });

    this.form.get('family')!.valueChanges.pipe(
      map(v => this.normalizeId(v)),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(familyId => {
      this.versionOptions = [];
      this.packageOptions = [];
      this.rows = [];
      this.form.patchValue({ version: null, idPackage: null }, { emitEvent: false });
      if (!familyId) return;

      this.membershipVersionService.getAllMembershipVersionByFamilyPackage(familyId).pipe(
        map((res: any) => (res?.data ?? res ?? []).map((v: any) => ({ id: String(v.idMembershipVersion), text: v.description }) as ISelectOpt)),
        catchError(() => of([] as ISelectOpt[])),
        takeUntil(this.destroy$)
      ).subscribe(opts => { this.versionOptions = opts; this.cdr.detectChanges(); });

      this.packageService.getPackagesByIdFamilyPackage(familyId).pipe(
        map((res: any) => (res ?? []).map((p: any) => ({ id: String(p.idPackage), text: p.name }) as ISelectOpt)),
        catchError(() => of([] as ISelectOpt[])),
        takeUntil(this.destroy$)
      ).subscribe(opts => { this.packageOptions = opts; this.cdr.detectChanges(); });
    });

    const family$ = this.form.get('family')!.valueChanges.pipe(map(v => this.normalizeId(v)));
    const version$ = this.form.get('version')!.valueChanges.pipe(map(v => this.normalizeId(v)));
    const pkg$ = this.form.get('idPackage')!.valueChanges.pipe(map(v => this.normalizeId(v)));
    const range$ = this.form.get('rangos')!.valueChanges
      .pipe(map(v => this.normalizeId(v)), startWith(this.form.get('rangos')!.value));

    combineLatest([family$, version$, pkg$, range$]).pipe(
      filter(([family, version, idPackage]) => !!family && !!version && !!idPackage),
      distinctUntilChanged((a, b) => a.join('|') === b.join('|')),
      tap(() => { this.loading = true; this.rows = []; this.cdr.detectChanges(); }),

      switchMap(([family, version, idPackage, rangeId]) =>
        this.packageDetailService.listPackageDetailRewards(+family!, +version!).pipe(
          catchError(() => of([])),
          map((details: any[]) => {
            const portfolioName = this.getFamilyNameById(family!);
            const bounds = this.getRanges(rangeId);

            let filtered = details.filter(d =>
              String(d?.packageDetail?.idPackage ?? d?.packageSummary?.idPackage) === String(idPackage)
            );

            if (bounds) {
              filtered = filtered.filter(d => {
                const price = Number(d?.packageDetail?.price ?? d?.price ?? NaN);
                return !isNaN(price) && price >= bounds.min && price <= bounds.max;
              });
            }

            const selected = this.optRangos.find(o => o.id === String(rangeId));
            const rangeText = selected ? selected.text.split('(')[0].trim() : '-'; // “Básica / Intermedio / Top”


            return filtered.map(d => ({
              id: Number(d?.packageDetail?.idPackageDetail ?? d?.packageDetail?.id),
              idPackage: Number(d?.packageDetail?.idPackage),
              portfolio: portfolioName,
              packageName: d?.packageSummary?.packageName ?? d?.packageDetail?.packageName ?? '-',
              beneficiaries: Number(d?.packageDetail?.numberBeneficiaries ?? 0),
              rangeId: selected ? Number(selected.id) : null,  // ← nuevo
              rangeText                                      
            })) as Row[];
          })
        )
      )
    ).subscribe(rows => {
      this.rows = rows;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  private getFamilyNameById(id: string): string {
    const f = this.familyPackageOptions.find(o => o.id === String(id));
    return f?.text ?? '-';
  }

  ngOnDestroy(): void {
    this.destroy$.next(); this.destroy$.complete();
  }

  private normalizeId(v: any): string | null {
    if (v == null) return null;
    if (typeof v === 'number' || typeof v === 'string') return String(v);
    if (typeof v === 'object') {
      const inner = v.id ?? v.value ?? v?.target?.value;
      return inner != null ? String(inner) : null;
    }
    return null;
  }

  onSaveBeneficiaries({ id, value }: { id: number; value: number }) {
    this.loading = true; this.cdr.detectChanges();

    this.packageDetailService.getPackageDetailRewards(id).pipe(
      switchMap((resp: any) => {
        const detail = resp?.packageDetail ?? {};
        const rewards = resp?.rewardsDTO ?? {};


        const body = {
          packageDetail: {
            idPackage: Number(detail.idPackage),
            monthsDuration: Number(detail.monthsDuration),
            price: Number(detail.price),
            numberQuotas: Number(detail.numberQuotas),
            initialPrice: Number(detail.initialPrice),
            quotaPrice: Number(detail.quotaPrice),
            volume: Number(detail.volume),
            volumeByFee: Number(detail.volumeByFee),
            numberInitialQuote: Number(detail.numberInitialQuote),
            comission: Number(detail.comission),
            numberShares: Number(detail.numberShares),
            idFamilyPackage: Number(detail.idFamilyPackage),
            idMembershipVersion: Number(detail.idMembershipVersion),
            membershipMaintenance: Number(detail.membershipMaintenance ?? 0),
            numberBeneficiaries: Number(value),
            serie: detail.serie ?? null,
            membershipVersion: detail.membershipVersion ?? null,
            isSpecialFractional: !!detail.isSpecialFractional,
            isFamilyBonus: !!detail.isFamilyBonus,
            points: Number(detail.points ?? 0),
            installmentInterval: Number(detail.installmentInterval ?? 0),
            pointsToRelease: Number(detail.pointsToRelease ?? 0),
            canReleasePoints: !!detail.canReleasePoints
          },
          rewardsDTO: {
            totalRewardsToUse: Number(rewards.totalRewardsToUse ?? 0),
            extraRewards: Number(rewards.extraRewards ?? 0),
            timeInterval: String(rewards.timeInterval ?? ''),
            ownHotelTotalPercentage: Number(rewards.ownHotelTotalPercentage ?? 0),
            ownHotelWeekendPercentage: Number(rewards.ownHotelWeekendPercentage ?? 0),
            ownHotelWeekDayPercentage: Number(rewards.ownHotelWeekDayPercentage ?? 0),
            otherHotelTotalPercentage: Number(rewards.otherHotelTotalPercentage ?? 0),
            otherHotelWeekendPercentage: Number(rewards.otherHotelWeekendPercentage ?? 0),
            otherHotelWeekDayPercentage: Number(rewards.otherHotelWeekDayPercentage ?? 0)
          }
        };

        return this.packageDetailService.updatePackageDetailRewards(body, id);
      }),
      finalize(() => { this.loading = false; this.cdr.detectChanges(); })
    ).subscribe({
      next: () => {
        const row = this.rows.find(r => r.id === id);
        if (row) row.beneficiaries = Number(value);
        this.rows = [...this.rows];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al actualizar beneficiarios', err);
      }
    });
  }

  private getRanges(rangeId: string | null): { min: number; max: number } | null {
    switch (String(rangeId)) {
      case '1': return { min: 0, max: 7000 };   
      case '2': return { min: 8000, max: 16000 };   
      case '3': return { min: 17000, max: 50000 };   
      default: return null;                          
    }
  }


}
