package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.View.CAR_QUOTATION_DETAIL_VIEW;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_QUOTATION_DETAIL_VIEW, schema = SCHEMA)
public class CarQuotationDetailViewEntity {
    @Id
    @Column("quotation_id")
    private UUID id;

    @Column("classification_id")
    private UUID classificationId;

    @Column("member_id")
    private Long memberId;

    @Column("username")
    private String username;

    @Column("member_full_name")
    private String memberName;

    @Column("brand")
    private String brand;

    @Column("model")
    private String model;

    @Column("color")
    private String color;

    @Column("price_usd")
    private BigDecimal price;

    @Column("dealership")
    private String dealership;

    @Column("executive_country_id")
    private Long executiveCountryId;

    @Column("sales_executive")
    private String salesExecutive;

    @Column("prefix_phone")
    private String prefixPhone;

    @Column("sales_executive_phone")
    private String salesExecutivePhone;

    @Column("quotation_url")
    private String quotationUrl;

    @Column("initial_installments")
    private Integer initialInstallments;

    @Column("event_id")
    private Long eventId;

    @Column("is_accepted")
    private Boolean isAccepted;

    @Column("accepted_at")
    private Instant acceptedAt;

}
