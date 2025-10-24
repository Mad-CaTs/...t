import { Routes } from '@angular/router';
import { WalletTransactionsTypeComponent } from './wallet-transactions-type.component';
import { WalletTransferComponent } from '../commons/components/wallet-transfer/wallet-transfer.component';
const routes: Routes = [
    {
        path: '',
        component: WalletTransactionsTypeComponent
    },
    {
        path: 'entre-wallet',
        component: WalletTransferComponent
    },

];
export default routes;