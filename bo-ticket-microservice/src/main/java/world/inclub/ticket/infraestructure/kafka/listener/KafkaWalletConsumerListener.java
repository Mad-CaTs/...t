package world.inclub.ticket.infraestructure.kafka.listener;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import world.inclub.ticket.infraestructure.kafka.KafkaRequestService;
import world.inclub.ticket.infraestructure.kafka.constants.KafkaConstants;
import world.inclub.ticket.infraestructure.kafka.constants.KafkaConstants.Topic;
import world.inclub.ticket.infraestructure.kafka.dto.ProcessWalletPaymentDto;

@Component
@RequiredArgsConstructor
public class KafkaWalletConsumerListener {

    private final KafkaRequestService kafkaRequestService;

    @KafkaListener(
            topics = Topic.Wallet.RESPONSE_REGISTER_PAYMENT_WITH_WALLET,
            groupId = KafkaConstants.GROUP_ID,
            containerFactory = "processWalletPaymentKafkaListenerContainerFactory")
    private void receiveReply(ProcessWalletPaymentDto reply,
                              @Header(KafkaHeaders.CORRELATION_ID) String correlationId,
                              @Header(KafkaHeaders.RECEIVED_KEY) String key) {
        kafkaRequestService.completeRequest(correlationId, reply);
    }

}
