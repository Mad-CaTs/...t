package world.inclub.transfer.liquidation.infraestructure.persistence;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import world.inclub.transfer.liquidation.domain.entity.Payment;
import world.inclub.transfer.liquidation.domain.port.IPaymentPort;
import world.inclub.transfer.liquidation.infraestructure.repository.IPaymentRepository;

@Repository
@RequiredArgsConstructor
public class PaymentRepositoryImpl  implements IPaymentPort {
    
    private final IPaymentRepository iRepository;
    
    @Override
    public Mono<Payment> savePayment(Payment entity) {
        return iRepository.save(entity);
    }

    public Mono<Payment> updatePayment(int paymentId, final Mono<Payment> paymentMono){
        return this.iRepository.findById((long) paymentId)
                .flatMap(p -> paymentMono.map(u -> {
                    p.setIdSuscription(u.getIdSuscription());
                    p.setQuoteDescription(u.getQuoteDescription());
                    p.setNextExpiration(u.getNextExpiration());
                    p.setDollarExchange(u.getDollarExchange());
                    p.setQuotaUsd(u.getQuotaUsd());
                    p.setPercentage(u.getPercentage());
                    p.setStatePaymentId(u.getStatePaymentId());
                    p.setObs(u.getObs());
                    p.setPayDate(u.getPayDate());
                    p.setPts(u.getPts());
                    p.setIsQuoteInitial(u.getIsQuoteInitial());
                    p.setPositionOnSchedule(u.getPositionOnSchedule());
                    p.setNumberQuotePay(u.getNumberQuotePay());
                    p.setAmortizationUsd(u.getAmortizationUsd());
                    p.setCapitalBalanceUsd(u.getCapitalBalanceUsd());
                    p.setTotalOverdue(u.getTotalOverdue());
                    p.setPercentOverdueDetailId(u.getPercentOverdueDetailId());
                    return p;
                }))
                .flatMap(p -> this.iRepository.save(p));
    }

    @Override
    public Mono<Payment> getFindById(Integer id) {
        return iRepository.getFindById(id);
    }

    @Override
    public Flux<Payment> findByIdsuscription(Integer idsuscription) {
        return iRepository.findByIdsuscription(idsuscription);
    }

}
