package world.inclub.ticket.application.factory;

import org.springframework.stereotype.Component;
import world.inclub.ticket.application.dto.MakePaymentCommand;
import world.inclub.ticket.application.dto.PaymentAmounts;
import world.inclub.ticket.domain.enums.PaymentStatus;
import world.inclub.ticket.domain.enums.UserType;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.utils.TimeLima;

import java.time.LocalDateTime;

@Component
public class PaymentFactory {

    public Payment createPaymentWithPendingStatus(MakePaymentCommand command, PaymentAmounts amounts, UserType userType) {
        LocalDateTime now = TimeLima.getLimaTime();
        return Payment.builder()
                .userId(command.userId())
                .eventId(command.eventId())
                .method(command.method())
                .paymentSubTypeId(command.paymentSubTypeId())
                .userType(userType)
                .status(PaymentStatus.PENDING)
                .currencyType(command.currencyType())
                .ticketQuantity(calculateTotalTickets(amounts))
                .subTotalAmount(amounts.subTotal())
                .commissionAmount(amounts.commission())
                .totalAmount(amounts.total())
                .createdAt(now)
                .build();
    }

    public Payment createPaymentWithApprovedStatus(MakePaymentCommand command, PaymentAmounts amounts, UserType userType) {
        LocalDateTime now = TimeLima.getLimaTime();
        return Payment.builder()
                .userId(command.userId())
                .eventId(command.eventId())
                .method(command.method())
                .paymentSubTypeId(command.paymentSubTypeId())
                .userType(userType)
                .status(PaymentStatus.APPROVED)
                .currencyType(command.currencyType())
                .ticketQuantity(calculateTotalTickets(amounts))
                .subTotalAmount(amounts.subTotal())
                .commissionAmount(amounts.commission())
                .totalAmount(amounts.total())
                .createdAt(now)
                .build();
    }

    private Integer calculateTotalTickets(PaymentAmounts ammount) {
        Integer totalTickets = ammount.items().stream()
                .mapToInt(item -> item.quantity() != null ? item.quantity() : 0)
                .sum();
        return totalTickets;
    }
}
