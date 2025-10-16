package world.inclub.ticket.application.service.ticket;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuple3;
import reactor.util.function.Tuples;
import world.inclub.ticket.application.dto.NominationStatusResponse;
import world.inclub.ticket.application.dto.UpdateAttendeesCommand;
import world.inclub.ticket.application.factory.AttendeeFactory;
import world.inclub.ticket.application.factory.NominationStatusResponseMapper;
import world.inclub.ticket.application.factory.TicketFactory;
import world.inclub.ticket.application.factory.TicketNominationHistoryFactory;
import world.inclub.ticket.application.port.ticket.TicketNominationService;
import world.inclub.ticket.application.port.ticket.TicketPdfService;
import world.inclub.ticket.application.port.ticket.TicketStorageService;
import world.inclub.ticket.domain.enums.PaymentStatus;
import world.inclub.ticket.domain.model.Event;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.domain.model.ticket.Ticket;
import world.inclub.ticket.domain.model.ticket.TicketNominationHistory;
import world.inclub.ticket.domain.model.ticket.TicketNominationStatus;
import world.inclub.ticket.domain.ports.payment.PaymentRepositoryPort;
import world.inclub.ticket.domain.ports.ticket.AttendeeRepositoryPort;
import world.inclub.ticket.domain.ports.ticket.TicketNominationHistoryRepositoryPort;
import world.inclub.ticket.domain.ports.ticket.TicketRepositoryPort;
import world.inclub.ticket.domain.repository.EventRepository;
import world.inclub.ticket.infraestructure.controller.dto.PageResponse;
import world.inclub.ticket.infraestructure.exceptions.BadRequestException;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;
import world.inclub.ticket.utils.PageResponseBuilder;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketNominationServiceImpl implements TicketNominationService {

    private final PaymentRepositoryPort paymentRepositoryPort;
    private final TicketRepositoryPort ticketRepositoryPort;
    private final TicketNominationHistoryRepositoryPort ticketNominationHistoryRepositoryPort;
    private final AttendeeRepositoryPort attendeeRepositoryPort;
    private final EventRepository eventRepository;
    private final TicketPdfService ticketPdfService;
    private final NominationStatusResponseMapper nominationStatusResponseMapper;
    private final TicketFactory ticketFactory;
    private final AttendeeFactory attendeeFactory;
    private final TicketNominationHistoryFactory ticketNominationHistoryFactory;
    private final TicketStorageService ticketStorageService;

    @Override
    public Mono<PageResponse<NominationStatusResponse>> getUserPaymentsWithNominationStatus(Long userId, Pageable pageable) {
        PaymentStatus status = PaymentStatus.APPROVED;
        Flux<Payment> payments = paymentRepositoryPort.findByUserIdAndStatus(userId, status, pageable)
                .switchIfEmpty(Mono.error(new NotFoundException("No payments approved found for user")));
        Mono<Long> totalCount = paymentRepositoryPort.countByUserIdAndStatus(userId, status);

        return Mono.zip(totalCount, payments.collectList())
                .flatMap(tuple -> {
                    Long total = tuple.getT1();
                    List<Payment> paymentList = tuple.getT2();

                    List<Long> paymentIds = paymentList.stream()
                            .map(Payment::getId)
                            .toList();

                    List<Integer> eventIds = paymentList.stream()
                            .map(payment -> payment.getEventId().intValue())
                            .distinct()
                            .collect(Collectors.toList());

                    Flux<Ticket> ticketsFlux = ticketRepositoryPort
                            .getByNominationStatusIdAndPaymentIdIn(TicketNominationStatus.NOT_NOMINATED.getId(), paymentIds);

                    Flux<Event> eventFlux = eventRepository.findByIdIn(eventIds);

                    return Mono.zip(ticketsFlux.collectList(), eventFlux.collectList())
                            .map(ticketsAndEventsTuple -> {
                                List<Ticket> tickets = ticketsAndEventsTuple.getT1();
                                List<Event> events = ticketsAndEventsTuple.getT2();

                                List<NominationStatusResponse> responses = paymentList.stream()
                                        .map(payment -> {
                                            List<Ticket> notNominatedTickets = tickets.stream()
                                                    .filter(ticket -> ticket.getPaymentId().equals(payment.getId()))
                                                    .toList();

                                            Event event = events.stream()
                                                    .filter(e -> e.getEventId().equals(payment.getEventId().intValue()))
                                                    .findFirst()
                                                    .orElse(null);

                                            return nominationStatusResponseMapper.toResponse(payment, event, notNominatedTickets);
                                        })
                                        .toList();

                                return PageResponseBuilder.build(responses, pageable, total);
                            });
                });
    }

    @Override
    @Transactional
    public Mono<String> nominateTicket(UpdateAttendeesCommand command) {

        Mono<Payment> paymentMono = paymentRepositoryPort.findById(command.paymentId())
                .switchIfEmpty(Mono.error(new BadRequestException("Payment not found for ID: " + command.paymentId())));
        List<UUID> ticketUuids = command.attendees().stream()
                .map(UpdateAttendeesCommand.Attendee::ticketUuid)
                .toList();

        return paymentMono.flatMap(payment ->
                ticketRepositoryPort.findByTicketUuidIn(ticketUuids)
                        .switchIfEmpty(Mono.error(new BadRequestException("No tickets found for the provided UUIDs")))
                        .collectList()
                        .flatMap(tickets -> {

                            if (tickets.size() != command.attendees().size()) {
                                return Mono.error(new BadRequestException("Some tickets were not found for the provided UUIDs"));
                            }

                            Long paymentId = command.paymentId();
                            if (tickets.stream().anyMatch(t -> !t.getPaymentId().equals(paymentId))) {
                                return Mono.error(new BadRequestException("One or more tickets do not belong to the specified payment"));
                            }

                            List<Long> attendeeIds = tickets.stream()
                                    .map(Ticket::getAttendeeId)
                                    .distinct()
                                    .toList();

                            Flux<Attendee> attendeesFlux = attendeeRepositoryPort.findAttendeesByIdIn(attendeeIds);

                            return attendeesFlux.collectList()
                                    .flatMap(existingAttendees -> {
                                        List<Attendee> updatedAttendees = buildUpdatedAttendees(command, existingAttendees, tickets);

                                        return buildUpdatedTicketsFlux(updatedAttendees, tickets, payment)
                                                .collectList()
                                                .flatMap(results -> {
                                                    List<Ticket> updatedTickets = results.stream()
                                                            .map(Tuple2::getT1)
                                                            .toList();
                                                    List<TicketNominationHistory> histories = results.stream()
                                                            .map(Tuple2::getT2)
                                                            .toList();

                                                    return saveAll(updatedAttendees, updatedTickets, histories)
                                                            .thenReturn("Tickets nominated successfully");
                                                });
                                    });
                        }));
    }

    private List<Attendee> buildUpdatedAttendees(
            UpdateAttendeesCommand command,
            List<Attendee> existingAttendees,
            List<Ticket> tickets
    ) {
        return command.attendees().stream()
                .map(cmdAttendee -> {
                    Attendee existingAttendee = existingAttendees.stream()
                            .filter(a -> a.getId().equals(
                                    tickets.stream()
                                            .filter(t -> t.getTicketUuid().equals(cmdAttendee.ticketUuid()))
                                            .findFirst()
                                            .map(Ticket::getAttendeeId)
                                            .orElse(null)))
                            .findFirst()
                            .orElseThrow(() ->
                                    new BadRequestException("Attendee not found for ticket UUID: " + cmdAttendee.ticketUuid())
                            );

                    return attendeeFactory.updateAttendeeWithDetails(existingAttendee, cmdAttendee);
                })
                .toList();
    }

    private Flux<Tuple2<Ticket, TicketNominationHistory>> buildUpdatedTicketsFlux(
            List<Attendee> updatedAttendees,
            List<Ticket> tickets,
            Payment payment
    ) {
        return Flux.fromIterable(tickets)
                .flatMap(ticket -> {
                    Attendee updatedAttendee = updatedAttendees.stream()
                            .filter(a -> a.getId().equals(ticket.getAttendeeId()))
                            .findFirst()
                            .orElseThrow(() ->
                                    new BadRequestException("Updated attendee not found for ticket UUID: " + ticket.getTicketUuid())
                            );
                    Long oldStatusId = ticket.getNominationStatusId();
                    Ticket updatedTicket = ticketFactory.updateTicketForNomination(ticket);
                    return ticketPdfService.generatePdfForTicket(ticket, updatedAttendee, payment)
                            .flatMap(ticketStorageService::saveTicket)
                            .map(pdfUrl -> {
                                Ticket finalTicket = ticketFactory.updateTicketWithQr(updatedTicket, pdfUrl);

                                TicketNominationHistory history =
                                        ticketNominationHistoryFactory.createByUser(oldStatusId, finalTicket, payment);
                                return Tuples.of(finalTicket, history);
                            });
                });
    }

    private Mono<Tuple3<List<Attendee>, List<Ticket>, List<TicketNominationHistory>>> saveAll(
            List<Attendee> attendees,
            List<Ticket> tickets,
            List<TicketNominationHistory> histories
    ) {
        return Mono.zip(
                attendeeRepositoryPort.saveAll(attendees).collectList(),
                ticketRepositoryPort.saveAll(tickets).collectList(),
                ticketNominationHistoryRepositoryPort.saveAll(histories).collectList()
        );
    }

}
