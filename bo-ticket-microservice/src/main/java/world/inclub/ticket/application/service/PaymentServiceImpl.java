package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;
import world.inclub.ticket.api.dto.EventResponseDto;
import world.inclub.ticket.api.mapper.PaymentMapper;
import world.inclub.ticket.application.dto.MakePaymentCommand;
import world.inclub.ticket.application.dto.PaymentAmounts;
import world.inclub.ticket.application.dto.ProcessWalletPaymentCommand;
import world.inclub.ticket.api.dto.PaymentResponseDto;
import world.inclub.ticket.application.factory.*;
import world.inclub.ticket.application.port.payment.PaymentAmountService;
import world.inclub.ticket.application.port.payment.PaymentStatusService;
import world.inclub.ticket.application.port.ticket.TicketAvailabilityService;
import world.inclub.ticket.application.port.ticket.TicketPdfService;
import world.inclub.ticket.application.port.ticket.TicketStorageService;
import world.inclub.ticket.application.port.VoucherStorageService;
import world.inclub.ticket.application.port.WalletPaymentService;
import world.inclub.ticket.application.service.interfaces.*;
import world.inclub.ticket.domain.enums.CurrencyType;
import world.inclub.ticket.domain.enums.PaymentStatus;
import world.inclub.ticket.domain.enums.UserType;
import world.inclub.ticket.domain.model.*;
import world.inclub.ticket.domain.model.payment.PaymentDetail;
import world.inclub.ticket.domain.ports.payment.*;
import world.inclub.ticket.domain.ports.ticket_package.EventPackageItemRepositoryPort;
import world.inclub.ticket.domain.repository.EventZoneRepository;
import world.inclub.ticket.infraestructure.kafka.topics.PaymentRejectedEvent;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.model.payment.PaymentRejection;
import world.inclub.ticket.domain.model.payment.PaymentVoucher;
import world.inclub.ticket.domain.model.ticket.Attendee;
import world.inclub.ticket.domain.model.ticket.Ticket;
import world.inclub.ticket.domain.ports.MemberRepositoryPort;
import world.inclub.ticket.domain.ports.WalletRepositoryPort;
import world.inclub.ticket.domain.ports.ticket.AttendeeRepositoryPort;
import world.inclub.ticket.domain.ports.ticket.TicketRepositoryPort;
import world.inclub.ticket.domain.repository.UsersRepository;
import world.inclub.ticket.domain.repository.EventRepository;
import world.inclub.ticket.domain.repository.SeatTypeRepository;
import world.inclub.ticket.infraestructure.exceptions.BadRequestException;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;
import world.inclub.ticket.infraestructure.kafka.producer.PaymentEventProducer;
import world.inclub.ticket.utils.TimeLima;
import world.inclub.ticket.infraestructure.config.constants.Constants;
import world.inclub.ticket.infraestructure.controller.dto.ValidatePaymentsFilterRequest;
import world.inclub.ticket.infraestructure.controller.dto.PaginatedValidatePaymentsResponseDto;
import world.inclub.ticket.infraestructure.controller.mapper.ValidatePaymentMapper;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import world.inclub.ticket.domain.model.Member;
import org.springframework.http.codec.multipart.FilePart;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService, CanModifyRejectedPaymentUseCase, FinalizeRejectedPaymentUseCase, GetPendingPaymentsUseCase, CorrectRejectedPaymentUseCase {

    private final WalletPaymentService walletPaymentService;
    private final VoucherStorageService voucherStorageService;
    private final TicketStorageService ticketStorageService;
    private final PaymentStatusService paymentStatusService;
    private final TicketPdfService ticketPdfService;
    private final TicketAvailabilityService ticketAvailabilityService;
    private final PaymentAmountService paymentAmountService;

    private final WalletRepositoryPort walletRepositoryPort;
    private final PaymentRepositoryPort paymentRepositoryPort;
    private final PaymentRejectionRepositoryPort paymentRejectionRepositoryPort;
    private final PaymentVoucherRepositoryPort paymentVoucherRepositoryPort;
    private final PaymentDetailRepositoryPort paymentDetailRepositoryPort;
    private final PaymentSubTypeRepositoryPort paymentSubTypeRepositoryPort;
    private final MemberRepositoryPort memberRepositoryPort;
    private final AttendeeRepositoryPort attendeeRepositoryPort;
    private final TicketRepositoryPort ticketRepositoryPort;
    private final UsersRepository usersRepository;
    private final EventRepository eventRepository;
    private final EventZoneRepository eventZonePort;
    private final SeatTypeRepository seatTypeRepository;

    private final PaymentFactory paymentFactory;
    private final PaymentVoucherFactory paymentVoucherFactory;
    private final PaymentDetailFactory paymentDetailFactory;
    private final AttendeeFactory attendeeFactory;
    private final TicketFactory ticketFactory;
    private final PaymentMapper paymentMapper;
    private final PaymentRejectionFactory paymentRejectionFactory;
    private final PaymentEventProducer paymentEventProducer;
    private final ValidatePaymentMapper validatePaymentMapper;
    private final RestoreEventZoneCapacityUseCase restoreEventZoneCapacityUseCase;
    private final GetEventUseCase getEventUseCase;
    private final TicketPaymentNotificationFactory ticketPaymentNotificationFactory;
    private final PaymentTypeRepositoryPort paymentTypeRepositoryPort;
    private final EventPackageItemRepositoryPort eventPackageItemRepositoryPort;

    @Override
    @Transactional
    public Mono<String> processPayment(MakePaymentCommand command) {
        return ticketAvailabilityService.reserveAvailability(command)
                .then(validatePaymentMethod(command))
                .then(paymentAmountService.validateAndCalculate(command))
                .flatMap(amounts -> createPayment(command, amounts))
                .flatMap(payment -> registerAttendees(command, payment.getId())
                        .collectList()
                        .flatMap(attendees -> paymentNotification(payment)
                                .then(generateTickets(payment, attendees, command))))
                .thenReturn("Payment processed successfully");
    }

    private Mono<Void> validatePaymentMethod(MakePaymentCommand command) {
        return switch (command.method()) {
            case VOUCHER, OTROS -> validateVoucher(command.voucher());
            case WALLET -> validateWallet(command);
//            case PAYPAL -> validatePayPal();
            default -> Mono.error(new BadRequestException("Unsupported payment method"));
        };
    }

    private Flux<Attendee> registerAttendees(MakePaymentCommand command, Long paymentId) {
        List<Flux<Attendee>> allAttendees = new ArrayList<>();
        if (command.attendees() != null && !command.attendees().isEmpty()) {
            List<MakePaymentCommand.Attendee> independentAttendees =
                    command.attendees().stream()
                            .filter(a -> command.zones() == null || command.zones().stream()
                                    .noneMatch(z -> Objects.equals(z.eventZoneId(), a.eventZoneId())))
                            .toList();

            if (!independentAttendees.isEmpty()) {
                allAttendees.add(fillAttendees(
                        independentAttendees,
                        independentAttendees.size(),
                        paymentId,
                        i -> independentAttendees.get(i).eventZoneId()
                ));
            }
        }
        if (command.zones() != null && !command.zones().isEmpty()) {
            for (MakePaymentCommand.ZoneSelection zone : command.zones()) {
                List<MakePaymentCommand.Attendee> userFilled =
                        command.attendees() != null
                                ? command.attendees().stream()
                                .filter(a -> Objects.equals(a.eventZoneId(), zone.eventZoneId()))
                                .toList()
                                : Collections.emptyList();

                allAttendees.add(fillAttendees(
                        userFilled,
                        zone.quantity(),
                        paymentId,
                        i -> zone.eventZoneId()
                ));
            }
        }

        if (command.packages() != null && !command.packages().isEmpty()) {
            for (MakePaymentCommand.PackageSelection pkgSel : command.packages()) {
                Flux<Attendee> packageAttendees = eventPackageItemRepositoryPort.findByTicketPackageId(pkgSel.packageId())
                        .collectList()
                        .flatMapMany(items -> {
                            int totalTickets = items.stream()
                                    .mapToInt(i -> (i.getQuantity() + i.getQuantityFree()) * pkgSel.quantity())
                                    .sum();

                            List<MakePaymentCommand.Attendee> userFilled =
                                    command.attendeePackages() != null
                                            ? command.attendeePackages()
                                            : Collections.emptyList();

                            return fillAttendees(
                                    userFilled,
                                    totalTickets,
                                    paymentId,
                                    i -> {
                                        int zoneIndex = i % items.size();
                                        return items.get(zoneIndex).getEventZoneId();
                                    }
                            );
                        });
                allAttendees.add(packageAttendees);
            }
        }
        return Flux.merge(allAttendees)
                .collectList()
                .flatMapMany(attendeeRepositoryPort::saveAll);
    }


    private Flux<Attendee> fillAttendees(
            List<MakePaymentCommand.Attendee> userFilled,
            int totalTickets,
            Long paymentId,
            Function<Integer, Long> zoneResolver
    ) {
        final int[] userIndex = {0};

        return Flux.range(0, totalTickets)
                .map(i -> {
                    if (userIndex[0] < userFilled.size()) {
                        return attendeeFactory.createAttendee(userFilled.get(userIndex[0]++), paymentId);
                    } else {
                        return attendeeFactory.createAttendeeWithoutDetails(zoneResolver.apply(i), paymentId);
                    }
                });
    }


    private Flux<Attendee> createAttendeesFromZones(List<MakePaymentCommand.ZoneSelection> commandZones, Long paymentId) {
        return Flux.fromIterable(commandZones)
                .flatMap(zone -> Flux.range(0, zone.quantity())
                        .map(i -> attendeeFactory.createAttendeeWithoutDetails(zone.eventZoneId(), paymentId)))
                .collectList()
                .flatMapMany(attendeeRepositoryPort::saveAll);
    }

    private Flux<Attendee> createAttendeesFromCommand(List<MakePaymentCommand.Attendee> commandAttendees, Long paymentId) {
        List<Attendee> attendees = commandAttendees.stream()
                .map(attendee -> attendeeFactory.createAttendee(attendee, paymentId))
                .toList();
        return attendeeRepositoryPort.saveAll(attendees);
    }

    private Mono<Void> validateVoucher(MakePaymentCommand.Voucher voucher) {
        if (voucher == null) {
            return Mono.error(new BadRequestException("Voucher is required for this payment method"));
        }
        return Mono.empty();
    }

    private Mono<Void> validateWallet(MakePaymentCommand command) {
        if (command.currencyType() != CurrencyType.USD) {
            return Mono.error(new BadRequestException("Wallet payments must be in USD"));
        }

        return walletRepositoryPort.getByUserId(command.userId())
                .switchIfEmpty(Mono.error(new NotFoundException("Wallet not found for user")))
                .flatMap(wallet -> {
                    if (wallet.availableBalance().compareTo(command.totalAmount()) < 0) {
                        return Mono.error(new BadRequestException("Insufficient wallet balance"));
                    }
                    return Mono.empty();
                });
    }

    private Mono<Payment> createPayment(MakePaymentCommand command, PaymentAmounts amounts) {
        return Mono.zip(
                        memberRepositoryPort.getMemberByIdUser(command.userId())
                                .map(Optional::of)
                                .defaultIfEmpty(Optional.empty()),
                        usersRepository.findById(command.userId().intValue())
                                .map(Optional::of)
                                .defaultIfEmpty(Optional.empty())
                )
                .flatMap(tuple -> {
                    Optional<Member> memberOpt = tuple.getT1();
                    Optional<Users> userOpt = tuple.getT2();

                    if (memberOpt.isEmpty() && userOpt.isEmpty()) {
                        return Mono.error(new NotFoundException("User not found with ID " + command.userId()));
                    }

                    if (memberOpt.isPresent() && userOpt.isEmpty()) {
                        return Mono.just(UserType.MEMBER);
                    }

                    if (memberOpt.isEmpty()) {
                        return Mono.just(UserType.GUEST);
                    }

                    Member member = memberOpt.get();
                    Users user = userOpt.get();
                    if (member.name().equals(user.getFirstName()) &&
                            member.lastName().equals(user.getLastName()) &&
                            member.email().equals(user.getEmail())) {
                        return Mono.just(UserType.MEMBER);
                    }
                    return Mono.just(UserType.GUEST);

                })
                .flatMap(member -> switch (command.method()) {
                    case VOUCHER, OTROS -> {
                        yield Mono.zip(
                                        paymentRepositoryPort.save(paymentFactory.createPaymentWithPendingStatus(command, amounts, member)),
                                        voucherStorageService.saveVoucher(command.voucher().image()))
                                .flatMap(tuple2 -> {
                                    Payment payment = tuple2.getT1();
                                    String imageUrl = tuple2.getT2();
                                    return Mono.zip(
                                                    paymentVoucherRepositoryPort.save(paymentVoucherFactory.createPaymentVoucher(command, payment.getId(), imageUrl)),
                                                    savePaymentDetails(payment, amounts))
                                            .thenReturn(payment);
                                });
                    }
                    case WALLET -> {
                        ProcessWalletPaymentCommand process = new ProcessWalletPaymentCommand(command.userId(), amounts.total(), "Compra de entradas");
                        yield walletPaymentService.sendWalletPayment(process)
                                .then(paymentRepositoryPort.save(paymentFactory.createPaymentWithApprovedStatus(command, amounts, member)))
                                .flatMap(payment -> savePaymentDetails(payment, amounts)
                                        .thenReturn(payment));
                    }
                    default -> Mono.error(new BadRequestException("Unsupported payment method"));
                });
    }

    private Mono<List<PaymentDetail>> savePaymentDetails(Payment payment, PaymentAmounts amounts) {
        List<PaymentDetail> details = amounts.items().stream()
                .map(item -> paymentDetailFactory.create(payment, item))
                .toList();
        return paymentDetailRepositoryPort.saveAll(details).collectList();
    }

    private Mono<Void> paymentNotification(Payment payment) {
        Mono<Tuple2<String, String>> userDataMono;
        if (payment.getUserType().equals(UserType.MEMBER)) {
            userDataMono = memberRepositoryPort.getMemberByIdUser(payment.getUserId())
                    .map(member -> Tuples.of(member.email(), member.name() + " " + member.lastName()));
        } else {
            userDataMono = usersRepository.findById(payment.getUserId().intValue())
                    .map(user -> Tuples.of(user.getEmail(), user.getFirstName() + " " + user.getLastName()));
        }

        Mono<EventResponseDto> eventMono = getEventUseCase.getEvent(payment.getEventId().intValue());

        return Mono.zip(userDataMono, eventMono)
                .flatMap(tuple -> {
                    Tuple2<String, String> userData = tuple.getT1();
                    EventResponseDto event = tuple.getT2();

                    return switch (payment.getStatus()) {
                        case APPROVED -> paymentStatusService.sendPaymentNotification
                                (ticketPaymentNotificationFactory.toApprovedPaymentMessage(userData, event, payment));

                        case PENDING -> paymentTypeRepositoryPort.findAllPaymentTypes()
                                .collectList()
                                .flatMap(paymentTypes ->
                                        paymentStatusService.sendPaymentNotification
                                                (ticketPaymentNotificationFactory.toPendingPaymentMessage(userData, event, paymentTypes, payment))
                                );

                        case TEMPORAL_REJECTED -> paymentRejectionRepositoryPort.findByPaymentId(payment.getId())
                                .flatMap(paymentRejection -> paymentStatusService.sendPaymentNotification
                                        (ticketPaymentNotificationFactory.toTemporalRejectedPaymentMessage(userData, event, payment, paymentRejection)));

                        case REJECTED, CANCELLED, EXPIRED -> Mono.empty();
                    };
                });
    }

    private Mono<Void> generateTickets(Payment payment, List<Attendee> attendees, MakePaymentCommand command) {
        if (!payment.getStatus().equals(PaymentStatus.APPROVED)) {
            return Mono.empty();
        }
        return generateTickets(payment, attendees);
    }


    private Mono<Void> generateNominatedTickets(Payment payment, List<Attendee> attendees) {
        return Flux.fromIterable(attendees)
                .flatMap(attendee -> {
                    Ticket ticket = ticketFactory.createTicketNominated(payment, attendee);
                    return ticketPdfService.generatePdfForTicket(ticket, attendee, payment)
                            .flatMap(ticketStorageService::saveTicket)
                            .map(pdfUrl -> ticketFactory.updateTicketWithQr(ticket, pdfUrl));
                })
                .collectList()
                .flatMap(tickets -> ticketRepositoryPort.saveAll(tickets).then());
    }

    private Mono<Void> generateNonNominatedTickets(Payment payment, List<Attendee> attendees) {
        return Flux.fromIterable(attendees)
                .map(attendee -> ticketFactory.createTicketNotNominated(payment, attendee))
                .collectList()
                .flatMap(tickets -> ticketRepositoryPort.saveAll(tickets).then());
    }

    @Override
    @Transactional
    public Mono<PaymentResponseDto> approvePayment(Long paymentId) {
        return paymentRepositoryPort.findById(paymentId)
                .switchIfEmpty(Mono.error(new NotFoundException("Payment with ID " + paymentId + " not found")))
                .filter(payment -> payment.getStatus() == PaymentStatus.PENDING)
                .switchIfEmpty(Mono.error(new BadRequestException("Payment is not in PENDING status")))
                .flatMap(payment -> {
                    payment.setStatus(PaymentStatus.APPROVED);
                    return paymentRepositoryPort.save(payment);
                })
                .flatMap(payment -> {
                    return paymentNotification(payment)
                            .then(attendeeRepositoryPort.findByPaymentId(payment.getId())
                                    .collectList()
                                    .flatMap(attendees -> generateTickets(payment, attendees))
                                    .thenReturn(payment));
                })
                .map(paymentMapper::toResponseDto);
    }

    private Mono<Void> generateTickets(Payment payment, List<Attendee> attendees) {
        if (attendees.isEmpty()) {
            return Mono.empty();
        }
        return generate(payment, attendees);
    }

    private Mono<Void> generate(Payment payment, List<Attendee> attendees) {
        List<Attendee> nominated = attendees.stream()
                .filter(a -> a.getName() != null && !a.getName().trim().isEmpty())
                .toList();

        List<Attendee> nonNominated = attendees.stream()
                .filter(a -> a.getName() == null || a.getName().trim().isEmpty())
                .toList();

        // Procesar ambos grupos en paralelo y luego combinarlos
        return Mono.when(
                nominated.isEmpty() ? Mono.empty() : generateNominatedTickets(payment, nominated),
                nonNominated.isEmpty() ? Mono.empty() : generateNonNominatedTickets(payment, nonNominated)
        );
    }

    @Override
    @Transactional
    public Mono<PaymentResponseDto> rejectPayment(Long paymentId, Long reasonId, String detail) {
        LocalDateTime rejectedAt = TimeLima.getLimaTime();

        return paymentRepositoryPort.findById(paymentId)
                .switchIfEmpty(Mono.error(new NotFoundException("Payment with ID " + paymentId + " not found")))
                .filter(payment -> payment.getStatus() == PaymentStatus.PENDING)
                .switchIfEmpty(Mono.error(new BadRequestException("Payment is not in PENDING status")))
                .flatMap(payment -> {
                    payment.setStatus(PaymentStatus.TEMPORAL_REJECTED); // Cambiar a TEMPORAL_REJECTED
                    payment.setRejectedAt(rejectedAt);
                    return paymentRepositoryPort.save(payment);
                })
                .flatMap(payment -> {
                    // Guardar el motivo del rechazo en tabla separada
                    PaymentRejection rejection = paymentRejectionFactory.createPaymentRejection(paymentId, reasonId, detail);
                    return paymentRejectionRepositoryPort.save(rejection)
                            .then(Mono.just(payment));
                })
                .flatMap(payment -> {
                    // Enviar evento de rechazo a Kafka para programar timeout
                    PaymentRejectedEvent event = PaymentRejectedEvent.builder()
                            .paymentId(paymentId)
                            .rejectedAt(rejectedAt)
                            .reasonId(reasonId)
                            .detail(detail)
                            .build();

                    return paymentEventProducer.sendPaymentRejectedEvent(event)
                            .then(Mono.just(payment));
                })
                .flatMap(payment -> {
                    // Enviar notificación de rechazo
                    return paymentNotification(payment).thenReturn(payment);
                })
                .map(paymentMapper::toResponseDto);
    }

    @Override
    public Mono<Boolean> canModifyRejectedPayment(Long paymentId) {
        return paymentRepositoryPort.findById(paymentId)
                .filter(payment -> payment.getStatus() == PaymentStatus.TEMPORAL_REJECTED) // Solo TEMPORAL_REJECTED se puede modificar
                .map(payment -> {
                    LocalDateTime now = TimeLima.getLimaTime();
                    LocalDateTime rejectedAt = payment.getRejectedAt();

                    if (rejectedAt == null) {
                        return false; // No se puede modificar si no tiene timestamp de rechazo
                    }

                    long minutesElapsed = java.time.Duration.between(rejectedAt, now).toMinutes();
                    return minutesElapsed <= Constants.Payment.MODIFICATION_WINDOW_MINUTES;
                })
                .defaultIfEmpty(false);
    }

    @Override
    @Transactional
    public Mono<Void> finalizeRejectedPayment(Long paymentId, Long reasonId, String detail) {
        LocalDateTime now = TimeLima.getLimaTime();

        return paymentRepositoryPort.findById(paymentId)
                .filter(payment -> payment.getStatus() == PaymentStatus.TEMPORAL_REJECTED) // Solo TEMPORAL_REJECTED se puede finalizar
                .switchIfEmpty(Mono.error(new NotFoundException("Payment with ID " + paymentId + " not found or not in TEMPORAL_REJECTED status")))
                .flatMap(payment -> {
                    // Actualizar el pago: estado y fecha de finalización
                    payment.setStatus(PaymentStatus.REJECTED); // Cambiar a REJECTED (final)
                    payment.setRejectedAt(now); // Actualizar la fecha de rechazo final

                    log.info("Finalizing temporal-rejected payment {} to REJECTED with reasonId: {}", paymentId, reasonId);

                    // Guardar el pago actualizado
                    return paymentRepositoryPort.save(payment)
                            .flatMap(savedPayment -> {
                                // Crear registro de rechazo final en payment_rejection
                                PaymentRejection finalRejection = paymentRejectionFactory.createPaymentRejection(
                                        paymentId,
                                        reasonId,
                                        detail
                                );

                                return paymentRejectionRepositoryPort.save(finalRejection)
                                        .thenReturn(savedPayment);
                            });
                })
                .flatMap(payment -> {
                    // Restituir capacidad del event zone
                    return restoreEventZoneCapacityUseCase.restoreEventZoneCapacity(paymentId)
                            .then(attendeeRepositoryPort.deleteAllByPaymentId(paymentId))
                            .thenReturn(payment);
                })
                .then();
    }

    @Override
    public Mono<PaginatedValidatePaymentsResponseDto> getPendingPayments(ValidatePaymentsFilterRequest filterRequest) {
        // Validar parámetros
        int page = filterRequest.getPage() != null ? filterRequest.getPage() : 0;
        int size = filterRequest.getSize() != null ? filterRequest.getSize() : 10;

        // Crear Pageable para Spring Data con ordenamiento por fecha de creación descendente
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        // Obtener pagos y total usando Spring Data R2DBC
        Mono<Long> totalCount = paymentRepositoryPort.countPendingPayments();
        Flux<Payment> payments = paymentRepositoryPort.findPendingPayments(pageable);

        return Mono.zip(totalCount, payments.collectList())
                .flatMap(tuple -> {
                    Long total = tuple.getT1();
                    List<Payment> paymentList = tuple.getT2();

                    // Calcular información de paginación
                    int totalPages = (int) Math.ceil((double) total / size);
                    boolean hasNext = page < totalPages - 1;
                    boolean hasPrevious = page > 0;

                    // Obtener datos relacionados para cada pago
                    return Flux.fromIterable(paymentList)
                            .flatMap(payment -> {
                                // Obtener datos del usuario según el tipo
                                Mono<Users> userMono;
                                Mono<Member> memberMono;
                                
                                if (payment.getUserType() == UserType.MEMBER) {
                                    // Para usuarios MEMBER, obtener datos del microservicio de miembros
                                    userMono = Mono.empty(); // No necesitamos Users para MEMBER
                                    memberMono = memberRepositoryPort.getMemberByIdUser(payment.getUserId())
                                            .switchIfEmpty(Mono.empty());
                                } else {
                                    // Para usuarios GUEST, obtener datos de la tabla Users local
                                    userMono = usersRepository.findById(payment.getUserId().intValue())
                                            .switchIfEmpty(Mono.empty());
                                    memberMono = Mono.empty(); // No necesitamos Member para GUEST
                                }
                                
                                Mono<Event> eventMono = eventRepository.findById(payment.getEventId().intValue())
                                        .switchIfEmpty(Mono.empty());
                                // Obtener EventZone desde Attendees del pago
                                Mono<EventZone> eventZoneMono = attendeeRepositoryPort.findByPaymentId(payment.getId())
                                        .take(1) // Tomar solo el primer attendee
                                        .map(attendee -> attendee.getEventZoneId().intValue())
                                        .flatMap(eventZonePort::findById)
                                        .next() // Convertir Flux a Mono
                                        .switchIfEmpty(Mono.empty());
                                // Obtener PaymentVoucher completo para operationNumber
                                Mono<PaymentVoucher> paymentVoucherMono = paymentVoucherRepositoryPort.findByPaymentId(payment.getId())
                                        .switchIfEmpty(Mono.empty());

                                // Obtener PaymentSubType
                                Mono<PaymentSubType> paymentSubTypeMono = paymentSubTypeRepositoryPort.findById(payment.getPaymentSubTypeId())
                                        .switchIfEmpty(Mono.empty());

                                // Obtener SeatType desde EventZone
                                Mono<SeatType> seatTypeMono = eventZoneMono
                                        .flatMap(eventZone -> {
                                            if (eventZone != null && eventZone.getSeatTypeId() != null) {
                                                return seatTypeRepository.findById(eventZone.getSeatTypeId())
                                                        .switchIfEmpty(Mono.empty());
                                            }
                                            return Mono.empty();
                                        })
                                        .switchIfEmpty(Mono.empty());

                                return Mono.zip(
                                                userMono.switchIfEmpty(Mono.just(new Users())),
                                                memberMono.map(Optional::of).switchIfEmpty(Mono.just(Optional.empty())),
                                                eventMono.switchIfEmpty(Mono.just(new Event())),
                                                eventZoneMono.switchIfEmpty(Mono.just(new EventZone())),
                                                paymentVoucherMono.map(PaymentVoucher::getImageUrl).switchIfEmpty(Mono.just("")),
                                                paymentSubTypeMono.map(Optional::of).switchIfEmpty(Mono.just(Optional.empty())),
                                                seatTypeMono.map(Optional::of).switchIfEmpty(Mono.just(Optional.empty())),
                                                paymentVoucherMono.map(Optional::of).switchIfEmpty(Mono.just(Optional.empty()))
                                        )
                                        .map(tuple2 -> validatePaymentMapper.toValidatePaymentResponseDto(
                                                payment, tuple2.getT1(), tuple2.getT2().orElse(null), tuple2.getT3(), tuple2.getT4(), tuple2.getT5(), tuple2.getT6().orElse(null), tuple2.getT7().orElse(null), tuple2.getT8().orElse(null)));
                            })
                            .collectList()
                            .map(paymentDtos -> {
                                PaginatedValidatePaymentsResponseDto response = new PaginatedValidatePaymentsResponseDto();
                                response.setPayments(paymentDtos);
                                response.setCurrentPage(page);
                                response.setPageSize(size);
                                response.setTotalElements(total);
                                response.setTotalPages(totalPages);
                                response.setHasNext(hasNext);
                                response.setHasPrevious(hasPrevious);
                                return response;
                            });
                });
    }

    @Override
    @Transactional
    public Mono<PaymentResponseDto> correctRejectedPayment(Long paymentId, FilePart voucherFile) {
        log.info("Correcting rejected payment with ID: {}", paymentId);
        
        return paymentRepositoryPort.findById(paymentId)
                .switchIfEmpty(Mono.error(new NotFoundException("Payment with ID " + paymentId + " not found")))
                .filter(payment -> payment.getStatus() == PaymentStatus.TEMPORAL_REJECTED)
                .switchIfEmpty(Mono.error(new BadRequestException("Payment is not in TEMPORAL_REJECTED status")))
                .flatMap(payment -> {
                    // Verificar si aún está dentro de la ventana de tiempo para modificar
                    LocalDateTime now = TimeLima.getLimaTime();
                    LocalDateTime rejectedAt = payment.getRejectedAt();
                    
                    if (rejectedAt == null) {
                        return Mono.error(new BadRequestException("Payment does not have rejection timestamp"));
                    }
                    
                    long minutesElapsed = java.time.Duration.between(rejectedAt, now).toMinutes();
                    if (minutesElapsed > Constants.Payment.MODIFICATION_WINDOW_MINUTES) {
                        return Mono.error(new BadRequestException("Payment correction window has expired"));
                    }
                    
                    // Subir el nuevo comprobante
                    return voucherStorageService.saveVoucher(voucherFile)
                            .flatMap(voucherUrl -> {
                                // Actualizar el pago
                                payment.setStatus(PaymentStatus.PENDING);
                                payment.setRejectedAt(null); // Limpiar la fecha de rechazo
                                
                                return paymentRepositoryPort.save(payment)
                                        .flatMap(savedPayment -> {
                                            // Actualizar o crear el voucher
                                            return paymentVoucherRepositoryPort.findByPaymentId(paymentId)
                                                    .switchIfEmpty(Mono.empty())
                                                    .flatMap(existingVoucher -> {
                                                        existingVoucher.setImageUrl(voucherUrl);
                                                        return paymentVoucherRepositoryPort.save(existingVoucher);
                                                    })
                                                    .switchIfEmpty(Mono.defer(() -> {
                                                        // Crear nuevo voucher si no existe
                                                        PaymentVoucher newVoucher = paymentVoucherFactory.createPaymentVoucher(paymentId, voucherUrl);
                                                        return paymentVoucherRepositoryPort.save(newVoucher);
                                                    }))
                                                    .thenReturn(savedPayment);
                                        });
                            });
                })
                .flatMap(payment -> {
                    // Enviar notificación de corrección
                    return paymentNotification(payment).thenReturn(payment);
                })
                .map(paymentMapper::toResponseDto)
                .doOnSuccess(result -> log.info("Payment {} corrected successfully", paymentId))
                .doOnError(error -> log.error("Error correcting payment {}: {}", paymentId, error.getMessage()));
    }

}
