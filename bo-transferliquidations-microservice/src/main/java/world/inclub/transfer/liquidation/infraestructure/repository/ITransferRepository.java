package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Transfer;

import java.time.LocalDateTime;


public interface ITransferRepository extends ReactiveCrudRepository<Transfer,Long> {

    @Modifying
    @Query("UPDATE bo_transfer_liquidation.transfer SET idStatus = :idStatus, modificationDate = :modificationDate WHERE idTransfer = :idTransfer")
    Mono<Void> updateIdStatusById(@Param("idStatus") Integer idStatus, @Param("idTransfer") Integer idTransfer, @Param("modificationDate")LocalDateTime modificationDate);

}