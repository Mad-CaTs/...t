package world.inclub.wallet.api.dtos;

import lombok.*;
import org.springframework.data.annotation.Transient;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudebankDTO {
    //private Long idsolicitudebank;
    private Integer idUser;
    private Integer idCountry;
    private Integer idCurrency;
    private Integer idAccountBank;
    private BigDecimal money;

    private  String namePropio;

    private  String lastnamePropio;
  //  private LocalDateTime fechSolicitud;
  //  private Integer status;
  //  private LocalDateTime fechProcess;

}
