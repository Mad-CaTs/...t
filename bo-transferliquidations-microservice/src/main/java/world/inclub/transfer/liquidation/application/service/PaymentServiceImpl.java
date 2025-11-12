package world.inclub.transfer.liquidation.application.service;

import org.springframework.data.relational.core.mapping.Column;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import world.inclub.transfer.liquidation.api.dtos.PaymentDto;
import world.inclub.transfer.liquidation.application.service.interfaces.IPaymentService;
import world.inclub.transfer.liquidation.domain.entity.Payment;
import world.inclub.transfer.liquidation.domain.port.IPaymentPort;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements IPaymentService {
    
    private final IPaymentPort iPaymentPort;

    @Override
    public Mono<Payment> savePayment(PaymentDto e) {
        Mono<Payment> resp = null;
        Payment p = new Payment();
        p.setIdPayment(e.getIdPayment());
        p.setIdSuscription(e.getIdSuscription());
        p.setQuoteDescription(e.getQuoteDescription());
        p.setNextExpiration(e.getNextExpiration());
        p.setDollarExchange(e.getDollarExchange());
        p.setQuotaUsd(e.getQuotaUsd());
        p.setPercentage(e.getPercentage());
        p.setStatePaymentId(e.getStatePaymentId());
        p.setObs(e.getObs());
        p.setPayDate(e.getPayDate());
        p.setPts(e.getPts());
        p.setIsQuoteInitial(e.getIsQuoteInitial());
        p.setPositionOnSchedule(e.getPositionOnSchedule());
        p.setNumberQuotePay(e.getNumberQuotePay());
        p.setAmortizationUsd(e.getAmortizationUsd());
        p.setCapitalBalanceUsd(e.getCapitalBalanceUsd());
        p.setTotalOverdue(e.getTotalOverdue());
        p.setPercentOverdueDetailId(e.getPercentOverdueDetailId());
        return this.getFindById(p.getIdPayment())
                .flatMap(o -> this.iPaymentPort.updatePayment(p.getIdPayment(), Mono.just(p)))
                .switchIfEmpty(this.iPaymentPort.savePayment(p));
    }

    @Override
    public Mono<Payment> getFindById(Integer id) {
        return iPaymentPort.getFindById(id);
    }

}
