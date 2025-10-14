package world.inclub.ticket.domain.model;

import java.math.BigDecimal;

public record PaymentSubType(

        Integer idPaymentSubType,
        Integer idPaymentType,
        String description,
        BigDecimal commissionSoles,
        BigDecimal commissionDollars,
        BigDecimal ratePercentage,
        Boolean statusSoles,
        Boolean statusDollar

) {}

