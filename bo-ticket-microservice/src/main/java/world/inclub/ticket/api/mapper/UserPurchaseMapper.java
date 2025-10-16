package world.inclub.ticket.api.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.domain.model.payment.PaymentType;
import world.inclub.ticket.infraestructure.controller.dto.UserPurchaseResponse;
import world.inclub.ticket.domain.model.Event;
import world.inclub.ticket.domain.model.EventZone;
import world.inclub.ticket.domain.model.SeatType;
import world.inclub.ticket.domain.model.PaymentSubType;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.payment.PaymentVoucher;
import world.inclub.ticket.domain.model.ticket.Attendee;

import java.util.List;
import java.util.Objects;

@Component
public class UserPurchaseMapper {

    public UserPurchaseResponse toResponse(Payment payment, List<PaymentType> paymentTypes, Event event) {

        Integer paymentSubTypeId = payment.getPaymentSubTypeId();
        PaymentSubType paymentSubType = null;
        PaymentType paymentType = null;
        if (paymentSubTypeId != null) {
            for (PaymentType pt : paymentTypes) {
                if (pt.paymentSubTypeList() != null) {
                    for (PaymentSubType subType : pt.paymentSubTypeList()) {
                        if (subType.idPaymentSubType().equals(paymentSubTypeId)) {
                            paymentSubType = subType;
                            paymentType = pt;
                            break;
                        }
                    }
                }
                if (paymentType != null) break;
            }
        }

        return UserPurchaseResponse.builder()
                .orderNumber(String.format("%012d", payment.getId()))
                .purchaseDate(payment.getCreatedAt())
                .eventName(event.getEventName())
                .paymentMethod(Objects.requireNonNull(paymentSubType).description() + " - " + Objects.requireNonNull(paymentType).description())
                .total(payment.getCurrencyType().getSymbol() + " " + payment.getTotalAmount())
                .status(payment.getStatus().name())
                .build();
    }

}
