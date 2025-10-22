package world.inclub.membershippayment.aplication.dao;

import reactor.core.publisher.Flux;
import world.inclub.membershippayment.domain.dto.response.RejectedSuscriptionResponse;

import java.time.LocalDateTime;

public interface PaymentSuscriptionDao {

    Flux<RejectedSuscriptionResponse> gelAllSucriptionsPayment(LocalDateTime i, LocalDateTime f);
}
