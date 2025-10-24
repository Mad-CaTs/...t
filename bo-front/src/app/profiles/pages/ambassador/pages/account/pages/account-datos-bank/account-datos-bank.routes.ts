import { Routes } from "@angular/router";
import { AccountDatosBankComponent } from "./account-datos-bank.component";
import { AddDatosBankComponent } from "./pages/add-datos-bank/add-datos-bank.component";
import { DetailDatosBankComponent } from "./pages/detail-datos-bank/detail-datos-bank.component";
import { EditDatosBankComponent } from "./pages/edit-datos-bank/edit-datos-bank.component";

const routes: Routes = [

    {
        path: '',
        component: AccountDatosBankComponent
    },
    {
        path: 'add-datos-bank',
        component: AddDatosBankComponent
    },
    {
        path: 'detail-datos-bank',
        component: DetailDatosBankComponent
    },
    {
        path: 'edit-datos-bank',
        component: EditDatosBankComponent
    }
]
export default routes;
