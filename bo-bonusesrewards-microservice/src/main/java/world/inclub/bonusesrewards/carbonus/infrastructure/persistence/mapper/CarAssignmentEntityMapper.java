package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarAssignmentEntity;

import java.time.Instant;

@Component
public class CarAssignmentEntityMapper {

    public CarAssignmentEntity toEntity(CarAssignment carAssignment) {
        if (carAssignment == null) {
            return null;
        }

        CarAssignmentEntity entity = new CarAssignmentEntity();
        entity.setId(carAssignment.id());
        entity.setCarId(carAssignment.carId());
        entity.setQuotationId(carAssignment.quotationId());
        entity.setMemberId(carAssignment.memberId());
        entity.setPrice(carAssignment.price());
        entity.setInterestRate(carAssignment.interestRate());
        entity.setRankBonusId(carAssignment.rankBonusId());
        entity.setMemberInitial(carAssignment.memberInitial());
        entity.setInitialInstallmentsCount(carAssignment.initialInstallmentsCount());
        entity.setMonthlyInstallmentsCount(carAssignment.monthlyInstallmentsCount());
        entity.setPaymentStartDate(carAssignment.paymentStartDate());
        entity.setTotalGpsUsd(carAssignment.totalGpsUsd());
        entity.setTotalInsuranceUsd(carAssignment.totalInsuranceUsd());
        entity.setTotalMandatoryInsuranceAmount(carAssignment.totalMandatoryInsuranceAmount());
        entity.setAssignedDate(carAssignment.assignedDate());
        entity.setIsAssigned(carAssignment.isAssigned());
        entity.setCreatedAt(carAssignment.createdAt());
        entity.setUpdatedAt(carAssignment.updatedAt());

        return entity;
    }

    public CarAssignment toDomain(CarAssignmentEntity entity) {
        if (entity == null) return null;

        return CarAssignment.builder()
                .id(entity.getId())
                .carId(entity.getCarId())
                .quotationId(entity.getQuotationId())
                .memberId(entity.getMemberId())
                .price(entity.getPrice())
                .interestRate(entity.getInterestRate())
                .rankBonusId(entity.getRankBonusId())
                .memberInitial(entity.getMemberInitial())
                .initialInstallmentsCount(entity.getInitialInstallmentsCount())
                .monthlyInstallmentsCount(entity.getMonthlyInstallmentsCount())
                .paymentStartDate(entity.getPaymentStartDate())
                .totalGpsUsd(entity.getTotalGpsUsd())
                .totalInsuranceUsd(entity.getTotalInsuranceUsd())
                .totalMandatoryInsuranceAmount(entity.getTotalMandatoryInsuranceAmount())
                .assignedDate(entity.getAssignedDate())
                .isAssigned(entity.getIsAssigned())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

}