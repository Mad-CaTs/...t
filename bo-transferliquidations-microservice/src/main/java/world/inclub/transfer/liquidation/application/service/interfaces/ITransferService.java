package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.StateTransferDTO;
import world.inclub.transfer.liquidation.api.dtos.TransferRequestDTO;
import world.inclub.transfer.liquidation.domain.entity.Transfer;

public interface ITransferService {

    public Mono<Transfer> saveTransfer(TransferRequestDTO entity);
    public Mono<Void> updateIdStatusById(StateTransferDTO entity);

}