package world.inclub.membershippayment.migrationSuscription.application.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.PaymentDao;
import world.inclub.membershippayment.aplication.dao.PaymentVoucherDao;
import world.inclub.membershippayment.aplication.dao.SuscriptionDao;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.migrationSuscription.application.service.interfaces.IMigrateSuscriptionDataService;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MigreteSuscritptionDataService implements IMigrateSuscriptionDataService {

    private final PaymentVoucherDao paymentVoucherDao;
    private final SuscriptionDao suscriptionDao;
    private final PaymentDao paymentDao;


    @Override
    public Mono<List<PaymentVoucher>> getAllPaymentVoucherByIdSuscription(Integer idSuscription) {
        return paymentVoucherDao.getPaymentVoucherByIdSuscription(idSuscription).collectList();
    }

    @Override
    public Mono<Suscription> getSuscriptionByIdSuscription(Long idSuscription) {
        return  suscriptionDao.getSuscriptionById(idSuscription);
    }

    @Override
    public Mono<List<Payment>> getScheduleByidSuscription(Integer idSuscription) {
        return paymentDao.getAllPaymentsByIdSubscription(idSuscription).collectList();
    }


}
