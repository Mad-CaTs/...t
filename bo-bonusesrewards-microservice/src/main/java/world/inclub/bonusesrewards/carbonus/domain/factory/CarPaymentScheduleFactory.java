package world.inclub.bonusesrewards.carbonus.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.*;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentStatus;

import java.math.BigDecimal;
import java.math.RoundingMode;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class CarPaymentScheduleFactory {

    public CarPaymentSchedule markAsPaid(CarPaymentSchedule schedule) {
        return schedule.toBuilder()
                .statusId(PaymentStatus.COMPLETED.getId())
                .paymentDate(Instant.now())
                .build();
    }
    public List<CarPaymentSchedule> createInitialSchedules(
            UUID carAssignmentId,
            CarAssignment carAssignment,
            CarRankBonus rankBonus
    ) {
        int parts = carAssignment.initialInstallmentsCount();
        BigDecimal[] memberParts = preciseSplit(carAssignment.memberInitial(), parts);
        BigDecimal[] companyParts = preciseSplit(rankBonus.initialBonus(), parts);
        LocalDate startDate = carAssignment.paymentStartDate();
        List<CarPaymentSchedule> schedules = new ArrayList<>();
        for (int i = 0; i < parts; i++) {
            LocalDate dueDate = adjustPaymentDateForMonth(startDate, i);
            schedules.add(buildInitialSchedule(
                    carAssignmentId,
                    i + 1,
                    i + 1,
                    companyParts[i].add(memberParts[i]),
                    companyParts[i],
                    memberParts[i],
                    dueDate
            ));
        }
        return schedules;
    }

    public List<CarPaymentSchedule> createInstallmentSchedules(
            CarAssignment carAssignment,
            CarPaymentSchedule lastInitial,
            BigDecimal gpsAmount,
            BigDecimal insuranceAmount,
            BigDecimal mandatoryInsuranceAmount,
            CarRankBonus rankBonus
    ) {
        BigDecimal tea = carAssignment.interestRate();
        double teaDecimal = tea.doubleValue() / 100.0;
        double tem = Math.pow(1 + teaDecimal, 1.0/12.0) - 1;
        BigDecimal monthlyRate = BigDecimal.valueOf(tem);

        int periods = carAssignment.monthlyInstallmentsCount();
        BigDecimal carPrice = carAssignment.price();
        BigDecimal totalInitialPayment = carAssignment.memberInitial().add(rankBonus.initialBonus());
        BigDecimal financingAmount = carPrice.subtract(totalInitialPayment);

        BigDecimal financingInstallment = calculatePMT(monthlyRate, periods, financingAmount);

        BigDecimal monthlyGps = gpsAmount.divide(BigDecimal.valueOf(periods), 2, RoundingMode.HALF_UP);

        BigDecimal totalInsurance = insuranceAmount.add(mandatoryInsuranceAmount);
        BigDecimal monthlyInsurance = totalInsurance.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);

        BigDecimal monthlyBonus = rankBonus.monthlyBonus();

        List<CarPaymentSchedule> schedules = new ArrayList<>();
        LocalDate startDate = carAssignment.paymentStartDate().plusMonths(lastInitial.orderNum());
        int initialSchedulesCount = lastInitial.orderNum();

        for (int i = 0; i < periods; i++) {
            LocalDate dueDate = adjustPaymentDateForMonth(startDate, i);

            BigDecimal memberAssumedPayment = financingInstallment
                    .add(monthlyInsurance)
                    .add(monthlyGps)
                    .subtract(monthlyBonus);

            BigDecimal total = memberAssumedPayment.add(monthlyBonus);

            schedules.add(buildInstallmentSchedule(
                    carAssignment.id(),
                    initialSchedulesCount + i + 1,
                    i + 1,
                    financingInstallment,
                    monthlyInsurance,
                    monthlyGps,
                    monthlyBonus,
                    memberAssumedPayment,
                    total,
                    dueDate
            ));
        }

        return schedules;
    }

    private BigDecimal calculatePMT(BigDecimal rate, int periods, BigDecimal presentValue) {
        if (rate.compareTo(BigDecimal.ZERO) == 0) {
            return presentValue.divide(BigDecimal.valueOf(periods), 2, RoundingMode.HALF_UP);
        }
        double r = rate.doubleValue();
        double pv = presentValue.doubleValue();
        double onePlusR = 1 + r;
        double onePlusRPowN = Math.pow(onePlusR, periods);

        double pmt = pv * r * onePlusRPowN / (onePlusRPowN - 1);

        return BigDecimal.valueOf(pmt).setScale(2, RoundingMode.HALF_UP);
    }

    private CarPaymentSchedule buildInitialSchedule(
            UUID carAssignmentId,
            Integer installmentNum,
            Integer orderNum,
            BigDecimal initialInstallment,
            BigDecimal initialBonus,
            BigDecimal assumedPayment,
            LocalDate dueDate
    ) {
        return CarPaymentSchedule.builder()
                .carAssignmentId(carAssignmentId)
                .installmentNum(installmentNum)
                .orderNum(orderNum)
                .isInitial(true)
                .financingInstallment(initialInstallment)
                .insurance(BigDecimal.ZERO)
                .initialInstallment(initialInstallment)
                .initialBonus(initialBonus)
                .gps(BigDecimal.ZERO)
                .monthlyBonus(BigDecimal.ZERO)
                .memberAssumedPayment(assumedPayment)
                .total(assumedPayment)
                .dueDate(dueDate)
                .build();
    }

    private CarPaymentSchedule buildInstallmentSchedule(
            UUID carAssignmentId,
            Integer orderNum,
            Integer installmentNum,
            BigDecimal financingInstallment,
            BigDecimal insurance,
            BigDecimal gps,
            BigDecimal monthlyBonus,
            BigDecimal memberAssumedPayment,
            BigDecimal total,
            LocalDate dueDate
    ) {
        return CarPaymentSchedule.builder()
                .carAssignmentId(carAssignmentId)
                .orderNum(orderNum)
                .installmentNum(installmentNum)
                .isInitial(false)
                .financingInstallment(financingInstallment)
                .insurance(insurance)
                .initialInstallment(BigDecimal.ZERO)
                .initialBonus(BigDecimal.ZERO)
                .gps(gps)
                .monthlyBonus(monthlyBonus)
                .memberAssumedPayment(memberAssumedPayment)
                .total(total)
                .dueDate(dueDate)
                .build();
    }

    private BigDecimal[] preciseSplit(BigDecimal total, int parts) {
        BigDecimal equalPart = total.divide(BigDecimal.valueOf(parts), 2, RoundingMode.UP);
        BigDecimal[] result = new BigDecimal[parts];
        for (int i = 0; i < parts; i++) {
            result[i] = equalPart;
        }
        return result;
    }

    private LocalDate adjustPaymentDateForMonth(LocalDate startDate, int monthsToAdd) {
        LocalDate targetDate = startDate.plusMonths(monthsToAdd);
        int originalDay = startDate.getDayOfMonth();

        if (targetDate.getDayOfMonth() == originalDay ||
            targetDate.lengthOfMonth() >= originalDay) {
            return targetDate.withDayOfMonth(Math.min(originalDay, targetDate.lengthOfMonth()));
        }

        return targetDate.withDayOfMonth(targetDate.lengthOfMonth());
    }

}
