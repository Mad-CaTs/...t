package world.inclub.membershippayment.domain.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "subscription_coupons", schema = "bo_membership")
public class SubscriptionCoupon {

    @Id
    @Column("id")
    private Integer idCoupon;

    @Column("id_user")
    private Integer idUser;

    @Column("id_salary")
    private Integer idSalary;

    @Column("id_subscription")
    private Integer idSubscription;

    @Column("discount_percentage")
    private BigDecimal discountPercentage;

    @Column("coupon_code")
    private String code;

    @Column("date_start")
    private LocalDateTime dateStart;

    @Column("date_end")
    private LocalDateTime dateEnd;

    @Column("state")
    private Boolean state;

    @Column("id_business")
    private Integer idBusiness;

    @Column("is_partner")
    private Boolean isPartner;

    @Column("created_at")
    private LocalDateTime created_at;

    @Column("updated_at")
    private LocalDateTime updated_at;


}
