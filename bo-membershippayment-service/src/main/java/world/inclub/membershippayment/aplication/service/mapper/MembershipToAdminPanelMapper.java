package world.inclub.membershippayment.aplication.service.mapper;

import java.time.LocalDateTime;

import world.inclub.membershippayment.domain.dto.PaymentDTO;
import world.inclub.membershippayment.domain.dto.PaymentVoucherDTO;
import world.inclub.membershippayment.domain.dto.SuscriptionDTO;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.domain.entity.Suscription;

public class MembershipToAdminPanelMapper {

    public static PaymentDTO mapToPaymentDTO(Payment payment) {
        
        LocalDateTime fecha1 = payment.getNextExpirationDate();
        LocalDateTime fecha2 = payment.getPayDate();

        PaymentDTO paymentDTO = new PaymentDTO();
        paymentDTO.setIdPayment(payment.getIdPayment().intValue());
        paymentDTO.setIdSuscription(payment.getIdSuscription().intValue());
        paymentDTO.setQuoteDescription(payment.getQuoteDescription());
        paymentDTO.setNextExpiration(fecha1);
        paymentDTO.setDollarExchange(payment.getDollarExchange());
        paymentDTO.setQuotaUsd(payment.getQuoteUsd());
        paymentDTO.setPercentage(payment.getPercentage());
        paymentDTO.setStatePaymentId(payment.getIdStatePayment());
        paymentDTO.setObs(payment.getObs());
        paymentDTO.setPayDate(fecha2);
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

    public static Payment mapToPayment(PaymentDTO paymentDTO) {

        Payment payment = new Payment();
        
        payment.setIdPayment(Long.valueOf(paymentDTO.getIdPayment()));
        payment.setIdSuscription(paymentDTO.getIdSuscription());
        payment.setQuoteDescription(paymentDTO.getQuoteDescription());
        payment.setNextExpirationDate(paymentDTO.getNextExpiration());
        payment.setDollarExchange(paymentDTO.getDollarExchange());
        payment.setQuoteUsd(paymentDTO.getQuotaUsd());
        payment.setPercentage(paymentDTO.getPercentage());
        payment.setIdStatePayment(paymentDTO.getStatePaymentId());
        payment.setObs(paymentDTO.getObs());
        payment.setPayDate(paymentDTO.getPayDate());
        payment.setPts(paymentDTO.getPts());
        payment.setIsInitialQuote(paymentDTO.getIsQuoteInitial());
        payment.setPositionOnSchedule(paymentDTO.getPositionOnSchedule());
        payment.setNumberQuotePay(paymentDTO.getNumberQuotePay());
        payment.setAmortizationUsd(paymentDTO.getAmortizationUsd());
        payment.setCapitalBalanceUsd(paymentDTO.getCapitalBalanceUsd());
        payment.setTotalOverdue(paymentDTO.getTotalOverdue());
    
        if (paymentDTO.getPercentOverdueDetailId() != 0) {
            payment.setIdPercentOverduedetail(paymentDTO.getPercentOverdueDetailId());
        } else {
            payment.setIdPercentOverduedetail(null);
        }
    
        return payment;
    }
    
    

    public static SuscriptionDTO mapToSuscriptionDTO(Suscription suscription) {

        SuscriptionDTO suscriptionDTO = new SuscriptionDTO();
        suscriptionDTO.setIdSuscription(suscription.getIdSuscription().intValue());
        suscriptionDTO.setIdUser(suscription.getIdUser());
        suscriptionDTO.setCreationDate(suscription.getCreationDate());
        suscriptionDTO.setStatus(suscription.getStatus());
        suscriptionDTO.setModificationDate(suscription.getModificationDate());
        suscriptionDTO.setBoolmigration(suscription.getIsMigrated());
        suscriptionDTO.setPackageDetailId(suscription.getIdPackageDetail());
        suscriptionDTO.setIdPackage(suscription.getIdPackage());
        suscriptionDTO.setNextExpiration(suscription.getNextExpirationDate());
        return suscriptionDTO;
    }

    public static PaymentVoucherDTO mapPaymentVoucherDTO(PaymentVoucher paymentVoucher) {

        PaymentVoucherDTO paymentVoucherDTO = new PaymentVoucherDTO();
        paymentVoucherDTO.setIdPaymentVoucher(paymentVoucher.getIdPaymentVoucher().intValue());
        paymentVoucherDTO.setPaymentId(paymentVoucher.getIdPayment());
        paymentVoucherDTO.setSuscriptionId(paymentVoucher.getIdSuscription());
        paymentVoucherDTO.setPathPicture(paymentVoucher.getPathPicture());
        paymentVoucherDTO.setOperationNumber(paymentVoucher.getOperationNumber());
        paymentVoucherDTO.setMethodPaymentSubTypeId(paymentVoucher.getIdMethodPaymentSubType());
        paymentVoucherDTO.setNote(paymentVoucher.getNote());
        paymentVoucherDTO.setPaymentCoinCurrencyId(paymentVoucher.getIdPaymentCoinCurrency());
        paymentVoucherDTO.setSubTotalAmount(paymentVoucher.getSubTotalAmount());
        paymentVoucherDTO.setComissionPaymentSubType(paymentVoucher.getCommissionPaymentSubType());
        paymentVoucherDTO.setTotalAmount(paymentVoucher.getTotalAmount());
        paymentVoucherDTO.setCreationDate(paymentVoucher.getCreationDate());
        paymentVoucherDTO.setCompanyOperationNumber(paymentVoucher.getCompanyOperationNumber());
        return paymentVoucherDTO;
    }

}
