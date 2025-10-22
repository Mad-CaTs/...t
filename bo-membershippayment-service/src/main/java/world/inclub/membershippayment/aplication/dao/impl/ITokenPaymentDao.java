package world.inclub.membershippayment.aplication.dao.impl;

import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.TokenPaymentDao;
import world.inclub.membershippayment.domain.entity.TokenPayment;
import world.inclub.membershippayment.infraestructure.repository.TokenPaymentRepository;

@Repository("tokenPayment")
public class ITokenPaymentDao implements TokenPaymentDao {
    private final TokenPaymentRepository tokenPaymentRepository;

    public ITokenPaymentDao(TokenPaymentRepository tokenPaymentRepository) {
        this.tokenPaymentRepository = tokenPaymentRepository;
    }


    @Override
    public Mono<TokenPayment> postTokenPayment(TokenPayment tokenPayment) {

        return tokenPaymentRepository.save(tokenPayment);
    }

    @Override
    public Mono<TokenPayment> getByCodTokenPayment(String codTokenPayment) {
        return tokenPaymentRepository.findByCodTokenPayment(codTokenPayment);
    }
}
