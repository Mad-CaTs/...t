package world.inclub.wallet.bankAccountWithdrawal.application.processor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.AccountValidation;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.SubscriptionValidationDto;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.SubscriptionValidationError;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.ValidationResult;
import world.inclub.wallet.bankAccountWithdrawal.domain.entity.PositionDetails;
import world.inclub.wallet.bankAccountWithdrawal.domain.mapper.SubscriptionMapper;
import world.inclub.wallet.bankAccountWithdrawal.domain.validator.GeneralValidatorBCP;
import world.inclub.wallet.bankAccountWithdrawal.infrastructure.adapter.BankStatusUpdater;
import world.inclub.wallet.infraestructure.kafka.dtos.response.SolicitudeBankDto;
import world.inclub.wallet.infraestructure.serviceagent.dtos.response.AccountBankByClientResponse;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SubscriptionProcessor {

    private final GeneralValidatorBCP generalValidatorBCP;
    private final SubscriptionMapper subscriptionMapper;
    private final BankStatusUpdater bankStatusUpdater;

    public Mono<ValidationResult> processSubscriptions(List<SolicitudeBankDto> lista, BigDecimal exchangeRate) {
        List<SubscriptionValidationDto> transformed = transformSubscriptions(lista, exchangeRate);

        ValidationResult result = generalValidatorBCP.validateSubscriptions(transformed);

        return bankStatusUpdater.updateBankStatuses(result, lista)
                .thenReturn(result);
    }

    private List<SubscriptionValidationDto> transformSubscriptions(List<SolicitudeBankDto> lista,
            BigDecimal exchangeRate) {
        return lista.stream()
                .map(dto -> {
                    SubscriptionValidationDto validationDto = subscriptionMapper.toValidationDto(dto, exchangeRate);
                    log.info("Mapping DTO: money={} -> subscriptionAmount={} currencyType={}",
                            dto.getMoney(),
                            validationDto.getSubscriptionAmount(),
                            validationDto.getCurrencyType());
                    return validationDto;
                })
                .toList();
    }


    public String calculateTotalPayrollAmount(List<SubscriptionValidationDto> correctos, List<SubscriptionValidationError> incorrectos, BigDecimal exchangeRate) {
        BigDecimal total = BigDecimal.ZERO;

        for (SubscriptionValidationDto dto : correctos) {
            total = total.add(convertAmount(dto, exchangeRate));
        }

        for (SubscriptionValidationError error : incorrectos) {
            total = total.add(convertAmount(error.getRegistro(), exchangeRate));
        }
        return String.format("%014.2f", total);
    }

    public String calculateNumberOfPayments(List<SubscriptionValidationDto> correctos,
            List<SubscriptionValidationError> incorrectos) {
        int totalCount = correctos.size() + incorrectos.size();
        return String.format("%06d", totalCount); // 6 dígitos
    }

    private BigDecimal convertAmount(SubscriptionValidationDto dto, BigDecimal exchangeRate) {
        String raw = dto.getSubscriptionAmount().replaceFirst("^0+(?!$)", "");
        BigDecimal amount = new BigDecimal(raw);
        if ("D".equalsIgnoreCase(dto.getCurrencyType())) {
            amount = amount.multiply(exchangeRate);
        }
        return amount;
    }


    public PositionDetails buildPositionDetails(ValidationResult result, BigDecimal exchangeRate, String today) {
        String totalPayrollAmount = calculateTotalPayrollAmount(
                result.getData().getCorrectos(),
                result.getData().getIncorrectos(),
                exchangeRate
        );


        String numberOfPayments = calculateNumberOfPayments(
                result.getData().getCorrectos(),
                result.getData().getIncorrectos()
        );

        return PositionDetails.builder()
                .typeRecord("C")
                .numberOfPayments(numberOfPayments)
                .processDate(today)
                .payrollSubtype("O")
                .chargeAccountType("C")
                .chargeAccount("1912606708082")
                .totalPayrollAmount(totalPayrollAmount)
                .payrollReference("Referencia Retiro")
                .build();
    }

    


}
