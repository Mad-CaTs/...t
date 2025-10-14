package world.inclub.ticket.domain.model.payment;

import world.inclub.ticket.domain.model.PaymentSubType;

import java.util.List;

public record PaymentType(
        Integer idPaymentType,
        String description,
        Integer idResidenceCountry,
        String pathPicture,
        Integer idPaymentMethod,
        List<PaymentSubType> paymentSubTypeList
) {}

