package world.inclub.bonusesrewards.shared.wallet.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.utils.TimeLima;
import world.inclub.bonusesrewards.shared.wallet.domain.model.Wallet;
import world.inclub.bonusesrewards.shared.wallet.domain.model.WalletTransaction;
import world.inclub.bonusesrewards.shared.wallet.domain.model.WalletTransactionType;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;

@Component
public class WalletTransactionFactory {

    /*
     * Creates a WalletTransaction for recharging the wallet based on the CarPaymentSchedule.
     */
    public WalletTransaction createRechargeWallet(
            CarPaymentSchedule carPaymentSchedule,
            Wallet wallet,
            Long exchangeRateId,
            String reference
    ) {
        return WalletTransaction.builder()
                .walletId(wallet.id())
                .walletTransactionTypeId(WalletTransactionType.RECARGA_WALLET.getId())
                .currencyId(1L)
                .exchangeRateId(exchangeRateId)
                .initiatedAt(TimeLima.getLimaTime())
                .amount(carPaymentSchedule.monthlyBonus())
                .isAvailable(true)
                .availableAt(TimeLima.getLimaTime())
                .reference(reference)
                .isSuccessful(true)
                .build();
    }

    /*
     * Creates a WalletTransaction for applying a discount to the wallet based on the CarPaymentSchedule.
     */
    public WalletTransaction createDiscountWallet(
            CarPaymentSchedule carPaymentSchedule,
            Wallet wallet,
            Long exchangeRateId,
            String reference
    ) {
        return WalletTransaction.builder()
                .walletId(wallet.id())
                .walletTransactionTypeId(WalletTransactionType.DESCUENTO_INCLUB.getId())
                .currencyId(1L)
                .exchangeRateId(exchangeRateId)
                .initiatedAt(TimeLima.getLimaTime())
                .amount(carPaymentSchedule.total().negate())
                .isAvailable(true)
                .availableAt(TimeLima.getLimaTime())
                .reference(reference)
                .isSuccessful(true)
                .build();
    }

}
