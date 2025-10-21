package world.inclub.wallet.bankAccountWithdrawal.domain.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.StatusReview;

public interface StatusReviewRepository extends ReactiveCrudRepository<StatusReview,Long> {


}
