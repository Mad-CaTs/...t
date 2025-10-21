package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentDocumentSummaryViewEntity;

import java.util.UUID;

public interface CarAssignmentDocumentSummaryR2dbcRepository
        extends R2dbcRepository<CarAssignmentDocumentSummaryViewEntity, UUID> {

    @Query("""
            SELECT * FROM bo_bonus_reward.car_assignment_documents_summary_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
              AND (:rankId IS NULL OR member_rank_id = :rankId)
              AND (:documentCount IS NULL OR total_documents >= :documentCount)
            ORDER BY last_document_updated_at DESC
            LIMIT :limit OFFSET :offset
            """)
    Flux<CarAssignmentDocumentSummaryViewEntity> findWithFilters(
            @Param("member") String member,
            @Param("rankId") Long rankId,
            @Param("documentCount") Integer documentCount,
            @Param("limit") Integer limit,
            @Param("offset") Integer offset
    );

    @Query("""
            SELECT COUNT(*) FROM bo_bonus_reward.car_assignment_documents_summary_view
            WHERE (:member IS NULL OR LOWER(CONCAT(member_full_name, ' ', username)) LIKE LOWER(CONCAT('%', :member, '%')))
              AND (:rankId IS NULL OR member_rank_id = :rankId)
              AND (:documentCount IS NULL OR total_documents >= :documentCount)
            """)
    Mono<Long> countWithFilters(
            @Param("member") String member,
            @Param("rankId") Long rankId,
            @Param("documentCount") Integer documentCount
    );

}