import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BeneficiariesRoutingModule } from "./beneficiaries-routing.module";
import { ManagerBeneficiariesComponent } from './pages/manager-beneficiaries/manager-beneficiaries.component';
import { FormControlModule } from "@shared/components/form-control/form-control.module";
import { AdministratorBeneficiariesComponent } from "@app/beneficiaries/pages";
import { SharedModule } from "@shared/shared.module";
import { TableManagerBeneficiariesComponent } from './components/tables/table-manager-beneficiaries/table-manager-beneficiaries.component';
import { TableAdministratorBeneficiariesComponent } from './components/tables/table-administrator-beneficiaries/table-administrator-beneficiaries.component';
import { TablePaginatorComponent } from "@shared/components/tables/table-paginator/table-paginator.component";
import { ListToolbarComponent } from "@app/event/components/shared/list-toolbar/list-toolbar.component";
import { BeneficiaryCreationModalComponent } from './components/modals/beneficiary-creation-modal/beneficiary-creation-modal.component';
import { ModalConfirmBeneficiaryComponent } from './components/modals/modal-confirm-beneficiary/modal-confirm-beneficiary.component';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { ModalConfirmDeleteComponent } from './components/modals/modal-confirm-delete/modal-confirm-delete.component';



@NgModule({
    declarations: [
    TableManagerBeneficiariesComponent,
    TableAdministratorBeneficiariesComponent,
    ManagerBeneficiariesComponent,
    BeneficiaryCreationModalComponent,
    ModalConfirmBeneficiaryComponent,
    ModalConfirmDeleteComponent,
    AdministratorBeneficiariesComponent
    
  ],
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BeneficiariesRoutingModule,
    SharedModule,
    FormControlModule,
    TablePaginatorComponent,
    ListToolbarComponent,
    DynamicDialogModule,
]
})

export class BeneficiariesModule {}