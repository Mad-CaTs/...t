import { Component } from '@angular/core';
import { BanckWithdrawalsComponent } from "@app/manager-wallet/components/banck-withdrawals/banck-withdrawals.component";
import { BankConfig } from '@app/manager-wallet/model/solicitudRetiro';

@Component({
  selector: 'app-bcp-withdrawals',
  standalone: true,
  imports: [BanckWithdrawalsComponent],
  templateUrl: './bcp-withdrawals.component.html',
  styleUrls: ['./bcp-withdrawals.component.scss']
})
export class BcpWithdrawalsComponent {
  bcpConfig: BankConfig = {
    bankId: 1,
    bankName: 'BCP',
    filterLogic: (data: any[]) => data.filter(item => item.idBank === 1)
  };
}
