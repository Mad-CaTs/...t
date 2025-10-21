package world.inclub.wallet.api.dtos;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SolicitudBankStatusDto {
    private Long idsolicitudebank;
    //private Integer idAccountBank;
    //private Integer idUser;
    private  String namePropio;
    private  String lastnamePropio;
    private  String msg;
    private  Integer idReasonRetiroBank;
    private Integer status;
}
