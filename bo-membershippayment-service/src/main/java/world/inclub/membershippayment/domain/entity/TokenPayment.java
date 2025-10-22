package world.inclub.membershippayment.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.membershippayment.crosscutting.utils.TimeLima;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "tokenPayment", schema = "bo_membership")
public class TokenPayment {
    @Id
    @Column("idtokenpayment")
    private Long idTokenPayment;
    @Column("codtokenpayment")
    private String codTokenPayment;
    @Column("startdate")
    private LocalDateTime startDate;
    @Column("enddate")
    private LocalDateTime endDate;
    @Column("idsuscription")
    private Integer idSuscription;
    @Column("idpayment")
    private Integer idPayment;

    public TokenPayment(String codToken, int idSuscription, int idPayment) {

        byte DAYSDURATIONPAYLATER = 4;
        int hrsDurationToken = 24 * DAYSDURATIONPAYLATER;

        this.codTokenPayment = codToken;
        this.idSuscription = idSuscription;
        this.idPayment = idPayment;
        this.startDate = TimeLima.getLimaTime();
        this.endDate = TimeLima.getLimaTime().plusHours(hrsDurationToken);
    }

}

