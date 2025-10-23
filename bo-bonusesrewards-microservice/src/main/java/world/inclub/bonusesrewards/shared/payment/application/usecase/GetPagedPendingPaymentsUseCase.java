package world.inclub.bonusesrewards.shared.payment.application.usecase;

import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentListView;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.time.Instant;

public interface GetPagedPendingPaymentsUseCase {

    Mono<PagedData<PaymentListView>> getPendingPayments(
            String member,
            BonusType bonusType,
            Instant paymentDate,
            Pageable pageable
    );
}
