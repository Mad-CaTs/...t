package world.inclub.wallet.infraestructure.persistence;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.TypeWalletTransaction;
import world.inclub.wallet.domain.port.ITypeWalletTransactionPort;
import world.inclub.wallet.infraestructure.repository.ITypeWalletTransactionRepository;

import java.util.List;

@Slf4j
@Repository
public class TypeWalletTransactionResitoryImpl implements ITypeWalletTransactionPort {

     private final ITypeWalletTransactionRepository iTypeWalletTransactionRepository;

    public TypeWalletTransactionResitoryImpl( ITypeWalletTransactionRepository iTypeWalletTransactionRepository) {
        this.iTypeWalletTransactionRepository = iTypeWalletTransactionRepository;
    }

    @Override
    public Mono<TypeWalletTransaction> geTypeWalletTransactionByIdUser(int idTypeWalletTransaction) {
        
        return iTypeWalletTransactionRepository.findById(idTypeWalletTransaction);
    }

    @Override
    public Flux<TypeWalletTransaction> listTypeWalletTransactionByIds(List<Integer> typeBonusIds) {
        return iTypeWalletTransactionRepository.listTypeWalletTransactionByIds(typeBonusIds);
    }

    @Override
    public Flux<TypeWalletTransaction> findAllByIds(List<Integer> ids) {
        log.info("Buscando descripciones para ids: {}", ids);
        return iTypeWalletTransactionRepository.findAllByIdTypeWalletTransactionIn(ids);
    }

}
