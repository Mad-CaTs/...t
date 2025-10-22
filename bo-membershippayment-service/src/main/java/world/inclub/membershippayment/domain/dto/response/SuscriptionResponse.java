package world.inclub.membershippayment.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SuscriptionResponse {
    private Long id;
    private Integer idUser;
    private LocalDate creationDate;
    private String observation;
    private Integer status;
    private LocalDate modificationDate;
    private Integer boolMigration;
    private LocalDate nextExpiration;
    private Integer packageDetailId;
    private Integer idPackage;
    private Integer gracePeriodParameterId;
}