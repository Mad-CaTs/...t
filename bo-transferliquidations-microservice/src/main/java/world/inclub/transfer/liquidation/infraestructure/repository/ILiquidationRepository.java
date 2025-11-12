package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Liquidation;

import java.time.LocalDateTime;


public interface ILiquidationRepository extends ReactiveCrudRepository<Liquidation,Long> {

    @Modifying
    @Query("UPDATE bo_transfer_liquidation.liquidation SET idStatus = :idStatus, modificationDate = :modificationDate WHERE idLiquidation = :idLiquidation")
    Mono<Void> updateIdStatusById(@Param("idStatus") Integer idStatus, @Param("idLiquidation") Integer idLiquidation, @Param("modificationDate") LocalDateTime modificationDate);

}
