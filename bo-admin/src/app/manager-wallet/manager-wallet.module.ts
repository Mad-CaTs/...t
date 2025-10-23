import { CommonModule, CurrencyPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@shared/shared.module";
import { ManageWalletRoutingModule } from "./manager-wallet-routing.module";
import { InlineSVGModule } from "ng-inline-svg-2";
import { ModalComponent } from "@shared/components/modal/modal.component";
import { FormControlModule } from "@shared/components/form-control/form-control.module";
import { ModalsDetalleRetiroComponent } from './components/modals/modals-detalle-retiro/modals-detalle-retiro.component';
import { ModalsRegistroExitosoComponent } from './components/modals/modals-registro-exitoso/modals-registro-exitoso.component';
import { ModalsSolicitudRetiroComponent } from './components/modals/modals-solicitud-retiro/modals-solicitud-retiro.component';
import { ModalRechazarSolicitudComponent } from './components/modals/modal-rechazar-solicitud/modal-rechazar-solicitud.component';
import { ModalRetiroRechazarComponent } from './components/modals/modal-retiro-rechazar/modal-retiro-rechazar.component';
import { BanckWithdrawalsComponent } from './components/banck-withdrawals/banck-withdrawals.component';
import { BcpWithdrawalsComponent } from './pages/retiros-page/bcp-withdrawals/bcp-withdrawals.component';
import { InterbankWithdrawalsComponent } from './pages/retiros-page/interbank-withdrawals/interbank-withdrawals.component';
import { ModalLoadingValidatorComponent } from './components/modals/modal-loading-validator/modal-loading-validator.component';
import { LoadingComponent } from "@shared/components/loading/loading.component";
import { ModalsBulkNotificationComponent } from './components/modals/modals-bulk-notification/modals-bulk-notification.component';
import { ModalsBulkSuccesComponent } from './components/modals/modals-bulk-succes/modals-bulk-succes.component';
import { AuditRecordComponent } from './pages/retiros-page/audit-record/audit-record.component';
import { TabViewModule } from 'primeng/tabview';
import { BankResponseTableComponent } from './components/tables/bank-response-table/bank-response-table.component';
import { InputFileOfWithdrawalComponent } from "./components/input-file/input-file.component";
import { EmptyStateComponent } from "@app/event/components/shared/empty-state/empty-state.component";
import { ModalsDownloadSuccessComponent } from './components/modals/modals-download-success/modals-download-success.component';
import { ModalsImportSuccessComponent } from './components/modals/modals-import-success/modals-import-success.component';

@NgModule({
  imports: [
    CommonModule,
    ManageWalletRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    InlineSVGModule,
    ModalComponent,
    FormControlModule,
    LoadingComponent,
    TabViewModule,
    InputFileOfWithdrawalComponent,
    EmptyStateComponent
],
  providers: [CurrencyPipe],
  declarations: [
    ModalsBulkSuccesComponent,
    ModalsDownloadSuccessComponent,
    ModalsImportSuccessComponent
  ]
})
export class ManagerWalletModule {

}