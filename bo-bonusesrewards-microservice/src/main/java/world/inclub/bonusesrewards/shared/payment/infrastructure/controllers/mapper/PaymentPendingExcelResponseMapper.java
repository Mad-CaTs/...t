package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentListView;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.excel.PaymentPendingExcelResponse;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Component
public class PaymentPendingExcelResponseMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public PaymentPendingExcelResponse toExcelResponse(PaymentListView payment) {
        if (payment == null) return null;

        String installmentInfo = buildInstallmentInfo(payment.installmentNum());
        String formattedDate = formatDate(payment.paymentDate());

        return PaymentPendingExcelResponse.builder()
                .username(payment.username())
                .memberFullName(payment.memberFullName())
                .nrodocument(payment.nrodocument())
                .paymentDate(formattedDate)
                .operationNumber(payment.operationNumber())
                .bonusTypeName(payment.bonusTypeName())
                .installmentInfo(installmentInfo)
                .voucherImg(payment.voucherImageUrl())
                .build();
    }

    private String buildInstallmentInfo(Integer installmentNum) {
        if (installmentNum == null) {
            return "";
        }
        return "Cuota " + installmentNum;
    }

    private String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }
        return dateTime.format(DATE_FORMATTER);
    }
}


