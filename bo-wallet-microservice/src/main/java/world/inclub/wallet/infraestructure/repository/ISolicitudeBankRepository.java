package world.inclub.wallet.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.r2dbc.core.DatabaseClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.AccountBank;
import world.inclub.wallet.domain.entity.Solicitudebank;
import world.inclub.wallet.infraestructure.kafka.dtos.response.SolicitudeBankDto;

import java.util.List;

public interface ISolicitudeBankRepository extends ReactiveCrudRepository<Solicitudebank, Long> {


    @Query("""
    SELECT sb.*, sr.description AS review_status_description
    FROM bo_wallet.solicitudebank sb
    LEFT JOIN bo_wallet.status_review sr
        ON sb.review_status_id = sr.id
    WHERE sb.status IN(0,1,2)
      AND (:ids IS NULL OR sb.idbankstatus = ANY(:ids))
    ORDER BY sb.fechSolicitud DESC
    """)
Flux<SolicitudeBankDto> findByIdUserByStatusPending(@Param("ids") Integer[] ids);
    @Query("""
            SELECT sb.*, sr.description as review_status_description
            FROM bo_wallet.solicitudebank sb
            LEFT JOIN bo_wallet.status_review sr 
                ON sb.review_status_id = sr.id
            WHERE sb.status != 1 OR sb.idbankstatus != 1
            ORDER BY sb.fechSolicitud DESC
            """)
     Flux<SolicitudeBankDto> findByIdUserByStatusVerificado();

    @Query("""
            UPDATE bo_wallet.solicitudebank 
            SET idbankstatus = :status
            WHERE idsolicitudebank = :id
            """)
    Mono<Void> updateBankStatus(Long id, Integer status);

    @Query("""
        UPDATE bo_wallet.solicitudebank
        SET idbankstatus = :bankStatus,
            review_status_id = :reviewStatus
        WHERE idsolicitudebank = :id
        """)
    Mono<Void> updateBankStatusAndReview(Long id, Integer bankStatus, Integer reviewStatus);

}
