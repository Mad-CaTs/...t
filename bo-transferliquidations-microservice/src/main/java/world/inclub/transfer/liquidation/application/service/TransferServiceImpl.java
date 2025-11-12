package world.inclub.transfer.liquidation.application.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.StateTransferDTO;
import world.inclub.transfer.liquidation.api.dtos.TransferAdminDto;
import world.inclub.transfer.liquidation.api.dtos.TransferRequestDTO;
import world.inclub.transfer.liquidation.application.service.interfaces.ITransferService;
import world.inclub.transfer.liquidation.domain.entity.Transfer;
import world.inclub.transfer.liquidation.domain.port.ITransferPort;

@Service
@RequiredArgsConstructor
public class TransferServiceImpl implements ITransferService {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplateTransfer;

    private final ITransferPort iTransferPort;
    
    @Autowired
    @Qualifier("accountWebClient") 
    private WebClient accountWebClient;

    @Override
    public Mono<Transfer> saveTransfer(TransferRequestDTO entity) {
        Transfer transfer = new Transfer();
        transfer.setIdUserOld(entity.getTransfer().getIdUserOld());
        transfer.setIdUserNew(entity.getTransfer().getIdUserNew());
        transfer.setIdPerfil(entity.getTransfer().getIdPerfil());
        transfer.setIdSponsor(entity.getTransfer().getIdSponsor());
        transfer.setIdStatus(entity.getTransfer().getIdStatus());
        transfer.setIdTypeTransfer(entity.getTransfer().getIdTypeTransfer());
        transfer.setCreationUser(entity.getTransfer().getCreationUser());

        return iTransferPort.saveTransfer(transfer).doOnSuccess(e -> {
            TransferAdminDto adminDto = new TransferAdminDto();
            adminDto.setIdTransfer(e.getIdTransfer());
            adminDto.setIdUserOld(e.getIdUserOld());
            adminDto.setIdUserNew(e.getIdUserNew());
            adminDto.setIdPerfil(e.getIdPerfil());
            adminDto.setIdSponsor(e.getIdSponsor());
            adminDto.setIdStatus(e.getIdStatus());
            adminDto.setIdTypeTransfer(e.getIdTypeTransfer());
            adminDto.setCreationDate(e.getCreationDate());
            adminDto.setCreationUser(entity.getTransfer().getCreationUser());

            accountWebClient.post()
                .uri("/path-to-api")
                .retrieve()
                .bodyToMono(String.class)
                .doOnTerminate(() -> {
                    kafkaTemplateTransfer.send("topic-transfer", String.valueOf(e.getIdTransfer()), adminDto);
                }).subscribe();
        });
    }

    @Override
    public Mono<Void> updateIdStatusById(StateTransferDTO entity) {
        Transfer transfer = new Transfer();
        transfer.setIdTransfer(entity.getIdTransfer());
        transfer.setIdStatus(entity.getIdState());
        transfer.setModificationDate(entity.getModificationDate());
        return iTransferPort.updateIdStatusById(transfer);
    }
}