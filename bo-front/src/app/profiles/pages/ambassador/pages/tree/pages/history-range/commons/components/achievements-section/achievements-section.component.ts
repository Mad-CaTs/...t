import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PartnerBonusApiService } from '../../../commons/services/partner-bonus.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { Subscription } from 'rxjs';
import type { IResponseData } from '@shared/interfaces/api-request';
import type { PartnerBonus } from '../../../commons/interfaces/partner-bonus.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';

@Component({
  selector: 'app-achievements-section',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './achievements-section.component.html',
  styleUrl: './achievements-section.component.scss',
  providers: [DialogService]
})
export class AchievementsSectionComponent {
  @Input() status: string = '';
  @Input() rank: string = '';
  @Input() description: string = '';
  @Input() mediana: number | null = null;
  @Input() buttonDisabled: boolean = false;
  @Input() medalImage: string = '';
  @Input() name: string = '';
  @Input() enabledText: string = '';
  @Input() rangeCount: number | null = null;

  @Output() viewPrize = new EventEmitter<void>();

  private subscription: Subscription = new Subscription();

  constructor(
    private partnerBonusApiService: PartnerBonusApiService,
    private userInfoService: UserInfoService,
    private dialogService: DialogService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onViewPrize() {
    this.subscription.add(
      this.partnerBonusApiService.fetchGetByFullName(this.userInfoService.userInfo.headerName).subscribe({
        next: (response: IResponseData<PartnerBonus[]>) => {
          const bonus = response.data && response.data.length > 0 ? response.data[0] : null;
          const range = bonus?.range?.trim().toLowerCase();
          const name = this.name?.trim().toLowerCase();
          if (range && name && range === name) {
            this.viewPrize.emit();
          } else {
            this.dialogService.open(ModalAlertComponent, {
              header: 'Información',
              data: {
                message: 'Aún no tienes un bono asignado.',
                title: 'Sin Bono Asignado',
                icon: 'pi pi-info-circle'
              },
              styleClass: 'custom-alert-modal'
            });
          }
        },
        error: (error) => {
          console.error('Error fetching PartnerBonus data:', error);
          this.dialogService.open(ModalAlertComponent, {
            header: 'Error',
            data: {
              message: 'Error al obtener los datos del bono. Por favor, intenta de nuevo.',
              title: 'Error',
              icon: 'pi pi-exclamation-triangle'
            },
            styleClass: 'custom-alert-modal'
          });
        }
      })
    );
  }
}
