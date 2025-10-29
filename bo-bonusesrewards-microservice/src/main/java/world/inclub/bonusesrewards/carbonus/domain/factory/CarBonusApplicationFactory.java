package world.inclub.bonusesrewards.carbonus.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBonusApplication;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentType;

import java.math.BigDecimal;
import java.time.Instant;

@Component
public class CarBonusApplicationFactory {

    public CarBonusApplication create(CarPaymentSchedule paymentSchedule, String description, Boolean applyBonus) {
        return CarBonusApplication.builder()
                .carAssignmentId(paymentSchedule.carAssignmentId())
                .paymentTypeId(PaymentType.WALLET.getId().longValue())
                .bonusAmount(applyBonus ? paymentSchedule.monthlyBonus() : BigDecimal.ZERO)
                .discountAmount(paymentSchedule.total())
                .appliedDate(Instant.now())
                .isInitial(paymentSchedule.isInitial())
                .description(applyBonus || paymentSchedule.isInitial() ? description : "No se aplicó el bono para " + description)
                .build();
    }

}
