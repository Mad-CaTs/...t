package world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.KafkaRequestService;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.constants.KafkaConstants;
import world.inclub.bonusesrewards.shared.payment.infrastructure.kafka.dto.WalletPaymentResponseDto;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaWalletPaymentResponseListener {

    private final KafkaRequestService kafkaRequestService;

    @KafkaListener(
            topics = KafkaConstants.Topic.Wallet.RESPONSE_REGISTER_PAYMENT_WITH_WALLET,
            groupId = KafkaConstants.GROUP_ID,
            containerFactory = KafkaConstants.ContainerFactory.Wallet.WALLET_RESPONSE_KAFKA_LISTENER_CONTAINER_FACTORY
    )
    public void handleWalletPaymentResponse(
            WalletPaymentResponseDto response,
            @Header(KafkaHeaders.CORRELATION_ID) String correlationId,
            @Header(KafkaHeaders.RECEIVED_KEY) String key) {

        kafkaRequestService.completeRequest(correlationId, response);
    }
}
