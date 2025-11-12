package world.inclub.transfer.liquidation.api.dtos;

import lombok.Data;

@Data
public class ReactivateRequest {
    private Integer idSponsor;
    private Integer idUser;
}
