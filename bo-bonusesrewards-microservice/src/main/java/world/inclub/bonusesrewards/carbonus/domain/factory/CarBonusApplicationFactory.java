package world.inclub.bonusesrewards.carbonus.domain.factory;

import org.springframework.stereotype.Component;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBonusApplication;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;

import java.time.Instant;

@Component
public class CarBonusApplicationFactory {

    public CarBonusApplication create(CarPaymentSchedule paymentSchedule) {
        return CarBonusApplication.builder()
                .carAssignmentId(paymentSchedule.carAssignmentId())
                .paymentTypeId(4L)
                .bonusAmount(paymentSchedule.monthlyBonus())
                .discountAmount(paymentSchedule.total())
                .appliedDate(Instant.now())
                .build();
    }

}
