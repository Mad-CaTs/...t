package world.inclub.membershippayment.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "mirrorSuscription", schema = "bo_membership")
public class MirrorSuscription {
    private Long idMirrorSuscription;
    private Integer idSuscription;
    private Integer idPackage;
    private LocalDateTime dataInsert;
    private LocalDateTime dateModified;
    private Integer typeComission;
    private Integer packageDetailId;
    private BigDecimal amountComissionEditor;
    private Integer flagEditor;
    private LocalDateTime dateEditor;
    private BigDecimal amountMigration;
    private Integer numberInitialFraction;
}