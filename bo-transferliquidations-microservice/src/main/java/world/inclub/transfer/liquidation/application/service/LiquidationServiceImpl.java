package world.inclub.transfer.liquidation.application.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.LiquidationAdminDto;
import world.inclub.transfer.liquidation.api.dtos.StateLiquidationDTO;
import world.inclub.transfer.liquidation.api.dtos.StateTransferDTO;
import world.inclub.transfer.liquidation.api.dtos.TransferAdminDto;
import world.inclub.transfer.liquidation.application.service.interfaces.ILiquidationService;
import world.inclub.transfer.liquidation.domain.entity.Liquidation;
import world.inclub.transfer.liquidation.domain.entity.Transfer;
import world.inclub.transfer.liquidation.domain.port.ILiquidationPort;

@Service
@RequiredArgsConstructor
public class LiquidationServiceImpl implements ILiquidationService {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplateTransfer;
    
    private final ILiquidationPort iLiquidationPort;
    
    @Override
    public Mono<Liquidation> saveLiquidation(Liquidation entity) {
        return iLiquidationPort.saveLiquidation(entity).doOnSuccess(e -> {
            LiquidationAdminDto adminDto = new LiquidationAdminDto();
            adminDto.setIdLiquidation(e.getIdliquidation().intValue());
            adminDto.setIdUser(e.getIdUser());
            adminDto.setIdStatus(e.getIdStatus());
            adminDto.setIdTypeTransfer(e.getIdTypeTransfer());
            adminDto.setIdSuscription(e.getIdSuscription());
            adminDto.setIdReasonLiquidation(e.getIdReasonLiquidation());
            adminDto.setIdOptionReturnMoney(e.getIdOptionReturnMoney());
            adminDto.setAmountPayment(e.getAmountPayment());
            adminDto.setAmountPenality(e.getAmountPenality());
            adminDto.setAmountFavour(e.getAmountFavour());
            adminDto.setCreationUser(e.getCreationUser());
            adminDto.setCreationDate(e.getCreationDate());
            kafkaTemplateTransfer.send("topic-liquidation", String.valueOf(""+e.getIdliquidation()), adminDto);
        });
    }

    @Override
    public Mono<Void> updateIdStatusById(StateLiquidationDTO entity) {
        Liquidation transfer = new Liquidation();
        transfer.setIdliquidation(Long.valueOf(entity.getIdLiquidation()));
        transfer.setIdStatus(entity.getIdState());
        transfer.setModificationDate(entity.getModificationDate());
        return iLiquidationPort.updateIdStatusById(transfer);
    }

}
