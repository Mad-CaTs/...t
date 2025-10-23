import { ManagerBeneficiariesComponent } from './pages/manager-beneficiaries/manager-beneficiaries.component';

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdministratorBeneficiariesComponent } from '@app/beneficiaries/pages';
import { DialogService } from 'primeng/dynamicdialog';


const routes: Routes = [
    { path: 'manager-beneficiaries', component: ManagerBeneficiariesComponent},
    { path: 'administrator-beneficiaries', component: AdministratorBeneficiariesComponent}
    
] 

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [DialogService]
})
export class BeneficiariesRoutingModule{

}