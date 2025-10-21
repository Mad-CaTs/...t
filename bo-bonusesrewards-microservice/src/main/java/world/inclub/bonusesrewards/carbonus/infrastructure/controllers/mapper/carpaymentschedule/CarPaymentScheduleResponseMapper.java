package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carpaymentschedule;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarPaymentScheduleResponse;
import world.inclub.bonusesrewards.shared.payment.domain.model.BonusPaymentStatus;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PagedDataMapper;

@Component
public class CarPaymentScheduleResponseMapper {

    public CarPaymentScheduleResponse toResponse(CarPaymentSchedule domain) {
        return new CarPaymentScheduleResponse(
                domain.id(),
                domain.carAssignmentId(),
                domain.orderNum(),
                domain.installmentNum(),
                domain.isInitial(),
                domain.financingInstallment(),
                domain.insurance(),
                domain.initialInstallment(),
                domain.initialBonus(),
                domain.gps(),
                domain.monthlyBonus(),
                domain.memberAssumedPayment(),
                domain.total(),
                DateTimeFormatter.formatLocalDate(domain.dueDate()),
                mapStatus(domain.statusId()),
                DateTimeFormatter.formatInstantToDateWithContext(domain.paymentDate())
        );
    }

    public PagedData<CarPaymentScheduleResponse> toResponse(PagedData<CarPaymentSchedule> pagedData) {
        return PagedDataMapper.map(pagedData, this::toResponse);
    }

    private CarPaymentScheduleResponse.Status mapStatus(Long statusId) {
        BonusPaymentStatus status = BonusPaymentStatus.fromId(statusId);
        return new CarPaymentScheduleResponse.Status(status.getId(), status.getCode());
    }

}