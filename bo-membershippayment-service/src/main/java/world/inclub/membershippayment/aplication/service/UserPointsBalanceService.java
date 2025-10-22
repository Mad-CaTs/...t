package world.inclub.membershippayment.aplication.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.UserPointsBalance;
import world.inclub.membershippayment.infraestructure.repository.UserPointsBalanceRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserPointsBalanceService {

    private final UserPointsBalanceRepository repository;

    public Mono<UserPointsBalance> updateBalance(Integer idUser, Integer idFamily, int liberatedDelta) {
        return repository.findByIdUserAndIdFamily(idUser, idFamily)
            .switchIfEmpty(Mono.defer(() -> {
                UserPointsBalance newBalance = UserPointsBalance.builder()
                        .idUser(idUser)
                        .idFamily(idFamily)
                        .liberatedPoints(0)
                        .build();
                return repository.save(newBalance);
            }))
            .flatMap(balance -> {
                int newLiberated = (balance.getLiberatedPoints() != null ? balance.getLiberatedPoints() : 0) + liberatedDelta;
                balance.setLiberatedPoints(newLiberated);
                return repository.save(balance);
            });
    }

    public Mono<UserPointsBalance> getBalanceByUserAndFamily(Integer idUser, Integer idFamily) {
    return repository.findByIdUserAndIdFamily(idUser, idFamily)
        .switchIfEmpty(Mono.defer(() -> {
            UserPointsBalance newBalance = UserPointsBalance.builder()
                    .idUser(idUser)
                    .idFamily(idFamily)
                    .liberatedPoints(0)
                    .build();
            return repository.save(newBalance)
                .onErrorResume(DuplicateKeyException.class, ex ->
                    // Si se genera el error de clave duplicada, volvemos a consultar el registro
                    repository.findByIdUserAndIdFamily(idUser, idFamily)
                );
        }));
}
}
