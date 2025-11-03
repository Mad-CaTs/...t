package world.inclub.wallet.infraestructure.kafka.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import org.springframework.messaging.Message;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.interfaces.IWalletService;
import world.inclub.wallet.application.service.interfaces.IWalletTransactionService;
import world.inclub.wallet.domain.entity.Wallet;
import world.inclub.wallet.infraestructure.kafka.constant.KafkaConstants;
import world.inclub.wallet.infraestructure.kafka.dtos.request.RegisterPaymenWithWalletRequestDTO;
import world.inclub.wallet.infraestructure.kafka.dtos.request.WalletRequestDTO;
import world.inclub.wallet.infraestructure.kafka.dtos.response.RegisterPaymenWithWalletResponseDTO;
@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaRequestReplyMembershipService {

    private final IWalletService iWalletService;
    private final IWalletTransactionService iWalletTransactionService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "topic-request-wallet", groupId = KafkaConstants.GROUP_ID, containerFactory = "walletRequestKafkaListenerContainerFactory")
    public void handleWalletRequest(WalletRequestDTO request,
                                    @Header(KafkaHeaders.CORRELATION_ID) String correlationId,
                                    @Header(KafkaHeaders.REPLY_TOPIC) String reaply,
                                    @Header(KafkaHeaders.RECEIVED_KEY) String key) {


        log.info("Consumed user account: {}", request);
        iWalletService.getWalletByIdUser(request.getIdUser()).flatMap(response -> {
            Message<Wallet> message = MessageBuilder
                    .withPayload(response)
                    .setHeader(KafkaHeaders.TOPIC,reaply )
                    .setHeader(KafkaHeaders.KEY,key)
                    .setHeader(KafkaHeaders.CORRELATION_ID, correlationId)
                    .build();

            // Envía la respuesta
           
            return Mono.fromRunnable(() -> kafkaTemplate.send(message))
                                         .thenReturn(response);
        })

        .subscribe(
                response -> log.info("Wallet sent: {}", response),
                error -> log.error("Error: {}", error.getMessage())
        );
       
    }

    @KafkaListener(topics = "topic-request-registerpaymentwithwallet", groupId = KafkaConstants.GROUP_ID, containerFactory = "registerPaymenWithWalletRequestKafkaListenerContainerFactory")
    public void handleWalletRequesst(RegisterPaymenWithWalletRequestDTO request,
                                     @Header(KafkaHeaders.CORRELATION_ID) String correlationId,
                                     @Header(KafkaHeaders.REPLY_TOPIC) String reaply,
                                     @Header(KafkaHeaders.RECEIVED_KEY) String key) {
        // Procesa la solicitud

        iWalletTransactionService.processPaymentWithWallet(request.getIdUserPayment(),
                request.getWalletTransaction(), request.getTypeWalletTransaction(), request.getIsFullPayment(),
                request.getDetailPayment()).flatMap(transaction -> {

                    RegisterPaymenWithWalletResponseDTO response = new RegisterPaymenWithWalletResponseDTO(
                        transaction);

                    Message<RegisterPaymenWithWalletResponseDTO> message = MessageBuilder
                            .withPayload(response)
                            .setHeader(KafkaHeaders.TOPIC,reaply )
                            .setHeader(KafkaHeaders.KEY,key)
                            .setHeader(KafkaHeaders.CORRELATION_ID, correlationId)
                            .build();

                    // Envía la respuesta
                    return Mono.fromRunnable(() -> kafkaTemplate.send(message))
                                         .thenReturn(response);
                })

                .subscribe(
                        response -> log.info("RegisterPaymenWithWalletResponseDTO sent: {}", response),
                        error -> log.error("Error: {}", error.getMessage())
                );

    }

}
