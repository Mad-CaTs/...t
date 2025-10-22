package world.inclub.membershippayment.infraestructure.apisExternas.walllet;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.crosscutting.utils.KafkaRequestService;
import world.inclub.membershippayment.domain.dto.WalletTransaction;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;
import world.inclub.membershippayment.domain.entity.User;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.ObjModel;
import world.inclub.membershippayment.infraestructure.apisExternas.walllet.dtos.CreateWalletRequestDTO;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;
import world.inclub.membershippayment.infraestructure.config.kafka.dtos.request.RegisterPaymenWithWalletRequestDTO;
import world.inclub.membershippayment.infraestructure.config.kafka.dtos.request.WalletRequestDTO;
import world.inclub.membershippayment.infraestructure.config.kafka.dtos.response.RegisterPaymenWithWalletResponseDTO;
import world.inclub.membershippayment.infraestructure.config.kafka.dtos.response.WalletResponseDto;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final KafkaRequestService kafkaRequestService;
    
    public Mono<Boolean> createWallet(Integer idUser) {

        CreateWalletRequestDTO createWalletRequestDTO = new CreateWalletRequestDTO();
        createWalletRequestDTO.setIdUser(Long.valueOf(idUser));
    
        return Mono.fromFuture(kafkaTemplate.send("topic-create-wallet", createWalletRequestDTO))
                .map(result -> true)
                .onErrorResume(e -> {
                    log.error("Error sending message to Kafka", e);
                    return Mono.just(false);
                });
    }

    public Mono<Boolean> errorPay(Integer id) {

        return Mono.fromFuture(kafkaTemplate.send("topic-error-pay", id))
                .map(result -> true)
                .onErrorResume(e -> {
                    log.error("Error sending message to Kafka", e);
                    return Mono.just(false);
                });
    }

    public Mono<RegisterPaymenWithWalletResponseDTO> walletTransaction(WalletTransaction transaction, SponsordResponse userResponse, Integer codigoTypeWalletTransaction,  User user, Boolean isFullPayment) {

        RegisterPaymenWithWalletRequestDTO registerPaymenWithWalletRequestDTO = new RegisterPaymenWithWalletRequestDTO();
        registerPaymenWithWalletRequestDTO.setWalletTransaction(transaction);
        registerPaymenWithWalletRequestDTO.setTypeWalletTransaction(codigoTypeWalletTransaction);
        registerPaymenWithWalletRequestDTO.setIdUserPayment(Long.valueOf(userResponse.getId()));
        registerPaymenWithWalletRequestDTO.setIsFullPayment(isFullPayment);
        registerPaymenWithWalletRequestDTO.setDetailPayment(user.getName() + " " + user.getLastName());

        return kafkaRequestService.sendRequest(registerPaymenWithWalletRequestDTO, KafkaConstants.Topic.REQUEST_REGISTER_PAYMENT_WITH_WALLET, KafkaConstants.Topic.RESPONSE_REGISTER_PAYMENT_WITH_WALLET)
                .flatMap(response -> {
                    if (response instanceof RegisterPaymenWithWalletResponseDTO) {
                        return Mono.just((RegisterPaymenWithWalletResponseDTO) response);
                    } else {
                        return Mono.error(new IllegalStateException("Unexpected response type"));
                    }
                })
                .doOnSuccess(result -> log.info("Transacción completada con éxito: {}", result))
                .doOnError(error -> log.error("Error en WalletTransaction", error));

    }

    public Mono<WalletResponseDto> getWallet(Integer idSponsor) {
        WalletRequestDTO walletRequestDTO = new WalletRequestDTO();
        walletRequestDTO.setIdUser(idSponsor);


        return kafkaRequestService.sendRequest(walletRequestDTO,KafkaConstants.Topic.REQUEST_WALLET, KafkaConstants.Topic.RESPONSE_WALLET)
                .flatMap(response -> {
                    if (response instanceof WalletResponseDto) {
                        return Mono.just((WalletResponseDto) response);
                    } else {
                        return Mono.error(new IllegalStateException("Unexpected response type"));
                    }
                })
                .doOnSuccess(result -> log.info("Exito en GetWallet: {}", result))
                .doOnError(error -> log.error("Error en GetWallet", error));

    }

    @KafkaListener(topics = KafkaConstants.Topic.RESPONSE_REGISTER_PAYMENT_WITH_WALLET, groupId = KafkaConstants.GROUP_ID, containerFactory = KafkaConstants.ContainerFactory.REGISTER_PAYMENT_WITH_WALLET_REQUEST_KAFKA_LISTENER_CONTAINER_FACTORY)
    private void receiveReply(RegisterPaymenWithWalletResponseDTO reply, @Header(KafkaHeaders.CORRELATION_ID) String correlationId, @Header(KafkaHeaders.RECEIVED_KEY) String key) {
        log.info("WalletTransaction recive");

        kafkaRequestService.completeRequest(correlationId, reply);
    }

    @KafkaListener(topics = KafkaConstants.Topic.RESPONSE_WALLET, groupId = KafkaConstants.GROUP_ID, containerFactory = KafkaConstants.ContainerFactory.WALLET_RESPONSE_KAFKA_LISTENER_CONTAINER_FACTORY)
    public void receiveReply(WalletResponseDto reply, @Header(KafkaHeaders.CORRELATION_ID) String correlationId) {
        kafkaRequestService.completeRequest(correlationId, reply);
    }




}
