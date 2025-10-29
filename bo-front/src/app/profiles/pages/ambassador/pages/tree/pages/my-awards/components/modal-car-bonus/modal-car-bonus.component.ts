import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICarBonus } from '../../interface/car-bonus';
import { getMedalImage } from '../../../history-range/commons/constants';
import { RouterTap } from '../enum/router-tap';
import { MyAwardsService } from '../service/my-awards.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { IRankBonusData } from '../../interface/classification';
import { LogoSpinnerComponent } from '@shared/logo-spinner/logo-spinner.component';
import { titleBonus } from '../../const/titleBonus';

@Component({
  selector: 'app-modal-car-bonus',
  standalone: true,
  imports: [CommonModule, LogoSpinnerComponent],
  templateUrl: './modal-car-bonus.component.html',
  styleUrl: './modal-car-bonus.component.scss'
})
export class ModalCarBonusComponent implements OnInit {
  @Input() cars?: IRankBonusData[] = [];
  @Input() footer: boolean = true;
  @Input() flagTextInfo: boolean = true;
  @Input() flagProgressBar: boolean = true;
  @Input() flagButtonPrefor: boolean = true;
  @Input() flagButtonSchedule: boolean = true;
  @Input() flagLink: boolean = true;
  public classification: IRankBonusData[] = [];
  condicion: boolean = true;

  constructor(
    private _myAwardsService: MyAwardsService,
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig<IRankBonusData[]>,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this._myAwardsService.getCarBonusList().subscribe(res => {
      this.cars = res.map((car, index) => {
        car.imagenCar = this.getImage(car.rankId);
        car.titleBonus = titleBonus[index] || '';
        car.requiredPoints = car.requiredPoints === 0 ? 'Próximamente' : car.requiredPoints;
        return car;
      }
      )
    });
  }


  getMedalImage(name: string): string {
    return getMedalImage(name);
  }

  getImage(id: number): string {
    const images: Record<number, string> = {
      6: 'assets/images/auto/car-1.svg',
      8: 'assets/images/auto/car-2.svg',
      14: 'assets/images/auto/car-3.svg',
      13: 'assets/images/auto/car-2.svg',
      16: 'assets/images/auto/car-1.svg',
    };

    return images[id] ?? '';
  }
  activetionTabCarBonus(car: IRankBonusData): void {
    if (this.flagLink && car.maxAchievedPoints > 0) {
      this._myAwardsService.setCarBonusList([car]);
      const router = car.maxAchievedPoints > 0 ? RouterTap.BONUS_CAR : '';
      this._myAwardsService.setRouterTap(router);
      this._myAwardsService.setCarAssinmentId(car.carAssignmentId);
      router != '' ? this.ref.close() : '';
    }
  }

  goToInitialSchedule(car: IRankBonusData): void {

    this._myAwardsService.setStatusSchedule('inicial');
    this._myAwardsService.setRouterTap(RouterTap.BONUS_CAR_SEE_SCHEDULE);
    this._myAwardsService.setCarAssinmentId(car.carAssignmentId);

    this.ref?.close();
    // this.router.navigate([
    //   '/profile/ambassador/my-awards/car-bonus/cronograma',
    //   1,
    //   'inicial',
    // ]);
  }

  goToGeneralSchedule(car: IRankBonusData): void {

    this._myAwardsService.setStatusSchedule('general');
    this._myAwardsService.setRouterTap(RouterTap.BONUS_CAR_SEE_SCHEDULE);
    this._myAwardsService.setCarAssinmentId(car.carAssignmentId);

    this.ref?.close();
    // this.router.navigate([
    //   '/profile/ambassador/my-awards/car-bonus/cronograma',
    //   1,
    //   'general',
    // ]);
  }

  goToProformas(car: IRankBonusData): void {
    this._myAwardsService.setRouterTap(RouterTap.BONUS_CAR_SEE_PROFORMA);
    this._myAwardsService.setCarBonus(car);
    this.ref?.close();
    // this._myAwardsService.setCarBonus(this.cars?.[0]);
    // this.router.navigate([
    //   '/profile/ambassador/my-awards',
    //   'car-bonus',
    //   'proforma',
    //   this.cars?.[0]?.classificationId
    // ]);
  }

  goToDocument(car: IRankBonusData) {
    this._myAwardsService.setCarBonusList([car]);
    this._myAwardsService.setRouterTap(RouterTap.BONUS_CAR_DOCUMENT);
    this.ref?.close();
  }

}
