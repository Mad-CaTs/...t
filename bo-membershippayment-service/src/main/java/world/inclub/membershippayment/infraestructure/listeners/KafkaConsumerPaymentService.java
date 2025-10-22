package world.inclub.membershippayment.infraestructure.listeners;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import world.inclub.membershippayment.aplication.dao.PaymentDao;
import world.inclub.membershippayment.aplication.service.mapper.MembershipToAdminPanelMapper;
import world.inclub.membershippayment.domain.dto.PaymentDTO;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;

@Slf4j
@Service
public class KafkaConsumerPaymentService {

    @Autowired
    private PaymentDao paymentDao;

    @KafkaListener(topics = KafkaConstants.Topic.TOPIC_PAYMENT, groupId = KafkaConstants.GROUP_ID, containerFactory = "paymentKafkaListenerContainerFactory")
    public void consume(PaymentDTO paymentDTO) {

        paymentDao.getPaymentById((long) paymentDTO.getIdPayment())
                .flatMap(existingPayment -> {
                    // Si el pago ya existe en la base de datos, actualiza los datos
                    existingPayment.setIdSuscription(paymentDTO.getIdSuscription());
                    existingPayment.setQuoteDescription(paymentDTO.getQuoteDescription());
                    existingPayment.setNextExpirationDate(paymentDTO.getNextExpiration());
                    existingPayment.setDollarExchange(paymentDTO.getDollarExchange());
                    existingPayment.setQuoteUsd(paymentDTO.getQuotaUsd());
                    existingPayment.setPercentage(paymentDTO.getPercentage());
                    existingPayment.setIdStatePayment(paymentDTO.getStatePaymentId());
                    existingPayment.setObs(paymentDTO.getObs());
                    existingPayment.setPayDate(paymentDTO.getPayDate());
                    existingPayment.setPts(paymentDTO.getPts());
                    existingPayment.setIsInitialQuote(paymentDTO.getIsQuoteInitial());
                    existingPayment.setPositionOnSchedule(paymentDTO.getPositionOnSchedule());
                    existingPayment.setNumberQuotePay(paymentDTO.getNumberQuotePay());
                    existingPayment.setAmortizationUsd(paymentDTO.getAmortizationUsd());
                    existingPayment.setCapitalBalanceUsd(paymentDTO.getCapitalBalanceUsd());
                    existingPayment.setTotalOverdue(paymentDTO.getTotalOverdue());
                    existingPayment.setIdPercentOverduedetail(paymentDTO.getPercentOverdueDetailId());
                    return paymentDao.putPayment(existingPayment);
                })
                .switchIfEmpty(paymentDao.putPaymentWithId(MembershipToAdminPanelMapper.mapToPayment(paymentDTO)))
                .subscribe(null, error -> {
                    // Maneja la excepción aquí
                    System.err.println("Error: " + error.getMessage());
                });

    }

}
