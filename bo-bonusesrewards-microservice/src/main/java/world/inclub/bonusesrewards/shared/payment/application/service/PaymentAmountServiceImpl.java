package world.inclub.bonusesrewards.shared.payment.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.port.CarPaymentScheduleRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.AmountException;
import world.inclub.bonusesrewards.shared.exceptions.NotFoundException;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentAmounts;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.PaymentAmountService;
import world.inclub.bonusesrewards.shared.payment.domain.model.CurrencyType;
import world.inclub.bonusesrewards.shared.payment.domain.port.PaymentSubTypeRepositoryPort;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentAmountServiceImpl implements PaymentAmountService {

    private final CarPaymentScheduleRepositoryPort scheduleRepository;
    private final PaymentSubTypeRepositoryPort paymentSubTypeRepositoryPort;

    @Override
    public Mono<PaymentAmounts> validateAndCalculate(MakePaymentCommand command) {
        return scheduleRepository.findById(command.scheduleId())
                .switchIfEmpty(Mono.error(new NotFoundException("Schedule not found")))
                .flatMap(schedule -> {
                    BigDecimal subTotal = schedule.total();

                    return calculateAmounts(command, subTotal)
                            .flatMap(amounts -> {
                                if (amounts.total().compareTo(command.totalAmount()) != 0) {
                                    return Mono.error(new AmountException(
                                            "Total amount does not match calculated total, expected: "
                                                    + amounts.total() + ", provided: " + command.totalAmount()));
                                }
                                return Mono.just(new PaymentAmounts(
                                        amounts.subTotal(),
                                        amounts.commission(),
                                        amounts.total()
                                ));
                            });
                });
    }

    private Mono<PaymentAmounts> calculateAmounts(MakePaymentCommand command, BigDecimal subTotal) {
        return paymentSubTypeRepositoryPort.findById(command.paymentSubTypeId())
                .switchIfEmpty(Mono.error(new NotFoundException("Payment subtype not found")))
                .map(paymentSubType -> {
                    BigDecimal commission = BigDecimal.ZERO;
                    if (command.currencyType() == CurrencyType.USD) {
                        commission = commission.add(paymentSubType.commissionDollars());
                    } else {
                        commission = commission.add(paymentSubType.commissionSoles());
                    }

                    if (paymentSubType.ratePercentage() != null &&
                            paymentSubType.ratePercentage().compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal tasaDecimal = paymentSubType.ratePercentage()
                                .divide(BigDecimal.valueOf(100), 8, RoundingMode.HALF_UP);
                        commission = commission.add(subTotal.multiply(tasaDecimal));
                    }

                    commission = commission.setScale(2, RoundingMode.HALF_UP);

                    BigDecimal total = subTotal.add(commission);
                    return new PaymentAmounts(subTotal, commission, total);
                });
    }
}