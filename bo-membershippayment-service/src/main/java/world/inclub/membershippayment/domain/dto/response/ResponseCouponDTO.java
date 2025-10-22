package world.inclub.membershippayment.domain.dto.response;

import lombok.Builder;
import org.springframework.data.relational.core.mapping.Column;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
public record ResponseCouponDTO(
        @Column("id")
        Integer idCoupon,

        @Column("id_user")
        Integer idUser,

        @Column("id_salary")
        Integer idSalary,

        @Column("discount_percentage")
        BigDecimal discountPercentage,

        @Column("coupon_code")
        String couponCode,

        @Column("date_start")
        LocalDateTime dateStart,

        @Column("dateEnd")
        LocalDateTime dateEnd,

        @Column("state")
        Boolean state,

        @Column("id_business")
        Integer idBusiness,

        @Column("is_partner")
        Boolean isPartner,

        @Column("created_at")
        LocalDateTime createdAt,

        @Column("username")
        String username,

        @Column("full_name")
        String fullName

) {}
