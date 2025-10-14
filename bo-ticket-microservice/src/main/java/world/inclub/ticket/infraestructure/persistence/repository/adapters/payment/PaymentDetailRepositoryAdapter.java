package world.inclub.ticket.infraestructure.persistence.repository.adapters.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.ticket.domain.model.payment.PaymentDetail;
import world.inclub.ticket.domain.ports.payment.PaymentDetailRepositoryPort;
import world.inclub.ticket.infraestructure.persistence.entity.payment.PaymentDetailEntity;
import world.inclub.ticket.infraestructure.persistence.mapper.payment.PaymentDetailEntityMapper;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.payment.R2dbcPaymentDetailRepository;

import java.util.Collection;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class PaymentDetailRepositoryAdapter implements PaymentDetailRepositoryPort {

    private final R2dbcPaymentDetailRepository detailRepository;
    private final PaymentDetailEntityMapper paymentDetailEntityMapper;

    @Override
    public Flux<PaymentDetail> saveAll(Collection<PaymentDetail> details) {
        List<PaymentDetailEntity> detailEntities = details.stream()
                .map(paymentDetailEntityMapper::toEntity)
                .toList();
        return detailRepository.saveAll(detailEntities)
                .map(paymentDetailEntityMapper::toDomain);
    }

}
