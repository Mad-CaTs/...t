import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponManagerRoutingModule } from './coupon-manager-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    // Los componentes standalone no van en declarations
  ],
  imports: [
    CommonModule,
    CouponManagerRoutingModule,
    FormsModule,
  ]
})
export class CouponManagerModule {}
