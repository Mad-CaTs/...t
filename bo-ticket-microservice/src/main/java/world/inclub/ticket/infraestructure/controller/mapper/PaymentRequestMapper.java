package world.inclub.ticket.infraestructure.controller.mapper;

import org.springframework.stereotype.Component;
import world.inclub.ticket.application.dto.MakePaymentCommand;
import world.inclub.ticket.infraestructure.controller.dto.MakePaymentRequest;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
public class PaymentRequestMapper {

    public MakePaymentCommand toCommand(MakePaymentRequest request) {

        MakePaymentCommand.Voucher voucher = request.getVoucher() == null ? null : toCommandVoucher(request.getVoucher());

        List<MakePaymentCommand.ZoneSelection> commandZones = request.getZones() == null ? List.of() :
                request.getZones().stream().map(this::toCommandZoneSelection).toList();

        List<MakePaymentCommand.Attendee> commandAttendees = request.getAttendees() == null ? List.of() :
                request.getAttendees().stream().map(this::toCommandAttendee).toList();

        List<MakePaymentCommand.Attendee> commandAttendeePackages = request.getAttendeePackages() == null ? List.of() :
                request.getAttendeePackages().stream().map(this::toCommandAttendee).toList();

        List<MakePaymentCommand.PackageSelection> commandPackages = request.getPackages() == null ? List.of() :
                request.getPackages().stream().map(this::toCommandPackageSelection).toList();

        BigDecimal normalizedAmount = request.getTotalAmount() == null
                ? null
                : request.getTotalAmount().setScale(2, RoundingMode.HALF_UP);

        return new MakePaymentCommand(
                request.getUserId(),
                request.getEventId(),
                request.getMethod(),
                request.getPaymentSubTypeId(),
                request.getCurrencyType(),
                commandPackages,
                commandAttendeePackages,
                commandZones,
                commandAttendees,
                voucher,
                normalizedAmount
        );
    }

    private MakePaymentCommand.ZoneSelection toCommandZoneSelection(MakePaymentRequest.ZoneSelection z) {
        return new MakePaymentCommand.ZoneSelection(
                z.getEventZoneId(),
                z.getQuantity()
        );
    }

    private MakePaymentCommand.Attendee toCommandAttendee(MakePaymentRequest.Attendee a) {
        return new MakePaymentCommand.Attendee(
                a.getEventZoneId(),
                a.getDocumentTypeId(),
                a.getDocumentNumber(),
                a.getEmail(),
                a.getName(),
                a.getLastName()
        );
    }

    private MakePaymentCommand.PackageSelection toCommandPackageSelection(MakePaymentRequest.PackageSelection p) {
        return new MakePaymentCommand.PackageSelection(
                p.getPackageId(),
                p.getQuantity()
        );
    }

    private MakePaymentCommand.Voucher toCommandVoucher(MakePaymentRequest.Voucher v) {
        return new MakePaymentCommand.Voucher(
                v.getOperationNumber(),
                v.getNote(),
                v.getImage()
        );
    }
}
