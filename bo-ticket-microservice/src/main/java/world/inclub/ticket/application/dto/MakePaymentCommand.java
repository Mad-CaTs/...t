package world.inclub.ticket.application.dto;

import org.springframework.http.codec.multipart.FilePart;
import world.inclub.ticket.domain.enums.CurrencyType;
import world.inclub.ticket.domain.enums.PaymentMethod;

import java.math.BigDecimal;
import java.util.List;

public record MakePaymentCommand(
        Long userId,
        Long eventId,
        PaymentMethod method,
        Integer paymentSubTypeId,
        CurrencyType currencyType,
        List<PackageSelection> packages,
        List<Attendee> attendeePackages,
        List<ZoneSelection> zones,
        List<Attendee> attendees,
        Voucher voucher,
        BigDecimal totalAmount
) {
    public record ZoneSelection(
            Long eventZoneId,
            Integer quantity
    ) {}

    public record Attendee(
            Long eventZoneId,
            Long documentTypeId,
            String documentNumber,
            String email,
            String name,
            String lastName
    ) {}

    public record Voucher(
            String operationNumber,
            String note,
            FilePart image
    ) {}

    public record PackageSelection(
            Long packageId,
            Integer quantity
    ) {}
}
