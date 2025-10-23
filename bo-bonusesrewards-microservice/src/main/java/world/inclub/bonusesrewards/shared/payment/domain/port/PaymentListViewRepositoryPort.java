package world.inclub.bonusesrewards.shared.payment.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentListView;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.time.Instant;

public interface PaymentListViewRepositoryPort {

    Flux<PaymentListView> findPendingPaymentsWithFilters(
            String member,
            BonusType bonusType,
            Instant paymentDate,
            Pageable pageable
    );

    Mono<Long> countPendingPaymentsWithFilters(
            String member,
            BonusType bonusType,
            Instant paymentDate
    );

    Flux<PaymentListView> findAllPendingPayments(
            String member,
            BonusType bonusType,
            Instant paymentDate
    );
}
