package world.inclub.membershippayment.migrationSuscription.application.service.interfaces;

import reactor.core.publisher.Mono;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.domain.entity.Suscription;

import java.util.List;

public interface IMigrateSuscriptionDataService {

    Mono<List<PaymentVoucher>> getAllPaymentVoucherByIdSuscription(Integer idSuscription);
    Mono<Suscription> getSuscriptionByIdSuscription(Long idSuscription);
    Mono<List<Payment>> getScheduleByidSuscription(Integer idSuscription);
}
