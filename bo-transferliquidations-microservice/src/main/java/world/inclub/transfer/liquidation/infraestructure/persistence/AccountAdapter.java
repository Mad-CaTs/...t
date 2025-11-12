package world.inclub.transfer.liquidation.infraestructure.persistence;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.infraestructure.repository.AccountRepository;
import world.inclub.transfer.liquidation.infraestructure.repository.UserRepository;
import world.inclub.transfer.liquidation.domain.entity.Account;
import world.inclub.transfer.liquidation.domain.port.AccountPort;

@Component
@RequiredArgsConstructor
@Slf4j
public class AccountAdapter implements AccountPort {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Override
    public Mono<Account> findById(Integer id) {
        return userRepository.findById(id)
                .map(user -> new Account(user.getId(), user.getUsername(), user.getName(), user.getLastName()))
                .switchIfEmpty(
                        accountRepository.findOneById(id)
                                .onErrorResume(DataAccessException.class, ex -> {
                                    log.debug("AccountRepository.findOneById falló: {}", ex.getMessage());
                                    return Mono.empty();
                                })
                );
    }

    @Override
    public Mono<Account> findByUsername(String username) {
        if (username == null) return Mono.empty();

        String normalized = username.trim();

        java.util.function.Function<String, Mono<Account>> tryLookup = (uname) ->
                userRepository.findByUsername(uname)
                        .map(user -> new Account(user.getId(), user.getUsername(), user.getName(), user.getLastName()))
                        .switchIfEmpty(
                                accountRepository.findOneByUsername(uname)
                                        .onErrorResume(DataAccessException.class, ex -> {
                                            log.debug("AccountRepository.findOneByUsername falló para {}: {}", uname, ex.getMessage());
                                            return Mono.empty();
                                        })
                        );

        Mono<Account> result = tryLookup.apply(normalized)
                .switchIfEmpty(Mono.defer(() -> tryLookup.apply(normalized.toLowerCase())))
                .switchIfEmpty(Mono.defer(() -> {
                    int at = normalized.indexOf('@');
                    if (at > 0) {
                        String prefix = normalized.substring(0, at);
                        return tryLookup.apply(prefix);
                    }
                    return Mono.empty();
                }))
                .doOnNext(acc -> log.debug("Account found for username lookup '{}': id={}, username={}", username, acc.getId(), acc.getUsername()))
                .doOnSubscribe(s -> log.debug("Looking up Account for username '{}'", username));

        return result;
    }
}
