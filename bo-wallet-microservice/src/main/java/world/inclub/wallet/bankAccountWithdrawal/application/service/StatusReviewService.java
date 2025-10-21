package world.inclub.wallet.bankAccountWithdrawal.application.service;

import reactor.core.publisher.Flux;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.StatusReview;

public interface StatusReviewService {
    Flux<StatusReview> findAll();
}
