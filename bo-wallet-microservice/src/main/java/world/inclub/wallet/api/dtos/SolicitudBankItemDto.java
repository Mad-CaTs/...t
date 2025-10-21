package world.inclub.wallet.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SolicitudBankItemDto {
    private Long idsolicitudebank;
    private String namePropio;
    private String lastnamePropio;
}
