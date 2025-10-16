package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.PublicEventWithZonesResponseDto;
import world.inclub.ticket.api.mapper.UserTicketDetailsMapper;
import world.inclub.ticket.api.mapper.UserTicketMapper;
import world.inclub.ticket.application.service.interfaces.GetEventWithZonesByIdUseCase;
import world.inclub.ticket.application.service.interfaces.GetUserTicketsUseCase;
import world.inclub.ticket.domain.enums.PaymentStatus;
import world.inclub.ticket.domain.model.EventStatus;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.domain.model.ticket.Ticket;
import world.inclub.ticket.domain.ports.ticket.AttendeeRepositoryPort;
import world.inclub.ticket.domain.ports.ticket.TicketRepositoryPort;
import world.inclub.ticket.domain.ports.payment.PaymentRepositoryPort;
import world.inclub.ticket.domain.repository.EventRepository;
import world.inclub.ticket.infraestructure.controller.dto.PageResponse;
import world.inclub.ticket.infraestructure.controller.dto.UserTicketDetailsResponse;
import world.inclub.ticket.infraestructure.controller.dto.UserTicketResponse;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;
import world.inclub.ticket.utils.PageResponseBuilder;
import world.inclub.ticket.utils.TimeLima;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GetUserTicketsService implements GetUserTicketsUseCase {

    private final TicketRepositoryPort ticketRepositoryPort;
    private final PaymentRepositoryPort paymentRepositoryPort;
    private final AttendeeRepositoryPort attendeeRepositoryPort;
    private final GetEventWithZonesByIdUseCase getEventWithZonesByIdUseCase;
    private final EventRepository eventRepository;
    private final UserTicketMapper userTicketMapper;
    private final UserTicketDetailsMapper userTicketDetailsMapper;

    @Override
    public Mono<PageResponse<UserTicketResponse>> getUserTickets(Long userId, EventStatus status, Pageable pageable) {
        boolean past = status == EventStatus.INACTIVE;
        LocalDate now = TimeLima.getLimaDate();
        Flux<Payment> payments = paymentRepositoryPort.findByUserIdAndStatusAndEventDateRange(userId, PaymentStatus.APPROVED, past, now, pageable)
                .switchIfEmpty(Mono.error(new NotFoundException("No payments found for user")));
        Mono<Long> totalCount = paymentRepositoryPort.countByUserIdAndStatusAndEventDateRange(userId, PaymentStatus.APPROVED, past, now);

        return Mono.zip(payments.collectList(), totalCount)
                .flatMap(tuple -> {
                    List<Payment> paymentList = tuple.getT1();
                    long count = tuple.getT2();

                    List<Long> paymentIds = paymentList.stream()
                            .map(Payment::getId)
                            .toList();

                    List<Integer> eventIds = paymentList.stream()
                            .map(payment -> payment.getEventId().intValue())
                            .distinct()
                            .toList();

                    Flux<PublicEventWithZonesResponseDto> eventMono = eventRepository.findByIdIn(eventIds)
                            .switchIfEmpty(Mono.error(new NotFoundException("No event found")))
                            .flatMap(event -> getEventWithZonesByIdUseCase.getEventWithZonesById(event.getEventId()));

                    if (past) {
                        return eventMono.collectList()
                                .flatMap(events -> ticketRepositoryPort.findByPaymentIdIn(paymentIds)
                                        .switchIfEmpty(Mono.error(new NotFoundException("No tickets found")))
                                        .collectList()
                                        .map(tickets -> {
                                            List<UserTicketResponse> userTicketResponses = paymentList.stream()
                                                    .map(payment -> {
                                                        PublicEventWithZonesResponseDto event = events.stream()
                                                                .filter(e -> e.getEventId().equals(payment.getEventId().intValue()))
                                                                .findFirst()
                                                                .orElse(null);

                                                        return userTicketMapper.toResponse(event, List.of(), payment);
                                                    })
                                                    .toList();
                                            return PageResponseBuilder.build(userTicketResponses, pageable, count);
                                        }));
                    }

                    Flux<Ticket> ticketsFlux = ticketRepositoryPort.findByPaymentIdIn(paymentIds)
                            .switchIfEmpty(Mono.error(new NotFoundException("No tickets found")));

                    return Mono.zip(eventMono.collectList(), ticketsFlux.collectList())
                            .map(eventsAndTickets -> {
                                List<PublicEventWithZonesResponseDto> events = eventsAndTickets.getT1();
                                List<Ticket> tickets = eventsAndTickets.getT2();

                                List<UserTicketResponse> userTicketResponses = paymentList.stream()
                                        .map(payment -> {
                                            PublicEventWithZonesResponseDto event = events.stream()
                                                    .filter(e -> e.getEventId().equals(payment.getEventId().intValue()))
                                                    .findFirst()
                                                    .orElse(null);

                                            List<Ticket> ticketsList = tickets.stream()
                                                    .filter(ticket -> ticket.getPaymentId().equals(payment.getId()))
                                                    .toList();

                                            return userTicketMapper.toResponse(event, ticketsList, payment);
                                        })
                                        .toList();
                                return PageResponseBuilder.build(userTicketResponses, pageable, count);
                            });


                });
    }

    @Override
    public Mono<PageResponse<UserTicketDetailsResponse>> getUserTicketsDetails(Long paymentId, Pageable pageable) {

        Mono<Payment> paymentMono = paymentRepositoryPort.findById(paymentId)
                .switchIfEmpty(Mono.error(new NotFoundException("Payment not found with id: " + paymentId)));

        Flux<Ticket> ticketsFlux = ticketRepositoryPort.findByPaymentId(paymentId, pageable)
                .switchIfEmpty(Mono.error(new NotFoundException("No tickets found for payment id: " + paymentId)));

        return Mono.zip(paymentMono, ticketsFlux.collectList())
                .flatMap(tuple -> {
                    Payment payment = tuple.getT1();
                    List<Ticket> tickets = tuple.getT2();
                    Mono<PublicEventWithZonesResponseDto> eventMono = eventRepository.findById(payment.getEventId().intValue())
                            .switchIfEmpty(Mono.error(new NotFoundException("Event not found with id: " + payment.getEventId())))
                            .flatMap(event -> getEventWithZonesByIdUseCase.getEventWithZonesById(event.getEventId()));

                    List<Long> attendeeIds = tickets.stream()
                            .map(Ticket::getAttendeeId)
                            .distinct()
                            .toList();

                    Flux<Attendee> attendeeFlux = attendeeRepositoryPort.findAttendeesByIdIn(attendeeIds)
                            .switchIfEmpty(Mono.error(new NotFoundException("No attendees found for the given IDs")));

                    return Mono.zip(eventMono, attendeeFlux.collectList())
                            .map(eventAndAttendees -> {
                                PublicEventWithZonesResponseDto event = eventAndAttendees.getT1();
                                List<Attendee> attendees = eventAndAttendees.getT2();
                                List<UserTicketDetailsResponse> userTicketDetailsResponses = tickets.stream()
                                        .map(ticket -> {
                                            Attendee attendee = attendees.stream()
                                                    .filter(a -> a.getId().equals(ticket.getAttendeeId()))
                                                    .findFirst()
                                                    .orElse(null);
                                            return userTicketDetailsMapper.toResponse(payment, event, ticket, attendee);
                                        })
                                        .toList();
                                return PageResponseBuilder.build(userTicketDetailsResponses, pageable, userTicketDetailsResponses.size());
                            });
                });
    }

}
