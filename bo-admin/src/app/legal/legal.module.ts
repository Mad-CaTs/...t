import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { LegalRoutingModule } from './legal-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LegalRoutingModule,
  ],
  providers: [CurrencyPipe]
})
export class LegalModule { }
