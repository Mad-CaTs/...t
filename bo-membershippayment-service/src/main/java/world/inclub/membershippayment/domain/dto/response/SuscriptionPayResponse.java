package world.inclub.membershippayment.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SuscriptionPayResponse {

    private Long id;
    private Integer idFamilyPackage;
    private String familyPackageName;
    private String nameSuscription;
    private BigDecimal volumen;
    private BigDecimal volumenByFee;
    private BigDecimal volumenRibera;
    private Integer idUser;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime creationDate;
    private String status;
    private Integer idStatus;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime modificationDate;
    private Integer idPackageDetail;
    private Integer idPackage;
    private Integer numberQuotas;
    private Integer idGracePeriodParameter;

}
