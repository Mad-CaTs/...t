package world.inclub.wallet.infraestructure.persistence;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.wallet.domain.entity.Wallet;
import world.inclub.wallet.domain.port.IWalletPort;
import world.inclub.wallet.infraestructure.repository.IWalletRepository;
@Slf4j
@Repository
public class WalletRepositoryImpl implements IWalletPort {


    private final IWalletRepository iWalletRepository;

    public WalletRepositoryImpl (IWalletRepository iWalletRepository){
        this.iWalletRepository = iWalletRepository;
    }

    @Override
    public Flux<Wallet> getall() {
       return iWalletRepository.findAll();
    }

    @Override
    public Mono<Wallet> getWalletById(Long idWallet) {
        return iWalletRepository.findById(idWallet);
    }

    @Override
    public Mono<Wallet> getWalletByIdUser(int idUser) {
        
        return iWalletRepository.findByIdUser(idUser).onErrorResume(DataIntegrityViolationException.class, ex -> {
                    log.error("Database integrity violation while fetching wallet for user id {}: {}", idUser, ex.getMessage());
                    return Mono.error(new DataIntegrityViolationException("Database integrity violation", ex));
                });
    }

    @Override
    public Mono<Boolean> updateWallet(Wallet wallet) {
        return iWalletRepository.save(wallet)
                .map(savedTransaction -> savedTransaction != null)
                .defaultIfEmpty(false);
    }

    @Override
    public Mono<Boolean> createWalllet(Wallet wallet) {
        return iWalletRepository.save(wallet)
                .map(savedTransaction -> savedTransaction != null)
                .defaultIfEmpty(false).onErrorResume(DuplicateKeyException.class, e -> {
                    // Manejar la excepción de clave duplicada
                    return Mono.error(new RuntimeException("El iduser ya existe en la base de datos."));
                });
    }


}
