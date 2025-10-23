import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChecksRoutingModule } from './checks-routing.module';
import { CheckComponent } from './pages/check/check.component';
import { AwardCardComponent } from './components/award-card/award-card.component';

@NgModule({
	declarations: [],
	imports: [CommonModule, ChecksRoutingModule]
})
export class ChecksModule {}
