import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CommissionManagerRoutingModule } from './commission-manager-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
	declarations: [],
	imports: [CommonModule, SharedModule, CommissionManagerRoutingModule],
	providers: [CurrencyPipe]
})
export class CommissionManagerModule {}
