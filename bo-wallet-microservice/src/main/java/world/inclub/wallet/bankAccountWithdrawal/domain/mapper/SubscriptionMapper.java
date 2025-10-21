package world.inclub.wallet.bankAccountWithdrawal.domain.mapper;

import org.springframework.stereotype.Component;
import world.inclub.wallet.bankAccountWithdrawal.application.dto.SubscriptionValidationDto;
import world.inclub.wallet.infraestructure.kafka.dtos.response.SolicitudeBankDto;

import java.math.BigDecimal;

@Component
public class SubscriptionMapper {

    public SubscriptionValidationDto toValidationDto(SolicitudeBankDto dto,BigDecimal exchangeRate) {
        BigDecimal money = dto.getMoney();
        String currencyType = dto.getCurrencyIdBank() != null && dto.getCurrencyIdBank() == 1 ? "D" : "S";
        if ("S".equals(currencyType) && money != null) {
            money = money.multiply(exchangeRate);
        }

        return SubscriptionValidationDto.builder()
                .recordType("A")
                .subscriptionAccountType(mapAccountType(dto.getNameTypeAccountBank()))
                .subscriptionAccount(dto.getNumberAccount())
                .documentType(normalizeDocumentType(String.valueOf(dto.getIdDocumentType())))
                .documentNumber(dto.getNumDocument())
                .workerName((dto.getNameHolder() + " " + dto.getLastNameHolder()).toUpperCase())
                .currencyType(currencyType)
                .subscriptionAmount(formatMoney(money))
                .supplierValidation("S")
                .build();
    }

    private String mapAccountType(String nameType) {
        if (nameType == null) return "";
        String lower = nameType.toLowerCase();
        if (lower.contains("corriente")) return "C";
        if (lower.contains("maestra")) return "M";
        if (lower.contains("ahorro")) return "A";
        if (lower.contains("interbancaria")) return "B";
        return "";
    }

    private String formatMoney(BigDecimal money) {
        if (money == null) return "00000000000000.00";
        return String.format("%014.2f", money);
    }

    private String normalizeDocumentType(String docType) {
        switch (docType) {
            case "2": return "1";    // DNI
            case "3": return "RUC";  // RUC
            case "5": return "4";    // Pasaporte
            default:  return docType;
        }
    }
}
