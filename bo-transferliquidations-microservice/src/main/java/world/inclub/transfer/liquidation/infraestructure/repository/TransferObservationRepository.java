package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.TransferObservation;

public interface TransferObservationRepository extends ReactiveCrudRepository<TransferObservation, Integer> {

    @Query("SELECT * FROM bo_transfer_liquidation.transfer_observation ORDER BY id_observation_transfer DESC")
    Flux<TransferObservation> findAllOrdered();

    @Query("INSERT INTO bo_transfer_liquidation.transfer_observation (id_transfer_observation_type, detail_observation_transfer, observed_transfer_at, id_transfer_request) VALUES (:idType, :detail, now(), :idTransferRequest) RETURNING *")
    Mono<TransferObservation> insertReturn(@Param("idType") Integer idType, @Param("detail") String detail, @Param("idTransferRequest") Integer idTransferRequest);
}
