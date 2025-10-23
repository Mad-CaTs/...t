package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.adapter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentListView;
import world.inclub.bonusesrewards.shared.payment.domain.port.PaymentListViewRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper.PaymentListViewEntityMapper;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.repository.PaymentListViewR2dbcRepository;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Repository
@RequiredArgsConstructor
public class PaymentListViewRepositoryAdapter implements PaymentListViewRepositoryPort {

    private final PaymentListViewR2dbcRepository repository;
    private final PaymentListViewEntityMapper mapper;

    @Override
    public Flux<PaymentListView> findPendingPaymentsWithFilters(
            String member,
            BonusType bonusType,
            Instant paymentDate,
            Pageable pageable
    ) {
        Long bonusTypeId = bonusType != null ? bonusType.getId() : null;
        LocalDateTime localPaymentDate = paymentDate != null
                ? LocalDateTime.ofInstant(paymentDate, ZoneId.systemDefault())
                : null;

        int offset = pageable.page() * pageable.size();

        return repository.findPendingPaymentsWithFilters(
                        member,
                        bonusTypeId,
                        localPaymentDate,
                        pageable.sortBy(),
                        pageable.asc(),
                        pageable.size(),
                        offset
                )
                .map(mapper::toDomain);
    }

    @Override
    public Mono<Long> countPendingPaymentsWithFilters(
            String member,
            BonusType bonusType,
            Instant paymentDate
    ) {
        Long bonusTypeId = bonusType != null ? bonusType.getId() : null;
        LocalDateTime localPaymentDate = paymentDate != null
                ? LocalDateTime.ofInstant(paymentDate, ZoneId.systemDefault())
                : null;

        return repository.countPendingPaymentsWithFilters(
                member,
                bonusTypeId,
                localPaymentDate
        );
    }

    @Override
    public Flux<PaymentListView> findAllPendingPayments(
            String member,
            BonusType bonusType,
            Instant paymentDate
    ) {
        Long bonusTypeId = bonusType != null ? bonusType.getId() : null;
        LocalDateTime localPaymentDate = paymentDate != null
                ? LocalDateTime.ofInstant(paymentDate, ZoneId.systemDefault())
                : null;

        return repository.findAllPendingPayments(
                        member,
                        bonusTypeId,
                        localPaymentDate
                )
                .map(mapper::toDomain);
    }
}
