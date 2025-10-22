package world.inclub.membershippayment.infraestructure.repository;


import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.TokenPayment;

@Repository
public interface TokenPaymentRepository extends ReactiveCrudRepository<TokenPayment, Long> {
    Mono<TokenPayment> findByCodTokenPayment(String codTokenPayment);
}