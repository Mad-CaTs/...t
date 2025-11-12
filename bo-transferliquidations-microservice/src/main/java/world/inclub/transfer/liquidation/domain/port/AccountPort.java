package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.domain.entity.Account;

/**
 * Puerto del dominio para acceder a cuentas de forma reactiva.
 */
public interface AccountPort {

    /**
     * Busca una cuenta por su identificador.
     *
     * @param id identificador de la cuenta
     * @return un {@link Mono} que emite la cuenta si existe, o completa vacío si no la encuentra
     */
    Mono<Account> findById(Integer id);

    /**
     * Busca una cuenta por su nombre de usuario.
     *
     * @param username nombre de usuario
     * @return un {@link Mono} que emite la cuenta si existe, o completa vacío si no la encuentra
     */
    Mono<Account> findByUsername(String username);
}
