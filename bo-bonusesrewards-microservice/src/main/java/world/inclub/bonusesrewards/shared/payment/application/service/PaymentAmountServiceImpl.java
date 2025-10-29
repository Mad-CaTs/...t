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
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.PaymentCurrencyConversionService;
import world.inclub.bonusesrewards.shared.payment.domain.model.CurrencyType;
import world.inclub.bonusesrewards.shared.payment.domain.port.PaymentSubTypeRepositoryPort;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentAmountServiceImpl implements PaymentAmountService {

    private final CarPaymentScheduleRepositoryPort scheduleRepository;
    private final PaymentSubTypeRepositoryPort paymentSubTypeRepository;
    private final PaymentCurrencyConversionService paymentCurrencyConversion;

    @Override
    public Mono<PaymentAmounts> validateAndCalculate(MakePaymentCommand command) {
        return scheduleRepository.findById(command.scheduleId())
                .switchIfEmpty(Mono.error(new NotFoundException("Schedule not found")))
                .flatMap(schedule -> {

                    BigDecimal subTotalUSD = schedule.total();

                    return paymentCurrencyConversion.convertToTargetCurrency(
                            subTotalUSD,
                            CurrencyType.USD,
                            command.currencyType()
                    ).flatMap(subTotalConverted ->
                            calculateAmounts(command, subTotalConverted)
                                    .flatMap(amounts -> {
                                        if (amounts.total().compareTo(command.totalAmount()) != 0) {
                                            return Mono.error(new AmountException(
                                                    "Total amount does not match calculated total, expected: "
                                                            + amounts.total() + ", provided: " + command.totalAmount()));
                                        }
                                        return Mono.just(amounts);
                                    })
                    );
                });
    }

    private Mono<PaymentAmounts> calculateAmounts(MakePaymentCommand command, BigDecimal subTotal) {
        return paymentSubTypeRepository.findById(command.paymentSubTypeId())
                .switchIfEmpty(Mono.error(new NotFoundException("Payment subtype not found")))
                .map(paymentSubType -> {
                    BigDecimal commission = BigDecimal.ZERO;
                    BigDecimal rateAmount = BigDecimal.ZERO;
                    BigDecimal ratePercentage = BigDecimal.ZERO;
                    BigDecimal total;

                    if (command.currencyType() == CurrencyType.USD) {
                        commission = paymentSubType.commissionDollars();
                    } else {
                        commission = paymentSubType.commissionSoles();
                    }

                    commission = commission.setScale(2, RoundingMode.HALF_UP);

                    if (paymentSubType.ratePercentage() != null &&
                            paymentSubType.ratePercentage().compareTo(BigDecimal.ZERO) > 0) {

                        ratePercentage = paymentSubType.ratePercentage();
                        BigDecimal tasaDecimal = paymentSubType.ratePercentage()
                                .divide(BigDecimal.valueOf(100), 8, RoundingMode.HALF_UP);

                        BigDecimal divisor = BigDecimal.ONE.subtract(tasaDecimal);
                        BigDecimal totalWithRate = subTotal.add(commission)
                                .divide(divisor, 8, RoundingMode.HALF_UP);

                        rateAmount = totalWithRate.multiply(tasaDecimal)
                                .setScale(2, RoundingMode.HALF_UP);

                        total = totalWithRate.setScale(2, RoundingMode.HALF_UP);
                    } else {
                        total = subTotal.add(commission);
                    }

                    return new PaymentAmounts(subTotal, commission, rateAmount, ratePercentage, total);
                });
    }
}