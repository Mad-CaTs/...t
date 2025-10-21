package world.inclub.bonusesrewards.carbonus.domain.port;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.carbonus.domain.model.CarPaymentSchedule;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public interface CarPaymentScheduleRepositoryPort {

    Flux<CarPaymentSchedule> saveAll(Iterable<CarPaymentSchedule> schedules);

    Mono<CarPaymentSchedule> save(CarPaymentSchedule schedule);

    /**
     * Finds car payment schedules that are overdue for initial payments as of the specified date.
     *
     * @param statusId the status identifier to filter the payment schedules
     * @param today    the current date to check for overdue payments
     * @return a Flux emitting CarPaymentSchedule objects that are overdue for initial payments
     */
    Flux<CarPaymentSchedule> findOverdueInitials(Long statusId, LocalDate today);

    /**
     * Finds car payment schedules that are due or overdue for monthly payments as of the specified date.
     *
     * @param statusId the status identifier to filter the payment schedules
     * @param today    the current date to check for due or overdue payments
     * @return a Flux emitting CarPaymentSchedule objects that are due or overdue for monthly payments
     */
    Flux<CarPaymentSchedule> findDueOrOverdueMonthlies(Long statusId, LocalDate today);

    /**
     * Finds the last car payment schedule by car assignment ID, ordered by order number in descending order.
     *
     * @param carAssignmentId the unique identifier of the car assignment
     * @return a Mono emitting the last CarPaymentSchedule if found, or empty if not found
     */
    Mono<CarPaymentSchedule> findLastByCarAssignmentId(UUID carAssignmentId);

    Flux<CarPaymentSchedule> findByCarAssignmentId(UUID carAssignmentId);

    Flux<CarPaymentSchedule> findAllByCarAssignmentIdWithPagination(UUID carAssignmentId, Pageable pageable);

    Mono<Long> countByCarAssignmentId(UUID carAssignmentId);

    Flux<CarPaymentSchedule> findInitialsByCarAssignmentId(UUID carAssignmentId, Pageable pageable);

    Mono<Long> countInitialsByCarAssignmentId(UUID carAssignmentId);


    Mono<CarPaymentSchedule> findById(UUID uuid);

    Mono<Void> updateSchedulePayment(UUID scheduleId, Integer statusId, LocalDateTime paymentDate);

    Mono<Boolean> existsById(UUID scheduleId);

    Mono<Boolean> isSchedulePending(UUID uuid);

    Mono<Long> getMemberIdByScheduleId(UUID scheduleId);
}
