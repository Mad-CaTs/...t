package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.TransferRejection;

public interface TransferRejectionRepository extends ReactiveCrudRepository<TransferRejection, Integer> {

    @Query("SELECT * FROM bo_transfer_liquidation.transfer_rejection ORDER BY id_transfer_rejection DESC")
    Flux<TransferRejection> findAllOrdered();

    @Query("INSERT INTO bo_transfer_liquidation.transfer_rejection (id_transfer_request, id_transfer_rejection_type, detail_rejection_transfer, rejected_transfer_at) VALUES (:idTransferRequest, :idType, :detail, now()) RETURNING *")
    Mono<TransferRejection> insertReturn(@Param("idTransferRequest") Integer idTransferRequest, @Param("idType") Integer idType, @Param("detail") String detail);
}
