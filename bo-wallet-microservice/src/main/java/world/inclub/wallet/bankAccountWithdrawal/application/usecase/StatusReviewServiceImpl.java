package world.inclub.wallet.bankAccountWithdrawal.application.usecase;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import world.inclub.wallet.bankAccountWithdrawal.application.service.StatusReviewService;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.StatusReview;
import world.inclub.wallet.bankAccountWithdrawal.domain.port.StatusReviewPort;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatusReviewServiceImpl implements StatusReviewService {

    private final StatusReviewPort statusReviewPort;


    @Override
    public Flux<StatusReview> findAll() {
        return statusReviewPort.findAll();
    }
}
