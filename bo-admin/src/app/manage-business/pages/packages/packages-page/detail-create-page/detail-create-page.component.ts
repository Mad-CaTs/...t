// detail-create-page.component.ts
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

import { ISelectOpt } from '@interfaces/form-control.interface';
import { ITablePackagePackage } from '@interfaces/manage-business.interface';

import { ToastService } from '@app/core/services/toast.service';
import { PackageAdministratorService } from '@app/manage-business/services/PackageAdministratorService';
import { PackageDetailRewardsService } from '@app/manage-business/services/package-detail-rewards.service';
import { MembershipVersionAdministratorService } from '@app/manage-business/services/MembershipVersionAdministratorService';

@Component({
  selector: 'app-detail-create-page',
  templateUrl: './detail-create-page.component.html',
  standalone: true,
  imports: [FormControlModule, CommonModule, ReactiveFormsModule],
  styleUrls: ['./detail-create-page.component.scss']
})
export class DetailCreatePageComponent implements OnInit {
  @Input() packageBasicData!: ITablePackagePackage;
  @Input() familyPackageOptions: ISelectOpt[] = [];
  @Output() closeChange = new EventEmitter<boolean>();

  public form: FormGroup;
  public loading: boolean = false;
  public packageOptions: ISelectOpt[] = [];

  constructor(
    private builder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modalManager: NgbModal,
    private toastManager: ToastService,
    private packageService: PackageAdministratorService,
    private packageDetailService: PackageDetailRewardsService,
    private membershipVersionService: MembershipVersionAdministratorService
  ) {
    this.generateForm();
  }

  ngOnInit(): void {
    if (this.packageBasicData) {
      this.form.get('idFamilyPackage')?.setValue(this.packageBasicData.id.toString());
      this.form.get('idFamilyPackage')?.disable();

      this.packageOptions = [
        {
          id: 'pending',
          text: this.packageBasicData.name
        }
      ];

      this.form.get('idPackage')?.setValue('pending');
      this.form.get('idPackage')?.disable();

      this.loadMembershipVersion();
    }

    this.cdr.detectChanges();
  }

  private loadMembershipVersion(): void {
    const familyId = this.packageBasicData.id.toString();

    this.membershipVersionService
      .getActiveMembershipVersionByFamilyPackage(familyId)
      .subscribe({
        next: (data) => {
          if (data) {
            this.form.get('idMembershipVersion')?.setValue(data.idMembershipVersion);
            this.form.get('idMembershipVersion')?.disable();
            this.cdr.detectChanges();
          } else {
            console.error('No se encontró la última versión de membresía');
          }
        },
        error: (error) => {
          console.error('Error al obtener la última versión de membresía:', error);
        }
      });
  }

  generateForm() {
    this.form = this.builder.group({
      idFamilyPackage: [{ value: '', disabled: true }, [Validators.required]],
      idPackage: [{ value: '', disabled: true }, [Validators.required]],
      idMembershipVersion: [{ value: null, disabled: true }, [Validators.required]],
      
      monthsDuration: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(0)]],
      numberQuotas: [null, [Validators.required, Validators.min(0)]],
      initialPrice: [null, [Validators.required, Validators.min(0)]],
      quotaPrice: [null, [Validators.required, Validators.min(0)]],
      volume: [null, [Validators.required, Validators.min(0)]],
      volumeByFee: [null, [Validators.required, Validators.min(0)]],
      numberInitialQuote: [null, [Validators.required, Validators.min(0)]],
      comission: [null, [Validators.required, Validators.min(0)]],
      numberShares: [null, [Validators.required, Validators.min(1)]],

      totalRewardsToUse: [0, [Validators.required, Validators.min(0)]],
      timeInterval: [0, [Validators.required]],
      extraRewards: [0, [Validators.required, Validators.min(0)]],
      ownHotelTotalPercentage: [null, [Validators.required, this.greaterThanZero, Validators.max(100)]],
      ownHotelWeekendPercentage: [null, [Validators.required, this.greaterThanZero, Validators.max(100)]],
      ownHotelWeekDayPercentage: [null, [Validators.required, this.greaterThanZero, Validators.max(100)]],
      otherHotelTotalPercentage: [null, [Validators.required, this.greaterThanZero, Validators.max(100)]],
      otherHotelWeekendPercentage: [null, [Validators.required, this.greaterThanZero, Validators.max(100)]],
      otherHotelWeekDayPercentage: [null, [Validators.required, this.greaterThanZero, Validators.max(100)]]
    });
  }

  greaterThanZero(control: AbstractControl) {
    return control.value > 0 ? null : { greaterThanZero: true };
  }

  public onSubmit() {
    const raw = this.form.getRawValue();

    if (this.form.invalid) {
      this.toastManager.addToast('Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }

    if (
      Number(raw.otherHotelWeekDayPercentage) + Number(raw.otherHotelWeekendPercentage) !== 100
    ) {
      this.toastManager.addToast(
        'La suma de % Fines de semana y % Días de semana del hotel asociado debe ser igual a 100.',
        'warning'
      );
      return;
    }

    if (
      Number(raw.ownHotelWeekendPercentage) + Number(raw.ownHotelWeekDayPercentage) !== 100
    ) {
      this.toastManager.addToast(
        'La suma de % Fines de semana y % Días de semana del hotel propio debe ser igual a 100.',
        'warning'
      );
      return;
    }

    this.loading = true;

    const packageData = {
      idFamilyPackage: Number(this.packageBasicData.id),
      name: this.packageBasicData.name,
      codeMembership: this.packageBasicData.code,
      description: this.packageBasicData.description,
      status: this.packageBasicData.status ? 1 : 0
    };

    this.packageService.createPackage(packageData).pipe(
      switchMap(({ data }: any) => {
        const packageDetailBody = {
          packageDetail: {
            idPackage: data.idPackage,
            monthsDuration: Number(raw.monthsDuration),
            price: Number(raw.price),
            numberQuotas: Number(raw.numberQuotas),
            initialPrice: Number(raw.initialPrice),
            quotaPrice: Number(raw.quotaPrice),
            volume: Number(raw.volume),
            volumeByFee: Number(raw.volumeByFee),
            points: Number(raw.totalRewardsToUse),
            installmentInterval: Number(raw.timeInterval),
            pointsToRelease: Number(raw.extraRewards),
            canReleasePoints: true,
            numberInitialQuote: Number(raw.numberInitialQuote),
            comission: Number(raw.comission),
            numberShares: Number(raw.numberShares),
            idFamilyPackage: Number(raw.idFamilyPackage),
            idMembershipVersion: Number(raw.idMembershipVersion),
            membershipMaintenance: 0,
            numberBeneficiaries: 0,
            serie: null,
            membershipVersion: null,
            isSpecialFractional: false,
            isFamilyBonus: false
          },
          rewardsDTO: {
            totalRewardsToUse: Number(raw.totalRewardsToUse),
            extraRewards: Number(raw.extraRewards),
            timeInterval: String(raw.timeInterval),
            ownHotelTotalPercentage: Number(raw.ownHotelTotalPercentage),
            ownHotelWeekendPercentage: Number(raw.ownHotelWeekendPercentage),
            ownHotelWeekDayPercentage: Number(raw.ownHotelWeekDayPercentage),
            otherHotelTotalPercentage: Number(raw.otherHotelTotalPercentage),
            otherHotelWeekendPercentage: Number(raw.otherHotelWeekendPercentage),
            otherHotelWeekDayPercentage: Number(raw.otherHotelWeekDayPercentage)
          }
        };

        return this.packageDetailService.createPackageDetailRewards(packageDetailBody);
      })
    ).subscribe({
      next: (response) => {
        this.loading = false;

        const ref = this.modalManager.open(ModalConfirmationComponent, {
          centered: true,
          size: 'md'
        });
        const modal = ref.componentInstance as ModalConfirmationComponent;

        modal.body = `Paquete "${this.packageBasicData.name}" creado exitosamente con todos sus detalles.`;
        modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
        modal.title = 'Éxito';

        this.closeDetail(true);
      },
      error: (error) => {
        this.loading = false;
        
        if (error.status === 409) {
          this.toastManager.addToast(
            'Ya existe un Detalle con ese Paquete y Versión',
            'warning'
          );
        } else {
          console.error('Error al crear paquete completo:', error);
          this.toastManager.addToast(
            'Ocurrió un error al crear el paquete completo. Por favor, intente nuevamente.',
            'error'
          );
        }
      }
    });
  }

  closeDetail(success: boolean = false) {
    this.closeChange.emit(success);
  }

  public onCancel() {
    const confirmCancel = confirm(
      '¿Está seguro que desea cancelar? No se guardará ningún dato.'
    );
    if (confirmCancel) {
      this.closeDetail(false);
    }
  }
}