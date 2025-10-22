package world.inclub.membershippayment.domain.dto;



import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Data
public class SuscriptionDTO {

    private int idSuscription;
    private int idUser;
    private LocalDateTime creationDate;
    private int status;
    private LocalDateTime modificationDate;
    private int boolmigration;
    private int packageDetailId;
    private int idPackage;
    private LocalDate nextExpiration;

    public SuscriptionDTO() {
    }


    public SuscriptionDTO(int idUser, LocalDateTime creationDate, int status, LocalDateTime modificationDate, int boolmigration, int packageDetailId, int idPackage, LocalDate nextExpiration) {

        this.idUser = idUser;
        this.nextExpiration = nextExpiration;
        this.creationDate = creationDate;
        this.status = status;
        this.modificationDate = modificationDate;
        this.boolmigration = boolmigration;
        this.packageDetailId = packageDetailId;
        this.idPackage = idPackage;
    }
}