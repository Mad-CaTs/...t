package world.inclub.membershippayment.aplication.dao.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.PaymentDao;
import world.inclub.membershippayment.aplication.service.mapper.MembershipToAdminPanelMapper;
import world.inclub.membershippayment.crosscutting.utils.TimeLima;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.enums.State;
import world.inclub.membershippayment.domain.enums.TypePercentOverdue;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.AdminPanelService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PercentOverdueDetail;
import world.inclub.membershippayment.infraestructure.repository.PaymentRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Repository("paymentDao")
@RequiredArgsConstructor
@Slf4j
public class IPaymentDao implements PaymentDao {
    private final PaymentRepository paymentRepository;
    private final DatabaseClient databaseClient;
    private final AdminPanelService adminPanelService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    // return paymentsMono
    // .flatMapIterable(payments -> payments)
    // .flatMap(paymentRepository::save, 10) // Procesa 4 pagos en paralelo
    // .collectList();
    public Mono<Payment> postPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public Flux<Payment> getAllPaymentsByIdSubscription(int idSuscription){
        return paymentRepository.getAllPaymentsByIdSubscription(idSuscription);
    }

    @Override
    public Mono<List<Payment>> postPayments(List<Payment> payments) {
        return saveAllPayments(payments) // Primero guardamos todos los pagos
                .flatMap(success -> {
                    if (success) {
                        // Si el guardado fue exitoso, recuperamos los pagos por idSuscription
                        return getAllPaymentsByIdSubscription(payments.get(0).getIdSuscription())
                                .collectList()
                                .map(paymentList -> {
                                    // Ordena la lista por positionOnSchedule de manera ascendente
                                    paymentList.sort(Comparator.comparing(Payment::getPositionOnSchedule));
                                    return paymentList;
                                });
                    } else {
                        // Si el guardado falló, retornamos un Mono con un error
                        return Mono.error(new RuntimeException("Failed to save payments"));
                    }
                });
    }

    @Override
    public Mono<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    @Override
    public Flux<Payment> getAllPaymentsByIdSubscription(Integer idSubscription) {
        return paymentRepository.getAllPaymentsByIdSubscription(idSubscription);
    }

    @Override
    public Mono<Payment> putPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Mono<Boolean> saveAllPayments(List<Payment> payments) {
        if (payments.isEmpty()) {
            return Mono.just(true);
        }

        StringBuilder sql = new StringBuilder("INSERT INTO bo_membership.payment (" +
                "idsuscription, quotedescription, nextexpirationdate, dollarexchange, " +
                "quoteusd, percentage, idstatepayment, obs, paydate, pts, isinitialquote, " +
                "positiononschedule, numberquotepay, amortizationusd, capitalbalanceusd, " +
                "totaloverdue, idpercentoverduedetail) VALUES ");

        for (int i = 0; i < payments.size(); i++) {
            sql.append("(:idsuscription").append(i).append(", :quotedescription").append(i)
                    .append(", :nextexpirationdate").append(i).append(", :dollarexchange").append(i)
                    .append(", :quoteusd").append(i).append(", :percentage").append(i)
                    .append(", :idstatepayment").append(i).append(", :obs").append(i)
                    .append(", :paydate").append(i).append(", :pts").append(i)
                    .append(", :isinitialquote").append(i).append(", :positiononschedule").append(i)
                    .append(", :numberquotepay").append(i).append(", :amortizationusd").append(i)
                    .append(", :capitalbalanceusd").append(i).append(", :totaloverdue").append(i)
                    .append(", :idpercentoverduedetail").append(i).append(")");

            if (i < payments.size() - 1) {
                sql.append(", ");
            }
        }

        var spec = databaseClient.sql(sql.toString());

        for (int i = 0; i < payments.size(); i++) {
            Payment payment = payments.get(i);
            spec = spec.bind("idsuscription" + i, payment.getIdSuscription())
                    .bind("quotedescription" + i, payment.getQuoteDescription())
                    .bind("nextexpirationdate" + i, payment.getNextExpirationDate())
                    .bind("dollarexchange" + i, payment.getDollarExchange())
                    .bind("quoteusd" + i, payment.getQuoteUsd())
                    .bind("percentage" + i, payment.getPercentage())
                    .bind("idstatepayment" + i, payment.getIdStatePayment())
                    .bind("obs" + i, payment.getObs())
                    .bind("pts" + i, payment.getPts())
                    .bind("isinitialquote" + i, payment.getIsInitialQuote())
                    .bind("positiononschedule" + i, payment.getPositionOnSchedule())
                    .bind("numberquotepay" + i, payment.getNumberQuotePay())
                    .bind("amortizationusd" + i, payment.getAmortizationUsd())
                    .bind("capitalbalanceusd" + i, payment.getCapitalBalanceUsd());

            if (payment.getTotalOverdue() != null) {
                spec = spec.bind("totaloverdue" + i, payment.getTotalOverdue());
            } else {
                spec = spec.bindNull("totaloverdue" + i, BigDecimal.class);
            }

            if (payment.getIdPercentOverduedetail() != null) {
                spec = spec.bind("idpercentoverduedetail" + i, payment.getIdPercentOverduedetail());
            } else {
                spec = spec.bindNull("idpercentoverduedetail" + i, Integer.class);
            }

            if (payment.getPayDate() != null) {
                spec = spec.bind("paydate" + i, payment.getPayDate());
            } else {
                spec = spec.bindNull("paydate" + i, LocalDateTime.class);
            }

            if (payment.getPercentage() != null) {
                spec = spec.bind("percentage" + i, payment.getPercentage());
            } else {
                spec = spec.bindNull("percentage" + i, BigDecimal.class);
            }

        }

        return spec.then()
                .then(Mono.just(true))
                .onErrorResume(e -> {
                    log.error("Failed to save payments", e);
                    return Mono.just(false);
                });
    }

    @Override
    public Mono<Boolean> putScheduleExpirationDate(Payment payment, LocalDateTime newExpiration) {


        return getAllPaymentsByIdSubscription(payment.getIdSuscription())
                .filter(p -> p.getPositionOnSchedule() >= payment.getPositionOnSchedule())
                .sort(Comparator.comparing(Payment::getPositionOnSchedule))
                .index() // Agrega un índice a cada elemento
                .flatMap(tuple -> {
                    long index = tuple.getT1(); // Obtiene el índice del elemento
                    Payment currentPayment = tuple.getT2(); // Obtiene el Payment actual

                    // Calcula la nueva fecha de vencimiento para este pago
                    LocalDateTime adjustedExpiration = newExpiration.plusMonths(index);

                    // Actualiza la fecha de vencimiento en el Payment
                    currentPayment.setNextExpirationDate(adjustedExpiration);

                    // Actualiza el Payment en la base de datos y retorna el Flux
                    return paymentRepository.save(currentPayment)
                            .flatMap(p -> {
                                kafkaTemplate.send("topic-payment", MembershipToAdminPanelMapper.mapToPaymentDTO(p));

                                if (p != null) {
                                    return Mono.just(true);
                                } else {
                                    return Mono.error(new RuntimeException("Error updating payment overdue status"));
                                }
                            });
                }).then(Mono.just(true));

    }

    @Override
    public Mono<Boolean> existsPaymentWithInitialQuotePayed(Integer suscriptionId) {
        return paymentRepository.existsByIdSuscriptionAndIsInitialQuoteAndIdStatePayment(suscriptionId, 1, 1);
    }

    @Override
    public Mono<Boolean> hasFirst12PaymentsStateOne(Integer suscriptionId) {
        return paymentRepository.hasFirst12PaymentsStateOne(suscriptionId);
    }

    @Override
    public Mono<Boolean> deleteScheduleByIdSuscription(Integer idSuscription) {
        return paymentRepository.deleteByIdSuscriptionAndIdStatePayment(idSuscription, 666)
                .then(Mono.just(true)) // Si se borra correctamente, retorna true
                .onErrorResume(e -> {
                    System.err.println("Error deleting payments: " + e.getMessage());
                    return Mono.just(false); // Si ocurre un error, retorna false
                });
    }

    @Override
    public Mono<Boolean> updateScheduleStatusTemporal(Integer idSuscription) {

        String sql = """
                UPDATE bo_membership.payment
                SET idstatepayment = 666
                WHERE idsuscription = :idSuscription ;
                """;

        return databaseClient.sql(sql)
                .bind("idSuscription", idSuscription)
                .fetch()
                .rowsUpdated()
                .map(updatedRows -> updatedRows > 0)  // Si hay filas actualizadas, devolvemos true
                .defaultIfEmpty(false)  // Si no hay filas actualizadas, devolvemos false
                .onErrorResume(throwable -> {
                    log.error("Error al actualizar el estado de la suscripción: ", throwable);
                    return Mono.error(new RuntimeException("Error en la actualización, se ejecutará un rollback."));
                });  // Si no se actualizó ninguna fila, devolvemos false
    }

    // Se cambio el proceso de migración
//    @Override
//    public Mono<List<Payment>> postPaymentsForMigration(List<Payment> payments) {
//        return saveAllPayments(payments) // Primero guardamos todos los pagos
//                .flatMap(success -> {
//                    if (success) {
//                        // Si el guardado fue exitoso, recuperamos los pagos por idSuscription
//                        return paymentRepository.findAllByIdSuscriptionAndIdStatePaymentNot(payments.get(0).getIdSuscription(),666)
//                                .collectList()
//                                .map(paymentList -> {
//                                    // Ordena la lista por positionOnSchedule de manera ascendente
//                                    //Importante para que se pueda hacer el manejo de Los Vouchers y su asignacion respectiva
//                                    paymentList.sort(Comparator.comparing(Payment::getPositionOnSchedule));
//                                    return paymentList;
//                                });
//                    } else {
//                        // Si el guardado falló, retornamos un Mono con un error
//                        return Mono.error(new RuntimeException("Failed to save payments"));
//                    }
//                });
//    }

    @Override
    public Mono<List<Payment>> postPaymentsForMigration(List<Payment> payments) {
        // Convertir la lista a un Flux
        Flux<Payment> paymentFlux = Flux.fromIterable(payments);

        // Filtrar y procesar los pagos
        return paymentFlux
                .filter(p -> !p.getIdStatePayment().equals(1)) // Filtrar pagos que no tengan idStatePayment = 1
                .flatMap(p -> paymentRepository.save(p) // Guardar el pago en la base de datos
                        .flatMap(saved -> {
                            // Enviar el pago guardado a Kafka
                            kafkaTemplate.send("topic-payment", MembershipToAdminPanelMapper.mapToPaymentDTO(saved));
                            return Mono.just(saved); // Devolver el pago guardado
                        })
                )
                .collectList(); // Recolectar todos los pagos guardados en una lista
    }


    @Override
    public Flux<Payment> getAllPaymentsAndMoraByIdSubscription(Integer idSubscription) {

        return getAllPaymentsByIdSubscription(idSubscription)
                .collectList()
                .flatMap(schedule -> calculateOverduePayment(schedule)
                        .flatMap(result -> {
                            if (result) {
                                return Mono.just(schedule); // If calculation is successful, return the schedule
                            } else {
                                return Mono.empty(); // Handle as appropriate (e.g., return empty or throw an error)
                            }
                        })
                )
                .flatMapMany(Flux::fromIterable);
    }


    public Mono<Boolean> calculateOverduePayment(List<Payment> schedule) {


        return Mono.justOrEmpty(schedule)
                .flatMapMany(Flux::fromIterable)
                .filter(payment -> (
                        (payment.getIdStatePayment() == State.INACTIVO.getValue() || payment.getIdStatePayment() == State.RECHAZO_CUOTA.getValue())))
                .sort(Comparator.comparing(Payment::getPositionOnSchedule))
                .next()
                .flatMap(pendingQuote -> {
                    if (pendingQuote != null) {
                        return Mono.zip(
                                        adminPanelService.getPercentdetailActive(TypePercentOverdue.ConCambioFecha.getValue()),
                                        calculateOverdue(pendingQuote))
                                .flatMap(response -> {
                                    PercentOverdueDetail percentDetail = response.getT1();
                                    BigDecimal amountOverdue = response.getT2();
                                    pendingQuote.setIdPercentOverduedetail(percentDetail.getIdPercentOverdueDetail().intValue());
                                    pendingQuote.setTotalOverdue(amountOverdue);
                                    return putPayment(pendingQuote)
                                            .flatMap(p -> {
                                                kafkaTemplate.send("topic-payment", MembershipToAdminPanelMapper.mapToPaymentDTO(p));

                                                if (p != null) {
                                                    return Mono.just(true);
                                                } else {
                                                    return Mono.error(new RuntimeException("Error updating payment overdue status"));
                                                }
                                            });
                                });
                    } else {
                        return Mono.error(new RuntimeException("No pending quotes found"));
                    }
                })
                .switchIfEmpty(Mono.just(true));
    }

    public Mono<BigDecimal> calculateOverdue(Payment payment) {

        return adminPanelService.getPercentdetailActive(TypePercentOverdue.ConCambioFecha.getValue()).
                flatMap(percendetail -> {

                            if (payment.getNextExpirationDate().toLocalDate().isAfter(TimeLima.getLimaDate().minusDays(1))) {
                                return Mono.just(BigDecimal.ZERO);
                            } else {
                                BigDecimal percent = percendetail.getPercentOverdue();
                                BigDecimal quote = payment.getQuoteUsd();
                                long totalDays = Duration.between(payment.getNextExpirationDate().toLocalDate().atStartOfDay(),
                                        TimeLima.getLimaDate().atStartOfDay()).toDays();


                                // Calcular el resultado: (quote * totalDays * percent) / 100
                                BigDecimal daysBigDecimal = BigDecimal.valueOf(totalDays).abs();
                                BigDecimal result = quote.multiply(daysBigDecimal)
                                        .multiply(percent)
                                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

                                return Mono.just(result);
                            }
                        }
                );
    }

    @Override
    public Mono<Payment> putPaymentOverdue(Payment payment, Integer idPercentOverdueDetail, BigDecimal totalOverdue) {

        payment.setIdPercentOverduedetail(idPercentOverdueDetail);
        payment.setTotalOverdue(totalOverdue);

        return putPayment(payment)
                .doOnSuccess(
                        p -> {
                            kafkaTemplate.send("topic-payment", MembershipToAdminPanelMapper.mapToPaymentDTO(p));
                        });
    }

    //Uso exclisivo para guardar Payments creador por el EditorDeCronogramas
    @Override
    public Mono<Payment> putPaymentWithId(Payment payment) {
        String sql = "INSERT INTO bo_membership.payment " +
                "(idpayment, idsuscription, quotedescription, nextexpirationdate, dollarexchange, " +
                "quoteusd, percentage, idstatepayment, obs, paydate, pts, isinitialquote, " +
                "positiononschedule, numberquotepay, amortizationusd, capitalbalanceusd, totaloverdue, " +
                "idpercentoverduedetail) VALUES (:idPayment, :idSuscription, :quoteDescription, " +
                ":nextexpirationdate, :dollarExchange, :quoteUsd, :percentage, :idstatepayment, :obs, " +
                ":paydate, :pts, :isinitialquote, :positionOnSchedule, :numberQuotePay, :amortizationUsd, " +
                ":capitalbalanceUsd, :totalOverdue, :idpercentoverduedetail)";

        DatabaseClient.GenericExecuteSpec spec = databaseClient.sql(sql)
                .bind("idPayment", payment.getIdPayment())
                .bind("idSuscription", payment.getIdSuscription())
                .bind("quoteDescription", payment.getQuoteDescription())
                .bind("nextexpirationdate", payment.getNextExpirationDate())
                .bind("dollarExchange", payment.getDollarExchange())
                .bind("quoteUsd", payment.getQuoteUsd())
                .bind("percentage", payment.getPercentage())
                .bind("idstatepayment", payment.getIdStatePayment())
                .bind("obs", payment.getObs());

        // Manejo del campo 'paydate' que puede ser null
        if (payment.getPayDate() != null) {
            spec = spec.bind("paydate", payment.getPayDate());
        } else {
            spec = spec.bindNull("paydate", LocalDateTime.class);
        }

        if (payment.getPercentage() != null) {
            spec = spec.bind("percentage", payment.getPercentage());
        } else {
            spec = spec.bindNull("percentage", BigDecimal.class);
        }

        if (payment.getObs() != null) {
            spec = spec.bind("obs", payment.getObs());
        } else {
            spec = spec.bindNull("obs", String.class);
        }


        // Continuar con los demás campos que pueden ser null
        spec = spec.bind("pts", payment.getPts())
                .bind("isinitialquote", payment.getIsInitialQuote())
                .bind("positionOnSchedule", payment.getPositionOnSchedule())
                .bind("numberQuotePay", payment.getNumberQuotePay())
                .bind("amortizationUsd", payment.getAmortizationUsd())
                .bind("capitalbalanceUsd", payment.getCapitalBalanceUsd());

        // Manejo del campo 'totalOverdue' que puede ser null
        if (payment.getTotalOverdue() != null) {
            spec = spec.bind("totalOverdue", payment.getTotalOverdue());
        } else {
            spec = spec.bindNull("totalOverdue", BigDecimal.class);
        }

        // Manejo del campo 'idpercentoverduedetail' que puede ser null
        if (payment.getIdPercentOverduedetail() != null) {
            spec = spec.bind("idpercentoverduedetail", payment.getIdPercentOverduedetail());
        } else {
            spec = spec.bindNull("idpercentoverduedetail", Integer.class);
        }

        return spec
                .fetch()
                .rowsUpdated()
                .map(rows -> payment); // Retornar el Payment después de insertar
    }

    @Override
    public Mono<Void> deletePaymentById(Long idPayment) {
        return paymentRepository.deleteByIdPayment(idPayment);
    }

    @Override
    public Mono<Boolean> isMigratedCommission(Integer idSuscription) {
        return null;
    }

    @Override
    public Mono<Payment> findFirstUnpaidByIdSuscriptionAndIdStatePayment(Integer idSuscription){
        return paymentRepository.findFirstUnpaidByIdSuscriptionAndIdStatePaymentNot(idSuscription.longValue())
                .defaultIfEmpty(new Payment());
    }

    @Override
    public Flux<Payment> getPaymentsDueToday(String fecha) {
        return paymentRepository.findPaymentsDueToday(fecha);
    }

    @Override
    public Mono<Payment> getLastPaymentBySubscriptions(List<Integer> subscriptionIds) {
        if (subscriptionIds == null || subscriptionIds.isEmpty()) {
            return Mono.empty();
        }
        
        return paymentRepository.findLastPaymentBySubscriptions(subscriptionIds)
                .doOnError(ex -> log.error("Error al obtener último pago para suscripciones {}: {}", subscriptionIds, ex.getMessage()));
    }

    @Override
    public Mono<Payment> getNextPaymentBySubscriptions(List<Integer> subscriptionIds) {
        if (subscriptionIds == null || subscriptionIds.isEmpty()) {
            return Mono.empty();
        }
        
        return paymentRepository.findNextPaymentBySubscriptions(subscriptionIds)
                .doOnError(ex -> log.error("Error al obtener próximo pago para suscripciones {}: {}", subscriptionIds, ex.getMessage()));
    }

}