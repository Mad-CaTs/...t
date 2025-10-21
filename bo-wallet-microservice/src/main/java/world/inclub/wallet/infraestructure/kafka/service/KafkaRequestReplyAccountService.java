package world.inclub.wallet.infraestructure.kafka.service;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.wallet.infraestructure.kafka.constant.KafkaConstants;
import world.inclub.wallet.infraestructure.kafka.dtos.request.UserAccountRequestDTO;
import world.inclub.wallet.infraestructure.kafka.dtos.response.UserAccountDTO;
import world.inclub.wallet.infraestructure.kafka.utils.KafkaRequestService;
import world.inclub.wallet.infraestructure.serviceagent.service.AccountService;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaRequestReplyAccountService {


    private final KafkaRequestService kafkaRequestService;
    private final AccountService accountService;

    public Mono<UserAccountDTO> getUserAccountById(int idUser){

        log.info("Inicia la búsqueda de UserAccount con idUser: {}", idUser);
        // Se agrega el nuevo modo REST

            /*return kafkaRequestService.sendRequest( new UserAccountRequestDTO(idUser), KafkaConstants.Topic.REQUEST_USERACCOUNT, KafkaConstants.Topic.RESPONSE_USERACCOUNT)
                .flatMap(object -> {
                    if (object instanceof UserAccountDTO) {
                        return Mono.just((UserAccountDTO) object);
                    } else {
                        return Mono.error(new IllegalStateException("La respuesta no es del tipo esperado: UserAccountDto"));
                    }
                })
                .doOnSuccess(user -> log.info("Búsqueda de UserAccount completada con éxito: {}", user))
                .doOnError(error -> log.error("Error durante la búsqueda de UserAccount con idUser: {}", idUser, error));
*/

        return accountService.getUserAccountById(idUser).flatMap(userAccountResponse -> {

            UserAccountDTO response = new UserAccountDTO();
            response.setIdUser(userAccountResponse.getId());
            response.setName(userAccountResponse.getName());
            response.setLastName(userAccountResponse.getLastName());
            response.setEmail(userAccountResponse.getEmail());
            response.setGender(userAccountResponse.getGender());
            response.setNroDocument(userAccountResponse.getTelephone());
            response.setUsername(userAccountResponse.getUsername());
            response.setPassword(userAccountResponse.getTelephone());
            response.setIdState(userAccountResponse.getIdState());


            return Mono.just(response);
        });
    }



   /* @KafkaListener(topics = KafkaConstants.Topic.RESPONSE_USERACCOUNT, groupId = KafkaConstants.GROUP_ID, containerFactory = KafkaConstants.ContainerFactory.USER_ACCOUNT_KAFKA_LISTENER_CONTAINER_FACTORY)
    public void receiveReply( UserAccountDTO reply, @Header(KafkaHeaders.CORRELATION_ID) String correlationId,@Header(KafkaHeaders.RECEIVED_KEY) String key) {

        log.info("User Recive");
        kafkaRequestService.completeRequest(correlationId, reply);
    }*/




}
