import { Component } from '@angular/core';
import { BanckWithdrawalsComponent } from "@app/manager-wallet/components/banck-withdrawals/banck-withdrawals.component";
import { BankConfig } from '@app/manager-wallet/model/solicitudRetiro';

@Component({
  selector: 'app-interbank-withdrawals',
  standalone: true,
  imports: [BanckWithdrawalsComponent],
  templateUrl: './interbank-withdrawals.component.html',
  styleUrls: ['./interbank-withdrawals.component.scss']
})
export class InterbankWithdrawalsComponent {
  interbankConfig: BankConfig = {
    bankId: 2,
    bankName: 'Interbank',
    filterLogic: (data: any[]) => data.filter(item => item.idBank === 2)
  };
}
