package world.inclub.ticket.application.factory;

import org.springframework.stereotype.Component;
import reactor.util.function.Tuple2;
import world.inclub.ticket.api.dto.EventResponseDto;
import world.inclub.ticket.application.dto.TicketPaymentNotificationMessage;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.payment.PaymentRejection;
import world.inclub.ticket.domain.model.payment.PaymentType;
import world.inclub.ticket.domain.model.PaymentSubType;

import java.util.List;
import java.util.Objects;

@Component
public class TicketPaymentNotificationFactory {

    public TicketPaymentNotificationMessage toApprovedPaymentMessage(Tuple2<String, String> userData, EventResponseDto event, Payment payment) {
        return TicketPaymentNotificationMessage.builder()
                .user(TicketPaymentNotificationMessage.User.builder()
                        .email(userData.getT1())
                        .fullName(userData.getT2())
                        .build())
                .event(TicketPaymentNotificationMessage.Event.builder()
                        .name(event.getEventName())
                        .eventDate(event.getEventDate())
                        .startTime(event.getStartDate())
                        .bannerUrl(event.getFlyerUrl())
                        .build())
                .status(payment.getStatus())
                .build();
    }

    public TicketPaymentNotificationMessage toPendingPaymentMessage(Tuple2<String, String> userData, EventResponseDto event, List<PaymentType> paymentTypes, Payment payment) {
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

        return TicketPaymentNotificationMessage.builder()
                .user(TicketPaymentNotificationMessage.User.builder()
                        .email(userData.getT1())
                        .fullName(userData.getT2())
                        .build())
                .event(TicketPaymentNotificationMessage.Event.builder()
                        .name(event.getEventName())
                        .eventDate(event.getEventDate())
                        .startTime(event.getStartDate())
                        .bannerUrl(event.getFlyerUrl())
                        .build())
                .payment(TicketPaymentNotificationMessage.Payment.builder()
                        .id(payment.getId())
                        .method(Objects.requireNonNull(paymentSubType).description() + " - " + Objects.requireNonNull(paymentType).description())
                        .currencyType(payment.getCurrencyType().getSymbol())
                        .ticketQuantity(payment.getTicketQuantity())
                        .subTotalAmount(payment.getSubTotalAmount())
                        .commissionAmount(payment.getCommissionAmount())
                        .totalAmount(payment.getTotalAmount())
                        .createdAt(payment.getCreatedAt())
                        .build())
                .status(payment.getStatus())
                .build();
    }

    public TicketPaymentNotificationMessage toTemporalRejectedPaymentMessage(Tuple2<String, String> userData, EventResponseDto event, Payment payment, PaymentRejection paymentRejection) {
        return TicketPaymentNotificationMessage.builder()
                .user(TicketPaymentNotificationMessage.User.builder()
                        .email(userData.getT1())
                        .fullName(userData.getT2())
                        .build())
                .event(TicketPaymentNotificationMessage.Event.builder()
                        .name(event.getEventName())
                        .eventDate(event.getEventDate())
                        .startTime(event.getStartDate())
                        .bannerUrl(event.getFlyerUrl())
                        .build())
                .rejectedPayment(TicketPaymentNotificationMessage.RejectedPayment.builder()
                        .reason(paymentRejection.getNote())
                        .rejectedAt(paymentRejection.getCreatedAt())
                        .build())
                .status(payment.getStatus())
                .build();
    }

}
