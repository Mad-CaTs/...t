package world.inclub.transfer.liquidation.domain.port;

import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.Payment;

public interface IPaymentPort {

	public Mono<Payment> savePayment(Payment entity);
	public Mono<Payment> updatePayment(int paymentId, final Mono<Payment> paymentMono);
	public Mono<Payment>
	getFindById(Integer id);

	Flux<Payment> findByIdsuscription(Integer idsuscription);
}
