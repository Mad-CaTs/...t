package world.inclub.wallet.infraestructure.kafka.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.wallet.api.dtos.AdminPanelTransactionRequest;
import world.inclub.wallet.application.service.interfaces.IWalletTransactionService;
import world.inclub.wallet.domain.entity.WalletTransaction;
import world.inclub.wallet.infraestructure.kafka.constant.KafkaConstants;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaAdminPanel {

    private final IWalletTransactionService transactionService;
    private final KafkaTemplate<String, Object> kafkaTemplate;


    @KafkaListener(topics = KafkaConstants.Topic.REQUEST_OPERATION_WALLET, groupId = KafkaConstants.GROUP_ID,containerFactory = KafkaConstants.ContainerFactory.ADMINRESQUEST_KAFKA_LISTENER_CONTAINER_FACTORY)
    public void responseOperationWallet (AdminPanelTransactionRequest request,
                                         @Header(KafkaHeaders.CORRELATION_ID) String correlationId,
                                         @Header(KafkaHeaders.REPLY_TOPIC) String reaply,
                                         @Header(KafkaHeaders.RECEIVED_KEY) String key) {

        transactionService.registerAdminPanelTransaction(request)
                .flatMap(response  ->{

                    Message<WalletTransaction> message = MessageBuilder
                            .withPayload(response)
                            .setHeader(KafkaHeaders.TOPIC,reaply )
                            .setHeader(KafkaHeaders.KEY,key)
                            .setHeader(KafkaHeaders.CORRELATION_ID, correlationId)
                            .build();

                    return Mono.fromRunnable(() -> kafkaTemplate.send(message))
                            .thenReturn(response);
                })
                .subscribe(
                        response -> log.info("Operation sent: {}", response),
                        error -> log.error("Error: {}", error.getMessage())
                );

    }

    //@KafkaListener(topics = KafkaConstants.Topic.REQUEST_OPERATION_WALLET, groupId = KafkaConstants.GROUP_ID,containerFactory = KafkaConstants.ContainerFactory.ADMINRESQUEST_KAFKA_LISTENER_CONTAINER_FACTORY)
//    public void responseOperationWallet2 (AdminPanelTransactionRequest request) {
//
//        transactionService.registerAdminPanelTransaction(request)
//                .subscribe(
//                        response -> log.info("Operation sent: {}", response),
//                        error -> log.error("Error: {}", error.getMessage())
//                );
//
//    }

}
