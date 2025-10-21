package world.inclub.wallet.infraestructure.kafka.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;
import world.inclub.wallet.application.service.interfaces.IWalletTransactionService;
import world.inclub.wallet.domain.entity.Wallet;
import world.inclub.wallet.domain.port.IWalletPort;
import world.inclub.wallet.infraestructure.kafka.constant.KafkaConstants;
import world.inclub.wallet.infraestructure.kafka.dtos.request.CreateWalletRequestDTO;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaMessageListener {

    private final IWalletPort iWalletPort;
    private final IWalletTransactionService iWalletTransactionService;

    @KafkaListener(topics = "topic-create-wallet", groupId = KafkaConstants.GROUP_ID, containerFactory = KafkaConstants.ContainerFactory.CREATE_WALLET_KAFKA_LISTENER_CONTAINER_FACTORY)
    public Mono<Boolean> createWalletbyIdUser(CreateWalletRequestDTO request){

        Wallet wallet = new Wallet(request.getIdUser()); 
        log.info("Wallet creada para el Id User "+request.getIdUser() + "/n Walle :" + wallet);

        return iWalletPort.createWalllet(wallet);


    }

    @KafkaListener(topics = KafkaConstants.Topic.ERROR_PAY,groupId = KafkaConstants.GROUP_ID,containerFactory = KafkaConstants.ContainerFactory.INTEGER_KAFKA_LISTENER_CONTAINER_FACTORY)
    public Mono<Boolean> errorWallet (Integer idWalletTransactional){

        return iWalletTransactionService.rollbackTransactionAndRefund(idWalletTransactional);

    }

}


 