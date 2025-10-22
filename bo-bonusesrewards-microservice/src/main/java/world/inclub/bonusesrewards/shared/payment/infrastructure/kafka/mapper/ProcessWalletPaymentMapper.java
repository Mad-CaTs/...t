package world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.application.dto.ProcessWalletPaymentCommand;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.dto.ProcessWalletPaymentDto;

@Component
public class ProcessWalletPaymentMapper {

    public ProcessWalletPaymentDto toDto(ProcessWalletPaymentCommand command) {
        return ProcessWalletPaymentDto.builder()
                .idUserPayment(command.userId())
                .walletTransaction(ProcessWalletPaymentDto.WalletTransaction.builder()
                        .idWallet(null)
                        .idTypeWalletTransaction(45)
                        .idCurrency(2)
                        .idExchangeRate(null)
                        .amount(command.amount())
                        .isAvailable(true)
                        .availabilityDate(null)
                        .referenceData(command.detail())
                        .build())
                .typeWalletTransaction(45)
                .isFullPayment(true)
                .detailPayment(command.detail())
                .build();
    }
}
