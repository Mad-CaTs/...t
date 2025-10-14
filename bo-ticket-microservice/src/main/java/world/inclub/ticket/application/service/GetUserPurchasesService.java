package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.mapper.UserPurchaseMapper;
import world.inclub.ticket.domain.model.Event;
import world.inclub.ticket.domain.model.payment.PaymentType;
import world.inclub.ticket.domain.ports.payment.*;
import world.inclub.ticket.infraestructure.controller.dto.PageResponse;
import world.inclub.ticket.infraestructure.controller.dto.UserPurchaseResponse;
import world.inclub.ticket.application.service.interfaces.GetUserPurchasesUseCase;
import world.inclub.ticket.domain.model.payment.Payment;
import world.inclub.ticket.domain.repository.EventRepository;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;
import world.inclub.ticket.utils.PageResponseBuilder;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GetUserPurchasesService implements GetUserPurchasesUseCase {

    private final PaymentRepositoryPort paymentRepositoryPort;
    private final PaymentTypeRepositoryPort paymentTypeRepositoryPort;
    private final EventRepository eventRepository;
    private final UserPurchaseMapper userPurchaseMapper;

    @Override
    public Mono<PageResponse<UserPurchaseResponse>> getUserPurchasesPaginated(Long userId, Pageable pageable) {
        Flux<Payment> payments = paymentRepositoryPort.getByUserId(userId, pageable)
                .switchIfEmpty(Mono.error(new NotFoundException("No payments found for user")));
        Mono<Long> totalCount = paymentRepositoryPort.countByUserId(userId);

        return Mono.zip(
                totalCount,
                payments.collectList(),
                paymentTypeRepositoryPort.findAllPaymentTypes().collectList()
        ).flatMap(tuple -> {
            Long total = tuple.getT1();
            List<Payment> paymentList = tuple.getT2();
            List<PaymentType> paymentTypes = tuple.getT3();

            List<Integer> eventIds = paymentList.stream()
                    .map(payment -> payment.getEventId().intValue())
                    .distinct()
                    .collect(Collectors.toList());

            return eventRepository.findByIdIn(eventIds)
                    .collectList()
                    .map(events -> {
                        List<UserPurchaseResponse> responses = paymentList.stream()
                                .map(payment -> {
                                    Event event = events.stream()
                                            .filter(e -> e.getEventId().equals(payment.getEventId().intValue()))
                                            .findFirst()
                                            .orElse(null);
                                    return userPurchaseMapper.toResponse(payment, paymentTypes, event);
                                })
                                .collect(Collectors.toList());

                        return PageResponseBuilder.build(responses, pageable, total);
                    });
        });
    }
}
