package world.inclub.membershippayment.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "suscription", schema = "bo_membership")
public class Suscription  {
    @Id
    @Column("idsuscription")
    private Long idSuscription;
    @Column("iduser")
    private Integer idUser;
    @Column("creationdate")
    private LocalDateTime creationDate;
    private String observation;
    private Integer status;
    @Column("modificationdate")
    private LocalDateTime modificationDate;
    @Column("ismigrated")
    private Integer isMigrated;
    @Column("nextexpirationdate")
    private LocalDate nextExpirationDate;
    @Column("idpackagedetail")
    private Integer idPackageDetail;
    @Column("idpackage")
    private Integer idPackage;
    @Column("idgraceperiodparameter")
    private Integer idGracePeriodParameter;
    @Column("assigned_points")
    private Integer assignedPoints;
    @Column("paid_installments")
    private Integer paidInstallments;
    @Column("canje_count")
    private Integer canjeCount;

}
