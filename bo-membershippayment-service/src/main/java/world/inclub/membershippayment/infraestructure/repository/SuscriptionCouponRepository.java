package world.inclub.membershippayment.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.dto.response.ResponseCouponDTO;
import world.inclub.membershippayment.domain.dto.response.ResponseCouponTotalDTO;
import world.inclub.membershippayment.domain.entity.SubscriptionCoupon;

public interface SuscriptionCouponRepository extends ReactiveCrudRepository<SubscriptionCoupon, Integer> {

    Mono<SubscriptionCoupon> findByStateIsTrueAndIdSubscriptionAndIdUser(Integer code, Integer iduser);
    Mono<SubscriptionCoupon> findByStateIsTrueAndIdSubscriptionIsNullAndCode(String code);
    Mono<SubscriptionCoupon> findByCode(String code);
    Mono<SubscriptionCoupon> findByIdSubscriptionIsNullAndCode(String code);
    Mono<SubscriptionCoupon> findByIdCoupon(Integer idcoupon);
    Mono<SubscriptionCoupon> save(SubscriptionCoupon suscriptionCoupon);

    @Query("""
            SELECT
                sc.id AS id,
                sc.id_user AS id_user,
                sc.id_salary AS id_salary,
                sc.discount_percentage AS discount_percentage,
                sc.coupon_code AS coupon_code,
                sc.date_start AS date_start,
                sc.date_end AS date_end,
                sc.state AS state,
                sc.id_business AS id_business,
                sc.is_partner AS is_partner,
                sc.created_at AS created_at,
                ua.username  AS  username,
                CONCAT(ua.name , ' ' , ua.lastname) as full_name
            FROM bo_membership.subscription_coupons AS sc
            LEFT JOIN bo_account.user AS ua
            ON sc.id_user = ua.id
            WHERE (ua.name LIKE CONCAT('%',:search, '%')
                OR ua.lastname LIKE CONCAT('%',:search, '%')
                OR username LIKE CONCAT('%',:search, '%')
                OR coupon_code LIKE CONCAT('%',:search, '%'))
            AND CASE
                 WHEN :id_bus IS NOT NULL THEN sc.id_business = :id_bus
                 ELSE sc.id_business > 0
                END
            AND sc.is_partner = :ispartner
            AND sc.state = true
            ORDER BY id DESC
            LIMIT :size OFFSET :page
         """)
    Flux<ResponseCouponDTO> findByCustomiserParams(
            @Param("ispartner") Boolean ispartner,
            @Param("page") Integer page,
            @Param("size") Integer size,
            @Param("search") String search,
            @Param("id_bus") Integer id_bus
    );

    @Query("""
            SELECT
                COUNT(*) AS total_records
            FROM bo_membership.subscription_coupons AS sc
            LEFT JOIN bo_account.user AS ua
            ON sc.id_user = ua.id
            WHERE (ua.name LIKE CONCAT('%', :search, '%')
                OR ua.lastname LIKE CONCAT('%', :search, '%')
                OR username LIKE CONCAT('%', :search, '%')
                OR coupon_code LIKE CONCAT('%', :search, '%'))
            AND CASE
                 WHEN :id_bus IS NOT NULL THEN sc.id_business = :id_bus
                 ELSE sc.id_business > 0
                END
            AND sc.is_partner = :ispartner
            AND sc.state = true
         """)
    Mono<ResponseCouponTotalDTO> findByCustomiserParamsAllPaginate(
            @Param("ispartner") Boolean ispartner,
            @Param("search") String search,
            @Param("id_bus") Integer id_bus
    );

}
