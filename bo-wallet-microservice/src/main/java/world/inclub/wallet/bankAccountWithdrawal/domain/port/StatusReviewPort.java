package world.inclub.wallet.bankAccountWithdrawal.domain.port;

import reactor.core.publisher.Flux;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.StatusReview;

public interface StatusReviewPort {
    Flux<StatusReview> findAll();
}
