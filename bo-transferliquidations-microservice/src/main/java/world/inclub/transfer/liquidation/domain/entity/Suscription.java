package world.inclub.transfer.liquidation.domain.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Data;

@Data
@Table(schema = "bo_membership", name = "suscription")
public class Suscription {

    @Id
    private Integer idsuscription;
    private Integer iduser;
    private LocalDateTime creationdate;
    private String observation;
    private Integer status;
    private LocalDateTime modificationdate;
    private Integer ismigrated;
    private LocalDateTime nextexpirationdate;
    private Integer idpackagedetail;
    private Integer idpackage;
    private Integer idgraceperiodparameter;
    private Integer assigned_points;
    private Integer paid_installments;
    private Integer canje_count;
    private Integer rewards;
    private Integer releasedpoints;
}
