package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carpaymentschedule;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.excel.CarPaymentScheduleExelResponse;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentStatus;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;

@Component
public class CarPaymentScheduleExelResponseMapper {

    public CarPaymentScheduleExelResponse toResponse(CarPaymentSchedule domain) {
        return CarPaymentScheduleExelResponse.builder()
                .concept(getConcept(domain.isInitial(), domain.installmentNum()))
                .financingInstallment(domain.financingInstallment())
                .insurance(domain.insurance())
                .inicialInstallment(domain.initialInstallment())
                .initialBonus(domain.initialBonus())
                .gps(domain.gps())
                .monthlyBonus(domain.monthlyBonus())
                .memberAssumedPayment(domain.memberAssumedPayment())
                .total(domain.total())
                .dueDate(DateTimeFormatter.formatLocalDate(domain.dueDate()))
                .status(getStatusName(domain.statusId()))
                .paymentDate(DateTimeFormatter.formatInstantToDateWithContext(domain.paymentDate()))
                .build();
    }

    private String getConcept(Boolean isInitial, Integer installmentNum) {
        if (isInitial) {
            return String.format("Inicial Fraccionada N° %d", installmentNum);
        } else {
            return String.format("Cuota N° %d", installmentNum);
        }
    }

    private String getStatusName(Long statusId) {
        PaymentStatus status = PaymentStatus.fromId(statusId);
        return switch (status) {
            case COMPLETED -> "Pagado";
            case PENDING -> "Pendiente";
            case FAILED -> "Fallido";
            case PENDING_REVIEW -> "Pendiente de Revisión";
            case REJECTED -> "Rechazado";
            default -> "Desconocido";
        };
    }

}