package world.inclub.membershippayment.aplication.dao.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import world.inclub.membershippayment.aplication.dao.PaymentSuscriptionDao;
import world.inclub.membershippayment.domain.dto.response.RejectedSuscriptionResponse;
import world.inclub.membershippayment.infraestructure.repository.ISuscriptionRejectionRepository;

import java.time.LocalDateTime;

@Repository("PaymentSuscriptionDao")
@RequiredArgsConstructor
@Slf4j
public class IPaymentSuscriptionDao implements PaymentSuscriptionDao {

    private final ISuscriptionRejectionRepository iSuscriptionRejectionRepository;

    @Override
    public Flux<RejectedSuscriptionResponse> gelAllSucriptionsPayment(LocalDateTime finit, LocalDateTime ffinal) {
        return iSuscriptionRejectionRepository.getAllPaymentSuscriptions(finit, ffinal);
    }
}
