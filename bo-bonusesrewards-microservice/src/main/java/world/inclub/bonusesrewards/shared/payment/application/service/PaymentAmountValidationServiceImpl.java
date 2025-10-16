package world.inclub.bonusesrewards.shared.payment.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.PaymentAmountValidationService;
import world.inclub.bonusesrewards.shared.payment.domain.port.CarPaymentScheduleRepositoryPort;
import world.inclub.bonusesrewards.shared.payment.infrastructure.exceptions.BadRequestException;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentAmountValidationServiceImpl implements PaymentAmountValidationService {

    private final CarPaymentScheduleRepositoryPort scheduleRepository;

    @Override
    public Mono<MakePaymentCommand> validateAmounts(MakePaymentCommand command) {
        return scheduleRepository.findById(command.scheduleId())
                .flatMap(schedule -> {
                    if (schedule.getTotal().compareTo(command.totalAmount()) != 0) {
                        return Mono.error(new BadRequestException(
                                "Payment amount does not match schedule amount. " +
                                        "Expected: " + schedule.getTotal() + ", Got: " + command.totalAmount()));
                    }

                    BigDecimal calculatedTotal = command.subTotalAmount().add(command.commissionAmount());
                    if (calculatedTotal.compareTo(command.totalAmount()) != 0) {
                        return Mono.error(new BadRequestException(
                                "Sub total + Commission does not equal Total amount. " +
                                        "Expected: " + command.totalAmount() + ", Got: " + calculatedTotal));
                    }

                    log.info("Payment amounts validated successfully for schedule: {}", command.scheduleId());
                    return Mono.just(command);
                });
    }
}