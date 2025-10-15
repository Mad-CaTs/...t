package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import world.inclub.bonusesrewards.shared.infrastructure.auditing.BaseAuditableEntity;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.SCHEMA;
import static world.inclub.bonusesrewards.carbonus.infrastructure.persistence.schema.CarBonusSchema.Table.CAR_QUOTATIONS_TABLE;

@Data
@Builder(toBuilder = true)
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = CAR_QUOTATIONS_TABLE, schema = SCHEMA)
public class CarQuotationEntity
        extends BaseAuditableEntity {

    @Id
    private UUID id;

    @Column("classification_id")
    private UUID classificationId;

    @Column("brand")
    private String brand;

    @Column("model")
    private String model;

    @Column("color")
    private String color;

    @Column("price_usd")
    private BigDecimal priceUsd;

    @Column("dealership")
    private String dealership;

    @Column("executive_country_id")
    private Long executiveCountryId;

    @Column("sales_executive")
    private String salesExecutive;

    @Column("sales_executive_phone")
    private String salesExecutivePhone;

    @Column("quotation_url")
    private String quotationUrl;

    @Column("event_id")
    private Long eventId;

    @Column("initial_installments")
    private Integer initialInstallments;

    @Column("is_accepted")
    private Boolean isAccepted;

    @Column("accepted_at")
    private Instant acceptedAt;

}
