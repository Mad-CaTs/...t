package world.inclub.bonusesrewards.carbonus.application.service.carpaymentschedule;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.application.usecase.carpaymentschedule.GetCarAssignmentExtraInfoUseCase;
import world.inclub.bonusesrewards.carbonus.domain.port.*;
import world.inclub.bonusesrewards.carbonus.application.dto.CarAssignmentExtraInfoSummary;
import world.inclub.bonusesrewards.shared.bonus.domain.port.ClassificationRepositoryPort;
import world.inclub.bonusesrewards.shared.exceptions.EntityNotFoundException;
import world.inclub.bonusesrewards.shared.member.domain.port.MemberRepositoryPort;
import world.inclub.bonusesrewards.shared.rank.domain.port.RankRepositoryPort;
import world.inclub.bonusesrewards.shared.event.domain.port.EventRepositoryPort;
import world.inclub.bonusesrewards.carbonus.domain.model.Car;
import world.inclub.bonusesrewards.carbonus.domain.model.CarBrand;
import world.inclub.bonusesrewards.carbonus.domain.model.CarModel;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.carbonus.domain.model.CarQuotation;
import world.inclub.bonusesrewards.carbonus.domain.model.CarRankBonus;
import world.inclub.bonusesrewards.shared.bonus.domain.model.Classification;
import world.inclub.bonusesrewards.shared.member.domain.model.Member;
import world.inclub.bonusesrewards.shared.event.domain.model.Event;
import world.inclub.bonusesrewards.shared.rank.domain.model.Rank;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarAssignmentExtraInfoService
        implements GetCarAssignmentExtraInfoUseCase {
    private final CarAssignmentRepositoryPort carAssignmentRepositoryPort;
    private final CarPaymentScheduleRepositoryPort carPaymentScheduleRepositoryPort;
    private final CarQuotationRepositoryPort carQuotationRepositoryPort;
    private final ClassificationRepositoryPort classificationRepositoryPort;
    private final MemberRepositoryPort memberRepositoryPort;
    private final CarRepositoryPort carRepositoryPort;
    private final CarBrandRepositoryPort carBrandRepositoryPort;
    private final CarModelRepositoryPort carModelRepositoryPort;
    private final CarRankBonusRepositoryPort carRankBonusRepositoryPort;
    private final RankRepositoryPort rankRepositoryPort;
    private final EventRepositoryPort eventRepositoryPort;

    @Override
    public Mono<CarAssignmentExtraInfoSummary> getExtraInfo(UUID carAssignmentId) {
        return carAssignmentRepositoryPort.findById(carAssignmentId)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("Assignment not found with id: " + carAssignmentId)))
                .flatMap(carAssignment -> {

                    if (carAssignment.quotationId() == null) {
                        return Mono.error(new EntityNotFoundException("That assignment has no quotation assigned"));
                    }
                    if (carAssignment.rankBonusId() == null) {
                        return Mono.error(new EntityNotFoundException("That assignment has no bonus assigned"));
                    }

                    Mono<CarQuotation> carQuotationMono =
                            carQuotationRepositoryPort.findById(carAssignment.quotationId())
                                    .switchIfEmpty(Mono.error(new EntityNotFoundException("Quotation not found")));
                    Mono<Classification> classificationMono = classificationRepositoryPort.findByCarAssignmentId(
                                    carAssignmentId)
                            .switchIfEmpty(Mono.error(new EntityNotFoundException("Classification not found")));
                    Mono<List<CarPaymentSchedule>> paymentSchedulesMono =
                            carPaymentScheduleRepositoryPort.findByCarAssignmentId(carAssignmentId)
                                    .collectList()
                                    .switchIfEmpty(Mono.error(new EntityNotFoundException("Payment schedules not found")));
                    Mono<Car> carMono = carRepositoryPort.findById(carAssignment.carId())
                            .switchIfEmpty(Mono.error(new EntityNotFoundException("Car not found")));

                    return Mono.zip(carQuotationMono, classificationMono, paymentSchedulesMono, carMono)
                            .flatMap(tuple -> {
                                CarQuotation carQuotation = tuple.getT1();
                                Classification classification = tuple.getT2();
                                List<CarPaymentSchedule> paymentSchedules = tuple.getT3();
                                Car car = tuple.getT4();

                                Mono<Member> memberMono = memberRepositoryPort.getById(carAssignment.memberId())
                                        .defaultIfEmpty(Member.empty());
                                Mono<Rank> rankMono = rankRepositoryPort.findById(classification.rankId())
                                        .defaultIfEmpty(Rank.empty());
                                Mono<Event> eventMono = eventRepositoryPort.findByIdIn(List.of(carQuotation.eventId()))
                                        .collectList()
                                        .map(events -> events.stream().findFirst().orElse(Event.empty()));

                                Mono<CarBrand> carBrandMono = carBrandRepositoryPort.findById(car.brandId())
                                        .defaultIfEmpty(CarBrand.empty());
                                Mono<CarModel> carModelMono = carModelRepositoryPort.findById(car.modelId())
                                        .defaultIfEmpty(CarModel.empty());
                                Mono<CarRankBonus> carRankBonusMono =
                                        carRankBonusRepositoryPort.findById(carAssignment.rankBonusId())
                                                .defaultIfEmpty(CarRankBonus.empty());

                                return Mono.zip(memberMono,
                                                rankMono,
                                                eventMono,
                                                carBrandMono,
                                                carModelMono,
                                                carRankBonusMono)
                                        .map(tuple2 -> {
                                            Member member = tuple2.getT1();
                                            Rank rank = tuple2.getT2();
                                            Event event = tuple2.getT3();
                                            CarBrand carBrand = tuple2.getT4();
                                            CarModel carModel = tuple2.getT5();
                                            CarRankBonus carRankBonus = tuple2.getT6();

                                            BigDecimal coveredInitialUsd = carRankBonus.initialBonus();
                                            BigDecimal carPriceUsd = carAssignment.price();
                                            BigDecimal monthlyBonusUsd = carRankBonus.monthlyBonus();
                                            Integer totalInitialInstallments = carAssignment.initialInstallmentsCount();
                                            Integer totalMonthlyInstallments = carAssignment.monthlyInstallmentsCount();
                                            BigDecimal interestRate = carAssignment.interestRate();

                                            Long paidInitialInstallments = getCountedInitialOrMonthlyInstallments
                                                    (paymentSchedules, true);

                                            Long paidMonthlyInstallments = getCountedInitialOrMonthlyInstallments
                                                    (paymentSchedules, false);

                                            BigDecimal totalPaidInitialUsd = getTotalPaidInstallmentsUsd
                                                    (paymentSchedules, true);

                                            BigDecimal totalPaidMonthlyUsd = getTotalPaidInstallmentsUsd
                                                    (paymentSchedules, false);

                                            Long remainingInitialInstallments =
                                                    totalInitialInstallments - paidInitialInstallments;

                                            Long remainingMonthlyInstallments =
                                                    totalMonthlyInstallments - paidMonthlyInstallments;

                                            BigDecimal remainingInitialInstallmentsUsd = getRemainingInstallmentsUsd
                                                    (paymentSchedules, true);

                                            BigDecimal remainingMonthlyInstallmentsUsd = getRemainingInstallmentsUsd
                                                    (paymentSchedules, false);

                                            BigDecimal totalInitialInstallmentsUsd = getTotalInstallmentsUsd
                                                    (paymentSchedules, true);

                                            BigDecimal totalMonthlyInstallmentsUsd = getTotalInstallmentsUsd
                                                    (paymentSchedules, false);

                                            LocalDate initialPaymentDate = getInitialOrEndPaymentDate
                                                    (paymentSchedules, true, true);
                                            LocalDate lastPaymentDate = getInitialOrEndPaymentDate
                                                    (paymentSchedules, false, false);

                                            return CarAssignmentExtraInfoSummary.builder()
                                                    .memberId(member.id())
                                                    .username(member.username())
                                                    .memberFullName(member.name() + " " + member.lastName())
                                                    .memberRankId(rank.id())
                                                    .memberRankName(rank.name())
                                                    .eventId(event.id() != null ? event.id() : null)
                                                    .eventName(event.name() != null ? event.name() : null)
                                                    .carBrand(carBrand.name())
                                                    .carModel(carModel.name())
                                                    .coveredInitialUsd(coveredInitialUsd)
                                                    .carPriceUsd(carPriceUsd)
                                                    .monthlyBonusUsd(monthlyBonusUsd)
                                                    .totalInitialInstallments(totalInitialInstallments)
                                                    .paidInitialInstallments(paidInitialInstallments)
                                                    .totalPaidInitialUsd(totalPaidInitialUsd)
                                                    .totalMonthlyInstallments(totalMonthlyInstallments)
                                                    .paidMonthlyInstallments(paidMonthlyInstallments)
                                                    .totalPaidMonthlyUsd(totalPaidMonthlyUsd)
                                                    .remainingInitialInstallments(remainingInitialInstallments)
                                                    .remainingInitialInstallmentsUsd(remainingInitialInstallmentsUsd)
                                                    .remainingMonthlyInstallments(remainingMonthlyInstallments)
                                                    .remainingMonthlyInstallmentsUsd(remainingMonthlyInstallmentsUsd)
                                                    .totalInitialInstallmentsUsd(totalInitialInstallmentsUsd)
                                                    .totalMonthlyInstallmentsUsd(totalMonthlyInstallmentsUsd)
                                                    .initialPaymentDate(initialPaymentDate)
                                                    .lastPaymentDate(lastPaymentDate)
                                                    .interestRate(interestRate)
                                                    .build();
                                        });
                            });
                });
    }

    private LocalDate getInitialOrEndPaymentDate(
            List<CarPaymentSchedule> paymentSchedules,
            boolean isInitial,
            boolean getMin
    ) {
        return paymentSchedules.stream()
                .filter(ps -> Objects.equals(ps.isInitial(), isInitial))
                .map(CarPaymentSchedule::dueDate)
                .reduce((date1, date2) -> getMin ? (date1.isBefore(date2) ? date1 : date2)
                        : (date1.isAfter(date2) ? date1 : date2))
                .orElse(null);
    }

    private Long getCountedInitialOrMonthlyInstallments(
            List<CarPaymentSchedule> paymentSchedules,
            boolean isInitial
    ) {
        return paymentSchedules.stream()
                .filter(ps -> Objects.equals(ps.isInitial(), isInitial) && ps.statusId() == 1)
                .count();
    }

    private BigDecimal getRemainingInstallmentsUsd(
            List<CarPaymentSchedule> paymentSchedules,
            boolean isInitial
    ) {
        return paymentSchedules.stream()
                .filter(ps -> Objects.equals(ps.isInitial(), isInitial) && ps.statusId() != 1)
                .map(ps -> isInitial ? ps.financingInstallment() : ps.total())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getTotalInstallmentsUsd(
            List<CarPaymentSchedule> paymentSchedules,
            boolean isInitial
    ) {
        return paymentSchedules.stream()
                .filter(ps -> Objects.equals(ps.isInitial(), isInitial))
                .map(ps -> isInitial ? ps.financingInstallment() : ps.total())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getTotalPaidInstallmentsUsd(
            List<CarPaymentSchedule> paymentSchedules,
            boolean isInitial
    ) {
        return paymentSchedules.stream()
                .filter(ps -> Boolean.valueOf(isInitial).equals(ps.isInitial()) && ps.statusId() == 1)
                .map(ps -> isInitial ? ps.financingInstallment() : ps.total())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

}
