package world.inclub.bonusesrewards.shared.payment.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.bonus.domain.model.BonusType;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentListView;
import world.inclub.bonusesrewards.shared.payment.application.usecase.GetPagedPendingPaymentsUseCase;
import world.inclub.bonusesrewards.shared.payment.application.usecase.ListAllPendingPaymentsUseCase;
import world.inclub.bonusesrewards.shared.payment.domain.port.PaymentListViewRepositoryPort;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PageDataBuilder;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentListService implements GetPagedPendingPaymentsUseCase, ListAllPendingPaymentsUseCase {

    private final PaymentListViewRepositoryPort paymentListViewRepositoryPort;

    @Override
    public Mono<PagedData<PaymentListView>> getPendingPayments(
            String member,
            BonusType bonusType,
            Instant paymentDate,
            Pageable pageable
    ) {
        Flux<PaymentListView> paymentsFlux = paymentListViewRepositoryPort
                .findPendingPaymentsWithFilters(member, bonusType, paymentDate, pageable)
                .switchIfEmpty(Flux.error(
                        new EntityNotFoundException("No pending payments found")));

        Mono<Long> countMono = paymentListViewRepositoryPort
                .countPendingPaymentsWithFilters(member, bonusType, paymentDate)
                .defaultIfEmpty(0L);

        return Mono.zip(paymentsFlux.collectList(), countMono)
                .map(tuple -> {
                    List<PaymentListView> payments = tuple.getT1();
                    Long totalElements = tuple.getT2();

                    return PageDataBuilder.build(payments, pageable, totalElements);
                });
    }

    @Override
    public Flux<PaymentListView> getAllPendingPayments(
            String member,
            BonusType bonusType,
            Instant paymentDate
    ) {
        return paymentListViewRepositoryPort
                .findAllPendingPayments(member, bonusType, paymentDate)
                .switchIfEmpty(Flux.error(
                        new EntityNotFoundException("No pending payments found")));
    }
}
