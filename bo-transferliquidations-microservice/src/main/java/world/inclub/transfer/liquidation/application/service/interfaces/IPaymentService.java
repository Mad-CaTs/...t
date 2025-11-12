package world.inclub.transfer.liquidation.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.PaymentDto;
import world.inclub.transfer.liquidation.domain.entity.Payment;

public interface IPaymentService {

    Mono<Payment> savePayment(PaymentDto entity);
    Mono<Payment> getFindById(Integer id);

}
