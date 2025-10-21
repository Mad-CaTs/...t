package world.inclub.wallet.bankAccountWithdrawal.domain.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.AuditLogEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface AuditLogR2dbcRepository extends ReactiveCrudRepository<AuditLogEntity, Long> {
    Flux<AuditLogEntity> findByType(Integer type);


    @Query("""
        SELECT COUNT(*) 
        FROM bo_wallet.audit_log a
        WHERE (:type IS NULL OR a.type = :type)
          AND (:actionId IS NULL OR a.action_id = :actionId)
          AND (:createDate IS NULL OR a.createdate::date = :createDate::date)
    """)
    Mono<Long> countWithFilters(Integer type, LocalDateTime createDate, Long actionId);


    @Query("""
        SELECT a.*
        FROM bo_wallet.audit_log a
        WHERE (:type IS NULL OR a.type = :type)
          AND (:actionId IS NULL OR a.action_id = :actionId)
          AND (:createDate IS NULL OR a.createdate::date = :createDate::date)
        ORDER BY a.createdate DESC
        OFFSET :offset LIMIT :limit
    """)
    Flux<AuditLogEntity> findWithFilters(Integer type, LocalDateTime  createDate, Long actionId, int offset, int limit);
}
