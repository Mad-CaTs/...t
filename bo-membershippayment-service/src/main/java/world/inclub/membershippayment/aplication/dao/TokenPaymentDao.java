package world.inclub.membershippayment.aplication.dao;

import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.TokenPayment;

public interface TokenPaymentDao {
    Mono<TokenPayment> postTokenPayment(TokenPayment tokenPayment);
    Mono<TokenPayment> getByCodTokenPayment(String codTokenPayment);
}
