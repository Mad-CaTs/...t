package world.inclub.transfer.liquidation.infraestructure.kafka.dtos.request;

import java.sql.Timestamp;

import org.springframework.data.relational.core.mapping.Column;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransferRequestDTO {

    @JsonProperty("idTransfer")
    private Long idTransfer;
    
    @Column("idticket")
    private Integer idticket;
    
    @Column("idstatus")
    private Integer idstatus;
    
    @Column("typeTrasnfer")
    private Integer typeTrasnfer;
    
    @Column("score")
    private Integer score;
    
    @Column("idMembership")
    private Integer idMembership;
    
    @Column("idSuscription")
    private Integer idSuscription;
    
    @Column("creationUser")
    private String creationUser;
    
    @Column("creationDate")
    private Timestamp creationDate;
    
    @Column("modificationUser")
    private String modificationUser;
    
    @Column("modificationDate")
    private Timestamp modificationDate;

}
