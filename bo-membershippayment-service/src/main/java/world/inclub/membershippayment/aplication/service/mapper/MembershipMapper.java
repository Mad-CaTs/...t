package world.inclub.membershippayment.aplication.service.mapper;

import lombok.extern.slf4j.Slf4j;
import world.inclub.membershippayment.crosscutting.utils.ConstantFields.RegisterType;
import world.inclub.membershippayment.crosscutting.utils.TimeLima;
import world.inclub.membershippayment.domain.dto.response.MultiCodeSubscriptionResponse;
import world.inclub.membershippayment.domain.dto.response.PaymentPayResponseDTO;
import world.inclub.membershippayment.domain.dto.response.PaymentVoucherResponse;
import world.inclub.membershippayment.domain.dto.response.SuscriptionPayResponse;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.domain.enums.State;
import world.inclub.membershippayment.domain.enums.SubTypeMethodPayment;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDTO;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PercentOverdueDetail;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class MembershipMapper {

    public static SuscriptionPayResponse mapToSuscriptionPayResponse(Suscription suscription, PackageDTO packageData) {

        SuscriptionPayResponse result = new SuscriptionPayResponse();

        result.setId(suscription.getIdSuscription());
        result.setIdFamilyPackage(packageData.getIdFamilyPackage());
        result.setFamilyPackageName(packageData.getFamily().getName());
        result.setNameSuscription(packageData.getName());
        result.setVolumen(packageData.getPackageDetail().get(0).getVolume());
        result.setVolumenByFee(packageData.getPackageDetail().get(0).getVolumeByFee());
        result.setVolumenRibera(packageData.getPackageDetail().get(0).getVolumeRibera());
        result.setIdUser(suscription.getIdUser());
        result.setCreationDate(suscription.getCreationDate());
        result.setStatus(State.getNameByValue(suscription.getStatus()));
        result.setIdStatus(suscription.getStatus());
        result.setModificationDate(suscription.getModificationDate());
        result.setIdPackageDetail(suscription.getIdPackageDetail());
        result.setIdPackage(packageData.getIdPackage());
        result.setNumberQuotas(packageData.getPackageDetail().get(0).getNumberQuotas());
        result.setIdGracePeriodParameter(suscription.getIdGracePeriodParameter());

        return result;
    }

    public static PaymentPayResponseDTO mapToPaymentPayResponseDTO(Payment payment, PackageDTO pack, PercentOverdueDetail percentOverdueDetail) {
        PaymentPayResponseDTO paymentPayResponseDTO = new PaymentPayResponseDTO();

        paymentPayResponseDTO.setIdPayment(payment.getIdPayment());
        paymentPayResponseDTO.setIdSuscription(payment.getIdSuscription());
        paymentPayResponseDTO.setQuoteDescription(payment.getQuoteDescription());
        paymentPayResponseDTO.setNextExpirationDate(payment.getNextExpirationDate());
        paymentPayResponseDTO.setDollarExchange(payment.getDollarExchange());
        paymentPayResponseDTO.setQuoteUsd(payment.getQuoteUsd());
        paymentPayResponseDTO.setPercentage(payment.getPercentage());
        paymentPayResponseDTO.setIdStatePayment(payment.getIdStatePayment());
        paymentPayResponseDTO.setObs(payment.getObs());
        paymentPayResponseDTO.setIdStatePayment(payment.getIdStatePayment());
        paymentPayResponseDTO.setStatusName(State.getNameByValue(payment.getIdStatePayment()));
        paymentPayResponseDTO.setPayDate(payment.getPayDate());
        paymentPayResponseDTO.setPts(payment.getPts());
        paymentPayResponseDTO.setIsInitialQuote(payment.getIsInitialQuote());
        paymentPayResponseDTO.setPositionOnSchedule(payment.getPositionOnSchedule());
        paymentPayResponseDTO.setNumberQuotePay(payment.getNumberQuotePay());
        paymentPayResponseDTO.setAmortizationUsd(payment.getAmortizationUsd());
        paymentPayResponseDTO.setCapitalBalanceUsd(payment.getCapitalBalanceUsd());
        paymentPayResponseDTO.setTotalOverdue(payment.getTotalOverdue());
        paymentPayResponseDTO.setIdPercentOverduedetail(payment.getIdPercentOverduedetail());
        paymentPayResponseDTO.setIdPackage(pack.getIdPackage());
        paymentPayResponseDTO.setNameSuscription(pack.getName());

        BigDecimal total = payment.getQuoteUsd();
        boolean isPayed = payment.getIdStatePayment() != 0;
        paymentPayResponseDTO.setPayed(isPayed);

        if (payment.getNextExpirationDate().isAfter(TimeLima.getLimaDate().atStartOfDay())) {
            paymentPayResponseDTO.setDaysOverdue(0);
            paymentPayResponseDTO.setTotalOverdue(BigDecimal.ZERO);
        } else if (payment.getTotalOverdue() != null && payment.getTotalOverdue().compareTo(BigDecimal.ZERO) > 0) {
            total = payment.getQuoteUsd().add(payment.getTotalOverdue());
            BigDecimal cien = BigDecimal.valueOf(100L);
            BigDecimal asd = payment.getQuoteUsd()
                    .multiply(percentOverdueDetail.getPercentOverdue())
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal totalDaysDecimal = payment.getTotalOverdue()
                    .divide(asd, 2, RoundingMode.HALF_UP)
                    .multiply(cien)
                    .setScale(0, RoundingMode.HALF_UP);
            Integer totalDays = totalDaysDecimal.intValue();
            paymentPayResponseDTO.setDaysOverdue(totalDays);
        } else {
            paymentPayResponseDTO.setDaysOverdue(0);
        }

        paymentPayResponseDTO.setTotal(total);
        List<PaymentVoucherResponse> vouchers = new ArrayList<>();
        paymentPayResponseDTO.setVouchers(vouchers);

        return paymentPayResponseDTO;
    }

    public static PaymentVoucherResponse mapToPaymentVoucherResponse(PaymentVoucher request) {
        if (request == null) {
            return null;
        }
        // Obtener el SubTypeMethodPayment correspondiente al idMethodPaymentSubType
        SubTypeMethodPayment subTypeMethodPayment = null;
        if (request.getIdMethodPaymentSubType() != null) {
            try {
                subTypeMethodPayment = SubTypeMethodPayment.fromValue(request.getIdMethodPaymentSubType());
            } catch (IllegalArgumentException e) {
                // Si no se encuentra el enum, se puede manejar con un valor por defecto o un log
                subTypeMethodPayment = null;
            }
        }

        // Crear el PaymentVoucherResponse
        PaymentVoucherResponse response = new PaymentVoucherResponse();
        response.setIdPaymentVoucher(request.getIdPaymentVoucher());
        response.setIdPayment(request.getIdPayment());
        response.setIdSuscription(request.getIdSuscription());
        response.setPathPicture(request.getPathPicture());
        response.setOperationNumber(request.getOperationNumber());
        response.setIdMethodPaymentSubType(request.getIdMethodPaymentSubType());
        response.setMethodName(subTypeMethodPayment != null ? subTypeMethodPayment.getTypeDescription() : null);
        response.setSubMethodName(subTypeMethodPayment != null ? subTypeMethodPayment.getSubTypeDescription() : null);
        response.setNote(request.getNote());
        response.setIdPaymentCoinCurrency(request.getIdPaymentCoinCurrency());
        response.setSubTotalAmount(request.getSubTotalAmount());
        response.setCommissionPaymentSubType(request.getCommissionPaymentSubType());
        response.setTotalAmount(request.getTotalAmount());
        response.setCreationDate(request.getCreationDate());
        response.setCompanyOperationNumber(request.getCompanyOperationNumber());

        return response;
    }

    public static MultiCodeSubscriptionResponse mapToMultiCodeSubscriptionResponse(Suscription subscription, PackageDTO packageData) {
        MultiCodeSubscriptionResponse.MultiCodeSubscriptionResponseBuilder builder = MultiCodeSubscriptionResponse.builder()
                .idSubscription(subscription.getIdSuscription())
                .idSponsor(subscription.getIdUser())
                .typeUser(RegisterType.MULTI_ACCOUNT)
                .idStatus(subscription.getStatus())
                .creationDate(subscription.getCreationDate());

        // Handle packageData fields that might be null
        if (packageData != null) {
            builder.nameSubscription(packageData.getName())
                   .familyPackageName(packageData.getFamily().getName());

            // Handle package details that might be null
            if (!packageData.getPackageDetail().isEmpty()) {
                builder.numberQuotas(packageData.getPackageDetail().get(0).getNumberQuotas());
            }
        }

        return builder.build();
    }


}
