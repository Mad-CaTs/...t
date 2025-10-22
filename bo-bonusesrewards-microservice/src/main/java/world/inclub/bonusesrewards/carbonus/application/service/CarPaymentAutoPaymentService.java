package world.inclub.bonusesrewards.carbonus.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.ProcessInitialCarPaymentSchedulesUseCase;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.ProcessMonthlyCarPaymentSchedulesUseCase;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarBonusApplicationFactory;
import world.inclub.bonusesrewards.carbonus.domain.factory.CarPaymentScheduleFactory;
import world.inclub.bonusesrewards.carbonus.domain.model.CarAssignment;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBonusApplication;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.carbonus.domain.port.CarAssignmentRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarBonusApplicationRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.port.CarPaymentScheduleRepositoryPort;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;
import world.inclub.bonusesrewards.shared.bonus.domain.port.ClassificationRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.infrastructure.context.TimezoneContext;
import world.inclub.bonusesrewards.shared.logging.LoggerService;
import world.inclub.bonusesrewards.shared.payment.domain.model.PaymentStatus;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;
import world.inclub.bonusesrewards.shared.utils.exchange.domain.ExchangeRate;
import world.inclub.bonusesrewards.shared.utils.exchange.domain.ExchangeRateRepositoryPort;
import world.inclub.bonusesrewards.shared.wallet.domain.factory.WalletFactory;
import world.inclub.bonusesrewards.shared.wallet.domain.factory.WalletTransactionFactory;
import world.inclub.bonusesrewards.shared.wallet.domain.model.Wallet;
import world.inclub.bonusesrewards.shared.wallet.domain.model.WalletTransaction;
import world.inclub.bonusesrewards.shared.wallet.domain.port.WalletRepositoryPort;
import world.inclub.bonusesrewards.shared.wallet.domain.port.WalletTransactionRepositoryPort;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.function.Supplier;

@Slf4j
@Service
@RequiredArgsConstructor
public class CarPaymentAutoPaymentService
        implements ProcessInitialCarPaymentSchedulesUseCase,
                   ProcessMonthlyCarPaymentSchedulesUseCase {

    private final CarPaymentScheduleRepositoryPort carPaymentScheduleRepositoryPort;
    private final CarAssignmentRepositoryPort carAssignmentRepositoryPort;
    private final RankRepositoryPort rankRepositoryPort;
    private final CarBonusApplicationRepositoryPort carBonusApplicationRepositoryPort;
    private final WalletTransactionRepositoryPort walletTransactionRepositoryPort;
    private final ClassificationRepositoryPort classificationRepositoryPort;
    private final ExchangeRateRepositoryPort exchangeRateRepositoryPort;
    private final WalletRepositoryPort walletRepositoryPort;
    private final CarPaymentScheduleFactory carPaymentScheduleFactory;
    private final WalletFactory walletFactory;
    private final WalletTransactionFactory walletTransactionFactory;
    private final CarBonusApplicationFactory carBonusApplicationFactory;
    private final LoggerService loggerService;
    private static final int CONCURRENCY = 100;

    @Override
    public Mono<Void> processInitials() {
        return processPayments(() -> carPaymentScheduleRepositoryPort
                .findOverdueInitials
                        (PaymentStatus.PENDING.getId(),
                         getTodayInUserTimezone()), "initial");
    }

    @Override
    public Mono<Void> processMonthlies() {
        return processPayments(() -> carPaymentScheduleRepositoryPort
                .findDueOrOverdueMonthlies
                        (PaymentStatus.PENDING.getId(),
                         getTodayInUserTimezone()), "monthly");
    }

    private Mono<Void> processPayments(Supplier<Flux<CarPaymentSchedule>> supplier, String type) {
        Mono<ExchangeRate> exchangeRateMono = exchangeRateRepositoryPort.findLatestExchangeRate()
                .switchIfEmpty(Mono.error(new EntityNotFoundException("No exchange rate found")));
        Mono<List<Rank>> ranksMono = rankRepositoryPort.findAll()
                .collectList()
                .switchIfEmpty(Mono.error(new EntityNotFoundException("No ranks found")));

        return Mono.zip(exchangeRateMono, ranksMono)
                .flatMapMany(tuple -> {
                    ExchangeRate exchangeRate = tuple.getT1();
                    List<Rank> ranks = tuple.getT2();
                    return supplier.get()
                            .switchIfEmpty(Mono.defer(() -> {
                                loggerService.info("No pending or overdue " + type + " car payment schedules found.");
                                return Mono.empty();
                            }))
                            .flatMap(schedule -> makePayment(schedule, exchangeRate, ranks)
                                             .then(updateScheduleToPaid(schedule))
                                             .doOnSuccess(v -> loggerService
                                                     .info("Successfully processed {} payment for schedule ID: {}",
                                                           type, schedule.id()))
                                             .onErrorResume(e -> {
                                                 loggerService.error("Error processing {} payment for schedule ID: " +
                                                                             "{}: {}",
                                                                     type, schedule.id(), e.getMessage());
                                                 return Mono.empty();
                                             }),
                                     CONCURRENCY
                            );
                })
                .then();
    }

    private Mono<Void> makePayment(CarPaymentSchedule schedule, ExchangeRate exchangeRate, List<Rank> ranks) {
        Mono<CarAssignment> carAssignmentMono = carAssignmentRepositoryPort.findById(schedule.carAssignmentId())
                .switchIfEmpty(Mono.error
                        (new EntityNotFoundException("Assignment not found for ID: " + schedule.carAssignmentId())));

        Mono<Classification> classificationMono =
                classificationRepositoryPort.findByCarAssignmentId(schedule.carAssignmentId())
                        .switchIfEmpty(Mono.error
                                (new EntityNotFoundException("Classification not found for assignment ID: " + schedule.carAssignmentId())));

        return Mono.zip(carAssignmentMono, classificationMono)
                .flatMap(tuple2 -> {
                    CarAssignment carAssignment = tuple2.getT1();
                    Classification classification = tuple2.getT2();
                    return walletRepositoryPort
                            .findByMemberId(carAssignment.memberId())
                            .flatMap(wallet -> {
                                Wallet updatedWallet = walletFactory.updateWalletBalance(wallet,
                                                                                         schedule.memberAssumedPayment());
                                String descriptionRecharge = getReferenceRechargeForSchedule(classification, ranks);
                                WalletTransaction rechargeWallet = walletTransactionFactory
                                        .createRechargeWallet(schedule, wallet, exchangeRate.id(), descriptionRecharge);

                                String descriptionDiscount = getReferenceDiscountForSchedule(schedule);
                                WalletTransaction discountWallet = walletTransactionFactory
                                        .createDiscountWallet(schedule, wallet, exchangeRate.id(),
                                                              descriptionDiscount);

                                String description = String.format("%s : %s", descriptionRecharge, descriptionDiscount);
                                CarBonusApplication carBonusApplication = carBonusApplicationFactory
                                        .create(schedule, description);
                                return walletRepositoryPort
                                        .save(updatedWallet)
                                        .then(walletTransactionRepositoryPort
                                                      .saveAll(List.of(rechargeWallet, discountWallet))
                                                      .then(carBonusApplicationRepositoryPort
                                                                    .save(carBonusApplication))
                                        )
                                        .then();
                            });
                });
    }

    private Mono<CarPaymentSchedule> updateScheduleToPaid(CarPaymentSchedule schedule) {
        CarPaymentSchedule updatedSchedule = carPaymentScheduleFactory.markAsPaid(schedule);
        return carPaymentScheduleRepositoryPort.save(updatedSchedule);
    }

    private LocalDate getTodayInUserTimezone() {
        ZoneId userZone = TimezoneContext.getTimezone();
        return LocalDate.now(userZone);
    }

    private String getReferenceRechargeForSchedule(Classification classification, List<Rank> ranks) {
        Rank rank = ranks.stream()
                .filter(r -> r.id().equals(classification.rankId()))
                .findFirst()
                .orElse(Rank.empty());

        return String.format("Bono Auto %s", rank.name());
    }


    private String getReferenceDiscountForSchedule(CarPaymentSchedule schedule) {
        return (schedule.isInitial()) ?
                String.format("Inicial Fraccionada N° %d", schedule.installmentNum()) :
                String.format("Cuota N° %d", schedule.installmentNum());
    }

}
