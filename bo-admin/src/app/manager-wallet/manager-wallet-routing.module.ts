import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
    {
        path: 'wallet',
        loadComponent: () => import('./pages').then((p) => p.WalletPageComponent),
        children: [
            { path: '', loadComponent: () => import('./pages').then((p) => p.WalletComponent) },
            { path: 'consilations', loadComponent: () => import('./pages').then((p) => p.ConsilationsComponent) }
        ]
    },
    {
        path: 'retiros',
        loadComponent: () => import('./pages').then((p) => p.RetirosPageComponent),
        children: [
            { path: 'bcp', loadComponent: () => import('./pages/retiros-page').then((p) => p.BcpWithdrawalsComponent) },
            // { path: 'interbank', loadComponent: () => import('./pages/retiros-page').then((p) => p.InterbankWithdrawalsComponent) }
        ]
    },
    {
        path: 'auditoria-de-modificaciones',
        loadComponent: () => import('./pages').then((p) => p.AuditRecordComponent)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageWalletRoutingModule { }