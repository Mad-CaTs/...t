import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablePartnersComponent } from './components/table/table-partners/table-partners.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from '@shared/shared.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalDetailComponent } from './components/modals/modal-detail/modal-detail.component';
import { ModalEditStatusComponent } from './components/modals/modal-edit-status/modal-edit-status.component';
import { ModalEditScheduleComponent } from './components/modals/modal-edit-schedule/modal-edit-schedule.component';
import { ModalEditScheduleComissionComponent } from './components/modals/modal-edit-schedule-comission/modal-edit-schedule-commission.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ModalViewScheduleComponent } from './components/modals/modal-view-schedule/modal-view-schedule.component';

@NgModule({
	declarations: [
		TablePartnersComponent,
		ModalDetailComponent,
		ModalEditStatusComponent,
		ModalEditScheduleComponent,
		ModalEditScheduleComissionComponent,
		ModalViewScheduleComponent
	],
	imports: [
		CommonModule,
		ScheduleRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		InlineSVGModule,
		FormControlModule,
		FormsModule,
		ModalComponent,
		LoadingComponent
	],
	exports: [
		TablePartnersComponent,
		ModalDetailComponent,
		ModalEditStatusComponent,
		ModalEditScheduleComponent,
		ModalEditScheduleComissionComponent
	]
})
export class ScheduleModule {}
