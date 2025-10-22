package world.inclub.membershippayment.crosscutting.utils.mappers;

import world.inclub.membershippayment.domain.dto.PaymentDTO;
import world.inclub.membershippayment.domain.entity.Payment;

public class PaymentToPaymentDTOMapper {

    public PaymentDTO map(Payment payment) {
        PaymentDTO paymentDTO = new PaymentDTO();

        paymentDTO.setIdPayment(payment.getIdPayment().intValue());
        paymentDTO.setIdSuscription(payment.getIdSuscription().intValue());
        paymentDTO.setQuoteDescription(payment.getQuoteDescription());
        paymentDTO.setNextExpiration(payment.getNextExpirationDate());
        paymentDTO.setDollarExchange(payment.getDollarExchange());
        paymentDTO.setQuotaUsd(payment.getQuoteUsd());
        paymentDTO.setPercentage(payment.getPercentage());
        paymentDTO.setStatePaymentId(payment.getIdStatePayment());
        paymentDTO.setObs(payment.getObs());
        paymentDTO.setPayDate(payment.getPayDate());
        paymentDTO.setPts(payment.getPts());
        paymentDTO.setIsQuoteInitial(payment.getIsInitialQuote().intValue());
        paymentDTO.setPositionOnSchedule(payment.getPositionOnSchedule().intValue());
        paymentDTO.setNumberQuotePay(payment.getNumberQuotePay().intValue());
        paymentDTO.setAmortizationUsd(payment.getAmortizationUsd());
        paymentDTO.setCapitalBalanceUsd(payment.getCapitalBalanceUsd());
        paymentDTO.setTotalOverdue(payment.getTotalOverdue());
        if (payment.getIdPercentOverduedetail() != null) {
            paymentDTO.setPercentOverdueDetailId(payment.getIdPercentOverduedetail().intValue());
        } else {
            paymentDTO.setPercentOverdueDetailId(0);
        }

        return paymentDTO;
    }
}