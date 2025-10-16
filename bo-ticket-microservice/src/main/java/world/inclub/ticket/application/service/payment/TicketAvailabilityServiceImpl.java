package world.inclub.ticket.application.service.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.application.dto.MakePaymentCommand;
import world.inclub.ticket.application.dto.TicketQrPayload;
import world.inclub.ticket.application.port.KeyProvider;
import world.inclub.ticket.application.port.QrCryptoService;
import world.inclub.ticket.application.port.ticket.TicketAvailabilityService;
import world.inclub.ticket.domain.enums.TicketStatus;
import world.inclub.ticket.domain.model.ticket_package.EventPackageItem;
import world.inclub.ticket.domain.ports.ticket.TicketRepositoryPort;
import world.inclub.ticket.domain.ports.ticket_package.EventPackageItemRepositoryPort;
import world.inclub.ticket.domain.repository.EventZoneRepository;
import world.inclub.ticket.infraestructure.exceptions.BadRequestException;
import world.inclub.ticket.utils.TimeLima;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketAvailabilityServiceImpl implements TicketAvailabilityService {

    private final EventZoneRepository eventZonePort;
    private final QrCryptoService qrCryptoService;
    private final KeyProvider keyProvider;
    private final TicketRepositoryPort ticketRepositoryPort;
    private final EventPackageItemRepositoryPort eventPackageItemRepositoryPort;

    @Override
    public Mono<Void> reserveAvailability(MakePaymentCommand command) {
        List<MakePaymentCommand.ZoneSelection> zones = command.zones();
        List<MakePaymentCommand.PackageSelection> packages = command.packages();

        Map<Integer, Integer> zoneQuantities = new HashMap<>();

        if (zones != null && !zones.isEmpty()) {
            zones.forEach(zone ->
                    zoneQuantities.merge(zone.eventZoneId().intValue(), zone.quantity(), Integer::sum)
            );
        }

        Mono<Void> packageReservation = Mono.empty();
        if (packages != null && !packages.isEmpty()) {
            packageReservation = Flux.fromIterable(packages)
                    .flatMap(pkg ->
                            eventPackageItemRepositoryPort.findByTicketPackageId(pkg.packageId())
                                    .collectList()
                                    .map(items -> {
                                        for (EventPackageItem item : items) {
                                            int totalPerPackage = (item.getQuantity() + item.getQuantityFree()) * pkg.quantity();
                                            zoneQuantities.merge(item.getEventZoneId().intValue(), totalPerPackage, Integer::sum);
                                        }
                                        return true;
                                    })
                    )
                    .then();
        }

        return packageReservation.then(
                Flux.fromIterable(zoneQuantities.entrySet())
                        .flatMap(entry ->
                                eventZonePort.findById(entry.getKey())
                                        .flatMap(zone -> {
                                            if (zone.getCapacity() < entry.getValue()) {
                                                return Mono.error(new BadRequestException(
                                                        "No hay stock suficiente en zona " + entry.getKey()
                                                ));
                                            }
                                            return eventZonePort.reserveAvailableTickets(entry.getKey(), entry.getValue())
                                                    .flatMap(reserved -> {
                                                        if (reserved == 0) {
                                                            return Mono.error(new BadRequestException(
                                                                    "Error al reservar en zona: " + entry.getKey()
                                                            ));
                                                        }
                                                        return Mono.empty();
                                                    });
                                        })
                        )
                        .then()
        );
    }

    @Override
    public Mono<TicketQrPayload> validateQr(String qrCode) {
        return Mono.fromCallable(() -> qrCryptoService.decryptJson(qrCode, keyProvider.getSecretKey()))
                .flatMap(decryptedJson -> {
                    ObjectMapper mapper = new ObjectMapper();
                    try {
                        TicketQrPayload payload = mapper.readValue(decryptedJson, TicketQrPayload.class);
                        return ticketRepositoryPort.findByUuid(payload.ticketUuid())
                                .switchIfEmpty(Mono.error(new BadRequestException("Code not found")))
                                .map(ticket ->
                                        new TicketQrPayload(
                                                payload.ticketUuid(),
                                                payload.eventName(),
                                                payload.zoneName(),
                                                ticket.getStatus(),
                                                payload.attendee()
                                        )
                                );
                    } catch (JsonProcessingException e) {
                        return Mono.error(new BadRequestException("Invalid QR code format"));
                    }
                });
    }

    @Override
    public Mono<Boolean> updateQrStatus(UUID ticketUuid, TicketStatus status) {
        return ticketRepositoryPort.findByUuid(ticketUuid)
                .filter(ticket -> ticket.getStatus().equals(TicketStatus.ACTIVE))
                .switchIfEmpty(Mono.error(new BadRequestException("Ticket not active")))
                .flatMap(ticket -> {
                    ticket.setStatus(status);
                    ticket.setUsedAt(TimeLima.getLimaTime());
                    return ticketRepositoryPort.save(ticket)
                            .thenReturn(true);
                })
                .switchIfEmpty(Mono.just(false));
    }

}
