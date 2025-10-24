import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ModalCarBonusComponent } from '../modal-car-bonus/modal-car-bonus.component';
import { ICarBonus } from '../../interface/car-bonus';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MyAwardsService } from '../service/my-awards.service';
import { IBonusOption, IRankBonusData } from '../../interface/classification';

@Component({
  selector: 'app-option-earn-car-bonus',
  standalone: true,
  providers: [DynamicDialogRef, DynamicDialogConfig ],
  imports: [
    BreadcrumbComponent,
    ModalCarBonusComponent,
    MatExpansionModule, 
    MatProgressBarModule, 
    CommonModule],
  templateUrl: './option-earn-car-bonus.component.html',
  styleUrl: './option-earn-car-bonus.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class OptionEarnCarBonusComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  breadcrumbItems: BreadcrumbItem[] = [];
  options: IBonusOption[] = [];
  constructor(private _myAwardsService: MyAwardsService){

  }

  car: IRankBonusData[] = [];

  ngOnInit(): void {
    this.initBreadcrumb();
    this.getData();
    this.car = [this._myAwardsService.getCarBonus];
  }

  	public initBreadcrumb(): void {
		this.breadcrumbItems = [
			{
				label: 'Mis premios',
				action: () => this._myAwardsService.setRouterTap('')
			},
			{
				label: 'Bono de auto',
				action: () => {}
			}
		];
	}

  getData(){
  this.options =  this._myAwardsService.carBonusList[0 ].options.map((option: IBonusOption, index) => {
     option.title = 'Opción'  + ' ' + (index + 1);
      return option;
    });
  }

  ngOnDestroy(): void {
    this._myAwardsService.completeCarBonusList();
  }
}
