package world.inclub.wallet.api.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SolicitudBankMassiveUpdateDto {
    private String msg;
    private Integer idReasonRetiroBank;
    private Integer status;
    private List<SolicitudBankItemDto> solicitudes;
}

