package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.PaymentListViewEntity;

import java.time.LocalDateTime;
import java.util.UUID;

public interface PaymentListViewR2dbcRepository extends R2dbcRepository<PaymentListViewEntity, UUID> {

    @Query("""
            SELECT * FROM bo_bonus_reward.payments_list_view
            WHERE payment_status_id = 4
              AND (:member IS NULL OR username ILIKE CONCAT('%', :member, '%') OR member_full_name ILIKE CONCAT('%', :member, '%'))
              AND (:bonusTypeId IS NULL OR bonus_type_id = :bonusTypeId)
              AND (:paymentDate IS NULL OR DATE(payment_date) = DATE(:paymentDate))
            ORDER BY 
              CASE WHEN :asc = true THEN 
                CASE 
                  WHEN :sortBy = 'payment_id' THEN payment_id::text
                  WHEN :sortBy = 'username' THEN username
                  WHEN :sortBy = 'member_full_name' THEN member_full_name
                  WHEN :sortBy = 'payment_date' THEN payment_date::text
                  ELSE payment_date::text
                END
              END ASC,
              CASE WHEN :asc = false THEN 
                CASE 
                  WHEN :sortBy = 'payment_id' THEN payment_id::text
                  WHEN :sortBy = 'username' THEN username
                  WHEN :sortBy = 'member_full_name' THEN member_full_name
                  WHEN :sortBy = 'payment_date' THEN payment_date::text
                  ELSE payment_date::text
                END
              END DESC
            LIMIT :limit OFFSET :offset
            """)
    Flux<PaymentListViewEntity> findPendingPaymentsWithFilters(
            @Param("member") String member,
            @Param("bonusTypeId") Long bonusTypeId,
            @Param("paymentDate") LocalDateTime paymentDate,
            @Param("sortBy") String sortBy,
            @Param("asc") Boolean asc,
            @Param("limit") Integer limit,
            @Param("offset") Integer offset
    );

    @Query("""
            SELECT COUNT(*) FROM bo_bonus_reward.payments_list_view
            WHERE payment_status_id = 4
              AND (:member IS NULL OR username ILIKE CONCAT('%', :member, '%') OR member_full_name ILIKE CONCAT('%', :member, '%'))
              AND (:bonusTypeId IS NULL OR bonus_type_id = :bonusTypeId)
              AND (:paymentDate IS NULL OR DATE(payment_date) = DATE(:paymentDate))
            """)
    Mono<Long> countPendingPaymentsWithFilters(
            @Param("member") String member,
            @Param("bonusTypeId") Long bonusTypeId,
            @Param("paymentDate") LocalDateTime paymentDate
    );

    @Query("""
            SELECT * FROM bo_bonus_reward.payments_list_view
            WHERE payment_status_id = 4
              AND (:member IS NULL OR username ILIKE CONCAT('%', :member, '%') OR member_full_name ILIKE CONCAT('%', :member, '%'))
              AND (:bonusTypeId IS NULL OR bonus_type_id = :bonusTypeId)
              AND (:paymentDate IS NULL OR DATE(payment_date) = DATE(:paymentDate))
            ORDER BY payment_date DESC
            """)
    Flux<PaymentListViewEntity> findAllPendingPayments(
            @Param("member") String member,
            @Param("bonusTypeId") Long bonusTypeId,
            @Param("paymentDate") LocalDateTime paymentDate
    );
}
