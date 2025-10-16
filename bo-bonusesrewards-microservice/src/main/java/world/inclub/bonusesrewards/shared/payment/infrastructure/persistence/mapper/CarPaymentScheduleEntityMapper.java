package world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.mapper;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.shared.payment.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.shared.payment.infrastructure.persistence.entity.CarPaymentScheduleEntity;

@Component
public class CarPaymentScheduleEntityMapper {

    public CarPaymentSchedule toDomain(CarPaymentScheduleEntity entity) {
        return CarPaymentSchedule.builder()
                .id(entity.getId())
                .carAssignmentId(entity.getCarAssignmentId())
                .orderNum(entity.getOrderNum())
                .installmentNum(entity.getInstallmentNum())
                .isInitial(entity.getIsInitial())
                .financingInstallment(entity.getFinancingInstallmentUsd())
                .insurance(entity.getInsuranceUsd())
                .initialInstallment(entity.getInitialInstallmentUsd())
                .initialBonus(entity.getInitialBonusUsd())
                .gps(entity.getGpsUsd())
                .monthlyBonus(entity.getMonthlyBonusUsd())
                .memberAssumedPayment(entity.getMemberAssumedPaymentUsd())
                .total(entity.getTotalUsd())
                .dueDate(entity.getDueDate())
                .statusId(entity.getStatusId())
                .paymentDate(entity.getPaymentDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public CarPaymentScheduleEntity toEntity(CarPaymentSchedule domain) {
        return CarPaymentScheduleEntity.builder()
                .id(domain.getId())
                .carAssignmentId(domain.getCarAssignmentId())
                .orderNum(domain.getOrderNum())
                .installmentNum(domain.getInstallmentNum())
                .isInitial(domain.getIsInitial())
                .financingInstallmentUsd(domain.getFinancingInstallment())
                .insuranceUsd(domain.getInsurance())
                .initialInstallmentUsd(domain.getInitialInstallment())
                .initialBonusUsd(domain.getInitialBonus())
                .gpsUsd(domain.getGps())
                .monthlyBonusUsd(domain.getMonthlyBonus())
                .memberAssumedPaymentUsd(domain.getMemberAssumedPayment())
                .totalUsd(domain.getTotal())
                .dueDate(domain.getDueDate())
                .statusId(domain.getStatusId())
                .paymentDate(domain.getPaymentDate())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}
