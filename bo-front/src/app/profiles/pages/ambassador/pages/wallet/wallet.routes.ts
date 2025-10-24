import { AffiliateAutomaticPaymentComponent } from './pages/automatic-payment/affiliate-automatic-payment/affiliate-automatic-payment.component';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { WalletComponent } from './wallet.component';
const routes: Routes = [
    {
        path: '',
        component: WalletComponent,
        title: 'Wallet'
    },
    {
        path: 'transferir',
        loadChildren: () =>
            import('./pages/wallet-transaction-type.routes'),
    },
    {
        path: 'retiro-bancario',
        loadComponent: () =>
            import('../wallet/commons/components/retiro-bancaria/retiro-bancaria.component')
                .then(c => c.RetiroBancariaComponent)
    },
    {
        path: 'affiliate-payment',
        loadComponent: () =>
            import('./pages/automatic-payment/affiliate-automatic-payment/affiliate-automatic-payment.component')
                .then(c => c.AffiliateAutomaticPaymentComponent)
    },
    {
        path: 'desafiliate-payment',
        loadComponent: () =>
            import('./pages/automatic-payment/unsubcribe-automatic-payment/unsubcribe-automatic-payment.component')
                .then(c => c.UnsubcribeAutomaticPaymentComponent)
    }
];
export default routes;
