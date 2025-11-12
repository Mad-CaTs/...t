package world.inclub.transfer.liquidation.infraestructure.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import world.inclub.transfer.liquidation.domain.entity.TypeTransfer;


public interface ITypeTransferRepository extends ReactiveCrudRepository<TypeTransfer,Long> {

}
