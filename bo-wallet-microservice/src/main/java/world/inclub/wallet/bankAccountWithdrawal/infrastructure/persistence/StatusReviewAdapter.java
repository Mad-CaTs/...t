package world.inclub.wallet.bankAccountWithdrawal.infrastructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.StatusReview;
import world.inclub.wallet.bankAccountWithdrawal.domain.port.StatusReviewPort;
import world.inclub.wallet.bankAccountWithdrawal.domain.repository.StatusReviewRepository;

@Repository
@RequiredArgsConstructor
public class StatusReviewAdapter implements StatusReviewPort {

    private final StatusReviewRepository statusReviewRepository;

    @Override
    public Flux<StatusReview> findAll() {
        return statusReviewRepository.findAll();
    }
}
