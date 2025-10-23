import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { ModalDeleteUserComponent } from './components/modals/modal-delete-user/modal-delete-user.component';
import { ModifyDataUsersComponent } from './pages/modify-data-users/modify-data-users.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { EmalingComponent } from './pages/emaling/emaling.component';
import { EmailingRowComponent } from './components/tables/emailing-row/emailing-row.component';
import {
	EmailingModalComponent,
	FixDataModalComponent,
	ModalDeletePartnerRegisterComponent,
	ModalPartnersRegisteredComponent
} from './components/modals';
import { FixDataRowComponent } from './components/tables/fix-data-row/fix-data-row.component';
import { TablePartnersRegisteredComponent } from './components/tables/table-partners-registered/table-partners-registered.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { HistoricalPeriodsComponent } from './pages/historical-periods/historical-periods.component';
import { ListUserByIdComponent } from './pages/list-user-by-id/list-user-by-id.component';
import { TablePartnersByIdComponent } from './components/tables/table-partners-by-id/table-partners-by-id.component';
import { ModalPartnersByIdComponent } from './components/modals/modal-partners-by-id/modal-partners-by-id.component';
import { ListToolbarComponent } from '@app/event/components/shared/list-toolbar/list-toolbar.component';
import { TableSponsorshipListComponent } from './components/tables/table-sponsorship-list/table-sponsorship-list.component';
import { ModalDetailSponsorshipComponent } from './components/modals/modal-detail-sponsorship/modal-detail-sponsorship.component';
import { ModalSponsorshipRangoPersonalizadoComponent } from './components/modals/modal-sponsorship-rango-personalizado/modal-sponsorship-rango-personalizado.component';
import { SponsorshipListComponent } from './pages/sponsorship-list/sponsorship-list.component';
import { ChartModule } from 'primeng/chart';
import { TablePaginatorComponent } from "@shared/components/tables/table-paginator/table-paginator.component";
import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalFiltroRangoPersonalizadoComponent } from './components/modals/modal-filtro-rango-personalizado/modal-filtro-rango-personalizado.component';

@NgModule({
	declarations: [
		ModalDeleteUserComponent,
		ModifyDataUsersComponent,
		ListUsersComponent,
		EmalingComponent,
		EmailingRowComponent,
		EmailingModalComponent,
		FixDataRowComponent,
		FixDataModalComponent,
		TablePartnersRegisteredComponent,
		ModalPartnersRegisteredComponent,
		ModalDeletePartnerRegisterComponent,
		ListUserByIdComponent,
		TablePartnersByIdComponent,
		ModalPartnersByIdComponent,
		TableSponsorshipListComponent,
		ModalDetailSponsorshipComponent,
		ModalSponsorshipRangoPersonalizadoComponent,
  		SponsorshipListComponent,
    	ModalFiltroRangoPersonalizadoComponent,
	],
	imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    InlineSVGModule,
    ModalComponent,
    ModalConfirmationComponent,
    FormControlModule,
    HistoricalPeriodsComponent,
    ListToolbarComponent,
    ChartModule,
    TablePaginatorComponent
]
})
export class UsersModule {}
