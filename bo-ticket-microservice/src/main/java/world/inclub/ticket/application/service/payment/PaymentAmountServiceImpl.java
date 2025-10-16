package world.inclub.ticket.application.service.payment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;
import world.inclub.ticket.application.dto.MakePaymentCommand;
import world.inclub.ticket.application.dto.PaymentAmounts;
import world.inclub.ticket.application.factory.PaymentAmountsFactory;
import world.inclub.ticket.application.port.payment.PaymentAmountService;
import world.inclub.ticket.domain.enums.CurrencyType;
import world.inclub.ticket.domain.model.EventZone;
import world.inclub.ticket.domain.ports.payment.PaymentSubTypeRepositoryPort;
import world.inclub.ticket.domain.ports.ticket_package.TicketPackageRepositoryPort;
import world.inclub.ticket.domain.repository.EventZoneRepository;
import world.inclub.ticket.infraestructure.exceptions.AmountException;
import world.inclub.ticket.infraestructure.exceptions.BadRequestException;
import world.inclub.ticket.infraestructure.exceptions.NotFoundException;
import world.inclub.ticket.infraestructure.persistence.repository.r2dbc.ticket_package.EventPackageItemRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentAmountServiceImpl implements PaymentAmountService {

    private final EventZoneRepository eventZonePort;
    private final PaymentSubTypeRepositoryPort paymentSubTypeRepositoryPort;
    private final PaymentAmountsFactory paymentAmountsFactory;
    private final TicketPackageRepositoryPort ticketPackageRepositoryPort;
    private final EventPackageItemRepository eventPackageItemRepository;

    @Override
    public Mono<PaymentAmounts> validateAndCalculate(MakePaymentCommand command) {
        List<Mono<Tuple2<PaymentAmounts.PaymentItem, BigDecimal>>> allItems = new ArrayList<>();

        if (command.zones() != null && !command.zones().isEmpty()) {
            for (var zoneSel : command.zones()) {
                allItems.add(
                        eventZonePort.findById((int) zoneSel.eventZoneId().longValue())
                                .map(zone -> {
                                    BigDecimal price = getUnitPrice(zone, command.currencyType());
                                    PaymentAmounts.PaymentItem item =
                                            paymentAmountsFactory.createPaymentItem(
                                                    null,
                                                    zoneSel.eventZoneId().longValue(),
                                                    zoneSel.quantity(),
                                                    price,
                                                    null
                                            );
                                    return Tuples.of(item, item.totalPrice());
                                })
                );
            }
        }

        if (command.packages() != null && !command.packages().isEmpty()) {
            for (var pkgSel : command.packages()) {
                allItems.add(
                        ticketPackageRepositoryPort.findById(pkgSel.packageId())
                                .flatMap(ticketPackage ->
                                        eventPackageItemRepository.findByTicketPackageId(pkgSel.packageId())
                                                .collectList()
                                                .map(items -> {
                                                    int ticketsPorPaquete = items.stream()
                                                            .mapToInt(i -> i.getQuantity() + i.getQuantityFree())
                                                            .sum();
                                                    int totalTickets = ticketsPorPaquete * pkgSel.quantity();

                                                    BigDecimal unitPrice = command.currencyType().equals(CurrencyType.USD)
                                                            ? ticketPackage.getPriceUsd()
                                                            : ticketPackage.getPricePen();

                                                    BigDecimal subTotal = unitPrice.multiply(BigDecimal.valueOf(pkgSel.quantity()));

                                                    PaymentAmounts.PaymentItem item =
                                                            paymentAmountsFactory.createPaymentItem(ticketPackage.getId(), null, totalTickets, unitPrice, pkgSel.quantity());

                                                    return Tuples.of(item, subTotal);
                                                })
                                )
                );
            }
        }

        return Flux.merge(allItems)
                .collectList()
                .flatMap(list -> {
                    List<PaymentAmounts.PaymentItem> items = list.stream().map(Tuple2::getT1).toList();
                    BigDecimal totalSubTotal = list.stream().map(Tuple2::getT2).reduce(BigDecimal.ZERO, BigDecimal::add);

                    return calculateAmounts(command, totalSubTotal)
                            .flatMap(amounts -> {
                                if (amounts.total().compareTo(command.totalAmount()) != 0) {
                                    return Mono.error(new AmountException(
                                            "Total amount does not match calculated total, expected: "
                                                    + amounts.total() + ", provided: " + command.totalAmount()));
                                }
                                return Mono.just(new PaymentAmounts(
                                        amounts.subTotal(),
                                        amounts.commission(),
                                        amounts.total(),
                                        items
                                ));
                            });
                });
    }

    private BigDecimal getUnitPrice(EventZone eventZone, CurrencyType currencyType) {
        return switch (currencyType) {
            case USD -> eventZone.getPrice();
            case PEN -> eventZone.getPriceSoles();
            default -> throw new BadRequestException("Unsupported currency type: " + currencyType);
        };
    }

    private Mono<PaymentAmounts> calculateAmounts(MakePaymentCommand command, BigDecimal subTotal) {
        return paymentSubTypeRepositoryPort.findById(command.paymentSubTypeId())
                .switchIfEmpty(Mono.error(new NotFoundException("Payment subtype not found")))
                .map(paymentSubType -> {
                    BigDecimal commission = BigDecimal.ZERO;
                    if (command.currencyType() == CurrencyType.USD) {
                        commission = commission.add(paymentSubType.commissionDollars());
                    } else {
                        commission = commission.add(paymentSubType.commissionSoles());
                    }

                    if (paymentSubType.ratePercentage() != null &&
                            paymentSubType.ratePercentage().compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal tasaDecimal = paymentSubType.ratePercentage()
                                .divide(BigDecimal.valueOf(100), 8, RoundingMode.HALF_UP);
                        commission = commission.add(subTotal.multiply(tasaDecimal));
                    }

                    commission = commission.setScale(2, RoundingMode.HALF_UP);

                    BigDecimal total = subTotal.add(commission);
                    return new PaymentAmounts(subTotal, commission, total, null);
                });
    }
}
