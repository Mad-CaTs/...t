package world.inclub.bonusesrewards.carbonus.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.carbonus.infrastructure.persistence.entity.CarPaymentScheduleEntity;

@Component
public class CarPaymentScheduleMapper {

    public CarPaymentSchedule toDomain(CarPaymentScheduleEntity entity) {
        if (entity == null) return null;
        return new CarPaymentSchedule(
                entity.getId(),
                entity.getCarAssignmentId(),
                entity.getOrderNum(),
                entity.getInstallmentNum(),
                entity.getIsInitial(),
                entity.getFinancingInstallmentUsd(),
                entity.getInsuranceUsd(),
                entity.getInitialInstallmentUsd(),
                entity.getInitialBonusUsd(),
                entity.getGpsUsd(),
                entity.getMonthlyBonusUsd(),
                entity.getMemberAssumedPaymentUsd(),
                entity.getTotalUsd(),
                entity.getDueDate(),
                entity.getStatusId(),
                entity.getPaymentDate(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }

    public CarPaymentScheduleEntity toEntity(CarPaymentSchedule domain) {
        if (domain == null) return null;
        CarPaymentScheduleEntity entity = new CarPaymentScheduleEntity();
        entity.setId(domain.id());
        entity.setCarAssignmentId(domain.carAssignmentId());
        entity.setOrderNum(domain.orderNum());
        entity.setInstallmentNum(domain.installmentNum());
        entity.setIsInitial(domain.isInitial());
        entity.setFinancingInstallmentUsd(domain.financingInstallment());
        entity.setInsuranceUsd(domain.insurance());
        entity.setInitialInstallmentUsd(domain.initialInstallment());
        entity.setInitialBonusUsd(domain.initialBonus());
        entity.setGpsUsd(domain.gps());
        entity.setMonthlyBonusUsd(domain.monthlyBonus());
        entity.setMemberAssumedPaymentUsd(domain.memberAssumedPayment());
        entity.setTotalUsd(domain.total());
        entity.setDueDate(domain.dueDate());
        entity.setStatusId(domain.statusId());
        entity.setPaymentDate(domain.paymentDate());
        entity.setCreatedAt(domain.createdAt());
        entity.setUpdatedAt(domain.updatedAt());
        return entity;
    }

}