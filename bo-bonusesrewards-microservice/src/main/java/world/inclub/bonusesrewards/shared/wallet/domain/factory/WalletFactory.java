package world.inclub.bonusesrewards.shared.wallet.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.wallet.domain.model.Wallet;

import java.math.BigDecimal;

@Component
public class WalletFactory {

    /*
     * Updates the wallet balances by deducting the specified discount amount.
     */
    public Wallet updateWalletBalance(Wallet wallet, BigDecimal discountAmount) {
        BigDecimal newAvailableBalance = calculateNewBalance(wallet.availableBalance(), discountAmount);
        BigDecimal newAccountingBalance = calculateNewBalance(wallet.accountingBalance(), discountAmount);
        return wallet.toBuilder()
                .availableBalance(newAvailableBalance)
                .accountingBalance(newAccountingBalance)
                .build();
    }

    private BigDecimal calculateNewBalance(BigDecimal currentBalance, BigDecimal amountToDeduct) {
        return currentBalance.subtract(amountToDeduct);
    }

}
