package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Account;

public interface IAcountService {

    Mono<Account> getAccountById(Integer id); //Busca una cuenta por su ID, emite la cuenta o vacío

    Mono<Account> getAccountByUsername(String username); //Busca una cuenta por su nombre de usuario

    Mono<Account> findSponsorByParentId(Integer parentId); //Obtiene el sponsor usando el ID del padre

    Mono<Account> findSponsorByUsername(String username); //Obtiene el sponsor usando su username

    Mono<Account> resolveSponsor(Integer transferType, Integer idUser, String sponsorUsername); 

    Mono<Account> resolveSponsor(Integer transferType, Integer idUser, String sponsorUsername, Integer sponsorId);
}
