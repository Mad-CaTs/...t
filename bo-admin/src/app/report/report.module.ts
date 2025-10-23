import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { AffiliateChartComponent } from './pages/membership-affiliates/affiliate-chart/affiliate-chart.component';

@NgModule({
	 declarations: [
		
	 
  ],
	  imports: [
		CommonModule,
		ReportRoutingModule,
	  ],
	  providers: [CurrencyPipe]
})
export class ReportModule {}