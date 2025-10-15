package world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carassignmentdetail;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignmentDetail;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.dto.response.CarAssignmentDetailsResponse;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carbrand.CarBrandResponseMapper;
import world.inclub.bonusesrewards.carbonus.infrastructure.controllers.mapper.carmodel.CarModelResponseMapper;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PagedDataMapper;

@Component
@RequiredArgsConstructor
public class CarAssignmentDetailResponseMapper {

    private final CarBrandResponseMapper carBrandResponseMapper;
    private final CarModelResponseMapper carModelResponseMapper;

    public CarAssignmentDetailsResponse toCarDetailsResponse(CarAssignmentDetail domain) {
        if (domain == null) return null;

        return CarAssignmentDetailsResponse.builder()
                .carAssignmentId(domain.assignmentId())
                .memberId(domain.memberId())
                .brand(carBrandResponseMapper.toResponse(domain.brand()))
                .model(carModelResponseMapper.toResponse(domain.model()))
                .color(domain.color())
                .imageUrl(domain.imageUrl())
                .price(domain.price())
                .interestRate(domain.interestRate())
                .companyInitial(domain.bonusInitial())
                .memberInitial(domain.memberInitial())
                .initialInstallmentsCount(domain.initialInstallmentsCount())
                .monthlyInstallmentsCount(domain.monthlyInstallmentsCount())
                .paymentStartDate(domain.paymentStartDate().toString())
                .isAssigned(domain.isAssigned())
                .assignedDate(DateTimeFormatter.formatInstantWithContext(domain.assignedDate()))
                .build();
    }

    public PagedData<CarAssignmentDetailsResponse> toResponse(PagedData<CarAssignmentDetail> pagedData) {
        return PagedDataMapper.map(pagedData, this::toCarDetailsResponse);
    }

}