package world.inclub.bonusesrewards.shared.payment.application.usecase;

import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentListView;

import java.time.Instant;

public interface ListAllPendingPaymentsUseCase {

    Flux<PaymentListView> getAllPendingPayments(
            String member,
            BonusType bonusType,
            Instant paymentDate
    );
}
