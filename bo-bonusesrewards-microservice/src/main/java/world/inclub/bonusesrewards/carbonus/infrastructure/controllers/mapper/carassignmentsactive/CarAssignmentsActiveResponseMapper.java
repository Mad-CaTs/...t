package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carassignmentsactive;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentsActive;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarAssignmentsActiveResponse;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PagedDataMapper;

@Component
public class CarAssignmentsActiveResponseMapper {

    public CarAssignmentsActiveResponse toResponse(CarAssignmentsActive domain) {
        return CarAssignmentsActiveResponse.builder()
                .carAssignmentId(domain.carAssignmentId())
                .memberId(domain.memberId())
                .memberFullName(domain.memberFullName())
                .username(domain.username())
                .brandName(domain.brandName())
                .modelName(domain.modelName())
                .priceUsd(domain.priceUsd())
                .totalInitialInstallments(domain.totalInitialInstallments())
                .paidInitialInstallments(domain.paidInitialInstallments())
                .totalMonthlyInstallments(domain.totalMonthlyInstallments())
                .paidMonthlyInstallments(domain.paidMonthlyInstallments())
                .assignedMonthlyBonusUsd(domain.assignedMonthlyBonusUsd())
                .monthlyInstallmentUsd(domain.monthlyInstallmentUsd() != null ? domain.monthlyInstallmentUsd()
                        .toString() : "Sin Asignar")
                .currentRankName(domain.currentRank() != null ? domain.currentRank().name() : "Unknown")
                .assignedDate(DateTimeFormatter.formatInstantWithContext(domain.assignedDate()))
                .build();
    }

    public PagedData<CarAssignmentsActiveResponse> toResponse(PagedData<CarAssignmentsActive> pagedData) {
        return PagedDataMapper.map(pagedData, this::toResponse);
    }

}