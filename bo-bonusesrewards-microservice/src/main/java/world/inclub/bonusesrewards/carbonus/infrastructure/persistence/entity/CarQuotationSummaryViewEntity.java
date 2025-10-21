package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.View.CAR_QUOTATION_SUMMARY_VIEW;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_QUOTATION_SUMMARY_VIEW, schema = SCHEMA)
public class CarQuotationSummaryViewEntity {

    @Id
    @Column("classification_id")
    private UUID classificationId;

    @Column("member_id")
    private Long memberId;

    @Column("username")
    private String username;

    @Column("member_full_name")
    private String memberFullName;

    @Column("country_name")
    private String countryName;

    @Column("rank_id")
    private Long rankId;

    @Column("last_quotation_date")
    private Instant lastQuotationDate;

    @Column("has_any_accepted")
    private Boolean hasAnyAccepted;

}
