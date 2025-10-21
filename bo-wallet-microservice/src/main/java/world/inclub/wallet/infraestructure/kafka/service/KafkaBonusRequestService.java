package world.inclub.wallet.infraestructure.kafka.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import world.inclub.wallet.api.dtos.WalletTransactionDto;
import world.inclub.wallet.application.service.interfaces.IWalletTransactionService;
import world.inclub.wallet.domain.entity.WalletTransaction;
import world.inclub.wallet.infraestructure.kafka.constant.KafkaConstants;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaBonusRequestService {

    private final IWalletTransactionService walletTransactionService;

    @KafkaListener(
            topics = "topic-request-bonus-wallet",
            groupId = KafkaConstants.GROUP_ID,
            containerFactory = "registerBonusForWalletRequestKafkaListenerContainerFactory"
    )
    public void consume(ConsumerRecord<String, WalletTransactionDto> record) {
        int userId = Integer.parseInt(record.key());
        WalletTransactionDto walletTransactionDto = record.value();

        WalletTransaction walletTransaction = new WalletTransaction(
                walletTransactionDto.getIdWallet(),
                walletTransactionDto.getIdTypeWalletTransaction(),
                walletTransactionDto.getIdCurrency(),
                walletTransactionDto.getIdExchangeRate(),
                walletTransactionDto.getAmount(),
                walletTransactionDto.getIsAvailable(),
                walletTransactionDto.getAvailabilityDate(),
                walletTransactionDto.getReferenceData()
        );
        log.info(String.valueOf(walletTransaction));
        walletTransactionService.registerTransaction(walletTransaction, userId)
                .doOnError(error -> log.error("Error en registrar el pago de bonus para el userId: {}", userId, error))
                .subscribe();
    }

}
