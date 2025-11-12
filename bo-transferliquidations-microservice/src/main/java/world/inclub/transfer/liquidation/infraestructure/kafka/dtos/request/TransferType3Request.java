package world.inclub.transfer.liquidation.infraestructure.kafka.dtos.request;

import lombok.Data;

@Data
public class TransferType3Request {
    private Long suscriptionId; 
    private Long rewardId;   
}
