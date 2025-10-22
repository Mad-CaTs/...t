package world.inclub.membershippayment.payPayment.aplication.service;

import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.reactor.circuitbreaker.operator.CircuitBreakerOperator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.ReactiveTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.reactive.TransactionalOperator;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import world.inclub.membershippayment.aplication.dao.PaymentDao;
import world.inclub.membershippayment.aplication.dao.PaymentVoucherDao;
import world.inclub.membershippayment.aplication.dao.SuscriptionDao;
import world.inclub.membershippayment.aplication.service.PaymentVoucherService;
import world.inclub.membershippayment.aplication.service.SubscriptionCouponService;
import world.inclub.membershippayment.aplication.service.SubscriptionDelayService;
import world.inclub.membershippayment.aplication.service.mapper.AccountToNotificationMapper;
import world.inclub.membershippayment.aplication.service.mapper.MembershipToAdminPanelMapper;
import world.inclub.membershippayment.crosscutting.exception.common.PaymentProcessingException;
import world.inclub.membershippayment.crosscutting.exception.common.ResourceNotFoundException;
import world.inclub.membershippayment.crosscutting.exception.core.BusinessLogicException;
import world.inclub.membershippayment.crosscutting.utils.TimeLima;
import world.inclub.membershippayment.domain.dto.request.SubscriptionDelayRequest;
import world.inclub.membershippayment.domain.entity.*;
import world.inclub.membershippayment.infraestructure.apisExternas.account.AccountService;
import world.inclub.membershippayment.infraestructure.apisExternas.account.dtos.UserAccountResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.AdminPanelService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDTO;
import world.inclub.membershippayment.infraestructure.apisExternas.collaborator.CollaboratorService;
import world.inclub.membershippayment.infraestructure.apisExternas.commission.CommissionService;
import world.inclub.membershippayment.infraestructure.apisExternas.notification.NotificationService;
import world.inclub.membershippayment.crosscutting.utils.mappers.PaymentToPaymentDTOMapper;
import world.inclub.membershippayment.crosscutting.utils.mappers.SuscriptionToSuscriptionDTOMapper;
import world.inclub.membershippayment.domain.dto.*;
import world.inclub.membershippayment.domain.dto.request.CMeansPayment;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.ObjModel;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.TypeExchangeResponse;
import world.inclub.membershippayment.domain.dto.response.UserResponse;
import world.inclub.membershippayment.domain.enums.ArraysData;
import world.inclub.membershippayment.domain.enums.CodigoTypeWalletTransaction;
import world.inclub.membershippayment.domain.enums.State;
import world.inclub.membershippayment.domain.enums.TypeMethodPayment;
import world.inclub.membershippayment.domain.enums.TypePercentOverdue;
import reactor.util.function.Tuple2;
import world.inclub.membershippayment.infraestructure.apisExternas.tree.dto.Membership;
import world.inclub.membershippayment.infraestructure.apisExternas.tree.service.TreeService;
import world.inclub.membershippayment.infraestructure.apisExternas.walllet.WalletService;
import world.inclub.membershippayment.infraestructure.config.kafka.dtos.response.WalletResponseDto;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

@Service
@Slf4j
@RequiredArgsConstructor
public class PayPaymentService {

    private final PaymentDao paymentDao;
    private final SuscriptionDao suscriptionDao;
    private final AccountService accountService;
    private final AdminPanelService adminPanelService;
    private final PaymentVoucherService paymentVoucherService;
    private final PaymentVoucherDao paymentVoucherDao;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final CircuitBreakerRegistry circuitBreakerRegistry;
    private final WalletService walletService;
    private final NotificationService notificationService;
    private final CommissionService commissionService;
    private final TreeService treeService;
    private final ReactiveTransactionManager transactionManager;
    private final SubscriptionDelayService subscriptionDelayService;
    private final CollaboratorService collaboratorService;

    private final SubscriptionCouponService subscriptionCouponService;

    /**
     * Este método se encarga de procesar el pago de la suscripción.
     *
     * @param cMeansPayment Contiene la información del pago.
     * @return Un Mono<Boolean> que indica si el pago fue procesado exitosamente.
     */

    private Mono<Boolean> applyGracePeriod(CMeansPayment cMeansPayment, Payment payment) {
        if (Boolean.TRUE.equals(cMeansPayment.getIsGracePeriodApplied())) {

            payment.setTotalOverdue(cMeansPayment.getTotalOverdue());
            payment.setIdPercentOverduedetail(cMeansPayment.getIdPercentOverdueDetail());

            //BigDecimal newPts = payment.getPts().subtract(payment.getTotalOverdue());
            //payment.setPts(BigDecimal.ZERO);

            Mono<Boolean> paymentMono = paymentDao.putPayment(payment)
                    .doOnSuccess(
                            p -> kafkaTemplate.send("topic-payment", MembershipToAdminPanelMapper.mapToPaymentDTO(p)))
                    .then(Mono.just(true));

            if (cMeansPayment.getTypeMethodPayment() == TypeMethodPayment.PAYPAL.getValue()
                    || cMeansPayment.getTypeMethodPayment() == TypeMethodPayment.WALLET.getValue()) {

                if (cMeansPayment.getTypePercentOverdue() == TypePercentOverdue.ConCambioFecha.getValue()) {
                    return paymentMono.then(paymentDao.putScheduleExpirationDate(payment, TimeLima.getLimaTime())
                            .then(Mono.just(true)));
                }

                return paymentMono;
            } else {
                return paymentMono;
            }

        } else {
            if (payment.getNextExpirationDate().toLocalDate().isBefore(TimeLima.getLimaDate())) {
                return paymentDao.putScheduleExpirationDate(payment, TimeLima.getLimaTime())
                        .then(Mono.just(true));
            }
            return Mono.just(true);
        }
    }

    public Mono<Boolean> validatePaymentAmount(CMeansPayment request, Integer idSuscription) {

        Set<Integer> INVALID_STATES = Set.of(State.ACTIVO.getValue(), State.PENDIENTE_VALIDACION_CUOTA.getValue(),
                State.PENDIENTE_VALIDACION_INICIAL.getValue());

        return paymentDao.getAllPaymentsByIdSubscription(idSuscription)
                .filter(payment -> !INVALID_STATES.contains(payment.getIdStatePayment()))
                .sort(Comparator.comparing(Payment::getPositionOnSchedule))
                .take(request.getNumberAdvancePaymentPaid() + 1)
                .map(Payment::getQuoteUsd)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .flatMap(result -> {

                    // Corregir para el tema de Soles a dolares
                    int comparisonResult = request.getAmountPaidPayment().compareTo(result);

                    if (comparisonResult >= 0) {
                        System.out.println("El monto es correcto o mayor.");
                        return Mono.just(true);
                    } else {
                        return Mono.error(new BusinessLogicException(
                                "El monto es incorrecto. Debe ser menor a lo esperado en dolares"));
                    }
                });
    }

    public Mono<Boolean> PayPaymentSuscription(CMeansPayment cMeansPayment) {

        TransactionalOperator transactionalOperator = TransactionalOperator.create(transactionManager);

        Integer totalQuotesPay = cMeansPayment.getNumberAdvancePaymentPaid() + 1;

        AtomicReference<State> stateSuscripcion = new AtomicReference<>(State.ACTIVO);
        AtomicReference<State> stateUser = new AtomicReference<>(State.ACTIVO);
        AtomicReference<State> stateVerif = new AtomicReference<>(State.ACTIVO);
        log.info("cMeansPayment getTypeMethodPayment: {}", cMeansPayment.getTypeMethodPayment());

        List<PaymentVoucher> listVoucher = new ArrayList<>();

        CodigoTypeWalletTransaction TYPEWALLETTRANSACTION = CodigoTypeWalletTransaction.PAGO_CUOTA;

        return transactionalOperator.transactional(
                Mono.zip(
                            adminPanelService.getTypeExchange(),
                            paymentDao.getPaymentById(Long.valueOf(cMeansPayment.getIdPayment())))
                        .flatMap(tuple4 -> {
                                TypeExchangeResponse typeExchange = tuple4.getT1();
                                Payment payment = tuple4.getT2();
                            return validateSubscriptionDelay(cMeansPayment.getTypeMethodPayment(), payment)
                                    .then(
                                        Mono.zip(
                                                suscriptionDao.getSuscriptionById(Long.valueOf(payment.getIdSuscription())),
                                                validatePaymentAmount(cMeansPayment, payment.getIdSuscription()))
                                            .flatMap(tuple2 -> {

                                                Suscription suscription = tuple2.getT1();
                                                Boolean validate = tuple2.getT2();
                                                Integer idUser = suscription.getIdUser();
                                                List<State> statesPaymentMade = Arrays.asList(ArraysData.StatesPaymentMade);

                                                if (!statesPaymentMade.contains(State.values()[payment.getIdStatePayment()])) {
                                                    return Mono.zip(

                                                                applyGracePeriod(cMeansPayment, payment),
// linea de codigo para registra en payment
                                                                handlePaymentType(cMeansPayment, payment, stateSuscripcion, stateUser, stateVerif, TYPEWALLETTRANSACTION, typeExchange, suscription)
                                                            )
                                                            .flatMap(tuple -> {
// linea de codigo para registra en payment
                                                                Boolean applyGracePeriodVar = tuple.getT1();
                                                                List<PaymentVoucher> paymentVouchers = tuple.getT2();
                                                                listVoucher.addAll(paymentVouchers);

                                                                return updateSuscriptionDetailsAfterPayment(listVoucher,
                                                                        payment.getIdSuscription(), payment, idUser,
                                                                        stateVerif, stateSuscripcion, stateUser,
                                                                        totalQuotesPay).doOnSuccess(end -> {
                                                                            Mono.fromRunnable(
                                                                                    () -> sendQuotaPaymentEmail(
                                                                                            cMeansPayment, suscription,
                                                                                            paymentVouchers))
                                                                                    .subscribe();
                                                                        });
                                                            });
                                                } else {
                                                    return Mono.error(new BusinessLogicException(
                                                            "The payment has already been made"));
                                                }
                                            }));
                        }));
    }

    private Mono<Void> validateSubscriptionDelay(int typeMethodPayment, Payment payment) {
        boolean conditionWallet = typeMethodPayment == TypeMethodPayment.WALLET.getValue();
        boolean conditionPaypal = typeMethodPayment == TypeMethodPayment.PAYPAL.getValue();
        if (conditionWallet || conditionPaypal) {
            SubscriptionDelayRequest request = SubscriptionDelayRequest.builder()
                    .idSubscription((long) payment.getIdSuscription())
                    .idPayment(payment.getIdPayment())
                    .expirationDate(payment.getNextExpirationDate())
                    .paymentDate(TimeLima.getLimaTime())
                    .build();
            return subscriptionDelayService.calculateAndSavePaymentDelay(request).then();
        }
        return Mono.empty();
    }

    public Mono<Boolean> sendQuotaPaymentEmail(CMeansPayment request, Suscription suscription,
            List<PaymentVoucher> listVoucher) {

        Integer idUser = suscription.getIdUser();
        Set<Integer> automaticMethods = Set.of(TypeMethodPayment.PAYPAL.getValue(),
                TypeMethodPayment.WALLET.getValue());

        return Mono.zip(
                accountService.getUserAccountById(idUser),
                adminPanelService.getPackageData(suscription.getIdPackage(), suscription.getIdPackageDetail()))
                .flatMap(tuple -> {

                    UserAccountResponse userAccountResponse = tuple.getT1();
                    UserResponse userResponse = AccountToNotificationMapper.mapToUserResponse(userAccountResponse);
                    PackageDTO packageDTO = new PackageDTO();

                    ObjModel objModel1 = new ObjModel();
                    objModel1.setPackageInfo(packageDTO);

                    if (automaticMethods.contains(request.getTypeMethodPayment())) {

                        return notificationService.sendEmailSuccesfulPaymentDirectPayment(userResponse,
                                request.getAmountPaidPayment(), objModel1.getPackageInfo());
                    } else {
                        return notificationService.sendEmailQuotePayedVoucher(userResponse,
                                request.getAmountPaidPayment(), null,
                                objModel1.getPackageInfo(), listVoucher.get(0));

                    }

                });

    }

    /**
     * Este método se encarga de manejar el tipo de pago.
     *
     * @param meansPayment          Contiene la información del medio de pago.
     * @param payment               Contiene la información del pago.
     * @param stateSuscripcion      El estado de la suscripción.
     * @param stateUser             El estado del usuario.
     * @param stateVerif            El estado de la verificación.
     * @param TYPEWALLETTRANSACTION El tipo de transacción de la billetera.
     * @param typeExchange          La respuesta del tipo de cambio.
     * @return Un Mono<List<PaymentVoucher>> que contiene la lista de comprobantes
     *         de pago.
     */
    private Mono<List<PaymentVoucher>> handlePaymentType(CMeansPayment meansPayment, Payment payment,
            AtomicReference<State> stateSuscripcion, AtomicReference<State> stateUser,
            AtomicReference<State> stateVerif, CodigoTypeWalletTransaction TYPEWALLETTRANSACTION,
            TypeExchangeResponse typeExchange,
            Suscription suscription) {
        TypeMethodPayment typeMethodPayment = TypeMethodPayment.fromValue(meansPayment.getTypeMethodPayment());

        switch (typeMethodPayment) {

            case PAYPAL:

                return adminPanelService.getPaymentSubType(9).flatMap(paymentSubType1 -> {

                    return paymentVoucherService
                            .MakePaymentPaypal(meansPayment.getAmountPaidPayment(),
                                    meansPayment.getPaypalDTO().getNroOperation(), paymentSubType1)
                            .map(Collections::singletonList);

                });

            case VOUCHERS, OTROS:

                return changePaymentStatusPendingValidation(stateSuscripcion, stateUser, stateVerif,
                        payment.getIsInitialQuote(), payment)
                        .flatMap(value -> {
                            if (value) {
                                return paymentVoucherService.MakePaymentVouchers(meansPayment.getListaVouches(),
                                        typeExchange);
                            } else {
                                return Mono.error(new RuntimeException("Los odio a todos"));
                            }
                        });

            case WALLET:

                SponsordResponse userPayment = new SponsordResponse();
                userPayment.setId(suscription.getIdUser());

                return Mono.zip(
                        accountService.getUserSponsor(suscription.getIdUser()),
                        //
                        //modificar aqui
                        adminPanelService.getPackageData(suscription.getIdPackage(),
                                suscription.getIdPackageDetail()))
                        .flatMap(tuple -> {

                            SponsordResponse userSponsor = tuple.getT1();
                            PackageDTO packageDTO2 = tuple.getT2();

                            ObjModel objModel = new ObjModel();
                            objModel.setPackageInfo(packageDTO2);

                            User user = new User();
                            user.setIdUser(userSponsor.getId());
                            user.setName(userSponsor.getName());
                            user.setLastName(userSponsor.getLastName());

                            return paymentVoucherService
                                    .MakeWalletFullPayment(userPayment, meansPayment.getWalletTransaction(),
                                            TYPEWALLETTRANSACTION.getCode(), objModel, user)
                                    .map(Collections::singletonList);

                        });

            case MIXTO:

                return Mono
                        .zip(changePaymentStatusPendingValidation(stateSuscripcion, stateUser, stateVerif,
                                payment.getIsInitialQuote(), payment),
                                accountService.getUserSponsor(suscription.getIdUser()))
                        .flatMap(tuple2 -> {

                            SponsordResponse userSponsor = tuple2.getT2();
                            Boolean value = tuple2.getT1();

                            if (value) {
                                User user = new User();
                                user.setIdUser(userSponsor.getId());
                                user.setName(userSponsor.getName());
                                user.setLastName(userSponsor.getLastName());

                                return Mono.zip(walletService.getWallet(suscription.getIdUser()),
                                        accountService.getUserSponsor(suscription.getIdUser()),
                                        adminPanelService.getPackageData(suscription.getIdPackage(),
                                                suscription.getIdPackageDetail()))
                                        .flatMap(tuple -> {

                                            WalletResponseDto walletResponseDto = (WalletResponseDto) tuple.getT1();
                                            SponsordResponse userPayment2 = tuple.getT2();
                                            PackageDTO packageDTO2 = tuple.getT3();
                                            ObjModel objModel = new ObjModel();
                                            objModel.setPackageInfo(packageDTO2);

                                            meansPayment.getWalletTransaction()
                                                    .setIdWallet(walletResponseDto.getIdWallet());
                                            return paymentVoucherService.MakeMixedPayment(userPayment2,
                                                    meansPayment.getWalletTransaction(),
                                                    TYPEWALLETTRANSACTION.getCode(),
                                                    objModel, user, meansPayment.getListaVouches(), typeExchange);

                                        });

                            } else {
                                return Mono.error(new RuntimeException("Los odio a todos"));
                            }

                        });

            default:

                return Mono.error(new ResourceNotFoundException("There is no other payment method"));
        }

    }

    private Mono<Boolean> changePaymentStatusPendingValidation(AtomicReference<State> stateSuscripcion,
            AtomicReference<State> stateUser,
            AtomicReference<State> stateVerif, Integer isQuoteInitial, Payment payment) {

        Integer result = hasExpirationPassed(payment);
        if (isQuoteInitial == 1) {
            stateSuscripcion.set(State.PENDIENTE_VALIDACION_INICIAL);
            stateUser.set(State.PENDIENTE_VALIDACION_INICIAL);
            stateVerif.set(State.PENDIENTE_VALIDACION_INICIAL);
        } else if (isQuoteInitial == 2) {
            stateSuscripcion.set(State.PENDIENTE_VALIDACION_MIGRACION);
            stateUser.set(State.PENDIENTE_VALIDACION_MIGRACION);
            stateVerif.set(State.PENDIENTE_VALIDACION_MIGRACION);
        } else {
            if (result == 1) {
                stateSuscripcion.set(State.PENDIENTE_VALIDACION_CUOTA_ADELANTADA);
                stateUser.set(State.PENDIENTE_VALIDACION_CUOTA_ADELANTADA);
                stateVerif.set(State.PENDIENTE_VALIDACION_CUOTA_ADELANTADA);
            } else {
                stateSuscripcion.set(State.PENDIENTE_VALIDACION_CUOTA);
                stateUser.set(State.PENDIENTE_VALIDACION_CUOTA);
                stateVerif.set(State.PENDIENTE_VALIDACION_CUOTA);
            }
        }
        return Mono.just(Boolean.TRUE);

        // Devuelve un Mono vacío ya que no necesitamos devolver un valor.

    }

    public Integer hasExpirationPassed(Payment payment) {
        LocalDateTime now = TimeLima.getLimaTime();
        return payment.getNextExpirationDate().isBefore(now) ? 1 : 0;
    }

    private Mono<Boolean> updateSuscriptionDetailsAfterPayment(List<PaymentVoucher> listVouchers, Integer idSuscription,
            Payment payment, Integer userId, AtomicReference<State> stateVerif, AtomicReference<State> stateSuscripcion,
            AtomicReference<State> stateUser, Integer totalQuotesPay) {
        return paymentDao.getAllPaymentsByIdSubscription(idSuscription)
                // .doOnNext(payments -> log.info("Obtained all payments for subscription: {}",
                // idSuscription))
                .doOnError(e -> log.error("Error obtaining payments for subscription: {}", idSuscription, e))
                .collectList().flatMap(cronograma -> {
                    cronograma.sort(Comparator.comparing(Payment::getPositionOnSchedule));
                    return suscriptionDao.getSuscriptionById(Long.valueOf(idSuscription))
                            .flatMap(suscription -> {
                                return changePaymentsPaidDetails(cronograma, payment, totalQuotesPay, stateVerif, suscription)
                                .flatMap(scheduleSection1 -> assignPaymentVoucher(listVouchers,
                                        scheduleSection1.get(0).getIdPayment(),
                                        scheduleSection1.get(0).getIdSuscription())

                                        .then(UpdateStatusMakingPayment(userId, idSuscription, scheduleSection1,
                                                stateUser,
                                                stateSuscripcion).flatMap(isValue -> {
                                                    if (isValue) {
                                                        // Ejecuta el proceso de comisiones de forma asíncrona en
                                                        // paralelo y
                                                        // espera a que se complete
                                                        return treeService
                                                                .synchronizeMembershipDataForPay(suscription,
                                                                        scheduleSection1)
                                                                .then(accountService.getDniByUserId(userId)
                                                                        .flatMap(dni -> {
                                                                            if (dni != null) {
                                                                                return collaboratorService
                                                                                        .validateDni(dni)
                                                                                        .flatMap(validationResponse -> {
                                                                                            if (validationResponse
                                                                                                    .isCollaborator()) {
                                                                                                log.info(
                                                                                                        "Skipping commission generation for collaborator user: {}",
                                                                                                        userId);
                                                                                                return Mono.empty();
                                                                                            } else {
                                                                                                return commissionService
                                                                                                        .generateCommissionsForPayments(
                                                                                                                scheduleSection1,
                                                                                                                userId);
                                                                                            }
                                                                                        });
                                                                            } else {
                                                                                log.warn(
                                                                                        "DNI not available for user {}. Proceeding with commission generation.",
                                                                                        userId);
                                                                                return commissionService
                                                                                        .generateCommissionsForPayments(
                                                                                                scheduleSection1,
                                                                                                userId);
                                                                            }
                                                                        }))
                                                                .subscribeOn(Schedulers.parallel()).thenReturn(isValue); // Retorna
                                                                                                                         // `true`
                                                                                                                         // al
                                                                                                                         // completar
                                                    } else {
                                                        return Mono.just(isValue); // Si no, solo retorna el resultado
                                                                                   // original
                                                    }
                                                }

                                        )));

                    });

                });
    }

    /**
     * Este método se encarga de cambiar los detalles de los pagos realizados.
     *
     * @param schedule       Lista de pagos.
     * @param payment        Información del pago.
     * @param totalQuotesPay Total de cuotas pagadas.
     * @param stateVerif     Estado de la verificación.
     * @param suscription    suscription.
     * @return Un Mono<List<Payment>> que contiene la lista de pagos actualizados.
     */
    private Mono<List<Payment>> changePaymentsPaidDetails(List<Payment> schedule, Payment payment, int totalQuotesPay,
            AtomicReference<State> stateVerif, Suscription suscription) {
        Flux<Payment> paymentFlux = Flux.fromIterable(schedule);
        return getScheduleSection(paymentFlux, payment.getIdPayment(), totalQuotesPay).collectList()
                .flatMap(lispayment1 -> {
                    return adminPanelService.getPackageData(suscription.getIdPackage(), suscription.getIdPackageDetail())
                            .flatMap(packDto -> {

                                    ObjModel objModel1 = new ObjModel();
                                    objModel1.setPackageInfo(packDto);

                                return changePaymentDetailMakingPaid(lispayment1.get(0), stateVerif,
                                        objModel1.getPackageInfo().getPackageDetail().get(0).getVolume(), totalQuotesPay)
                                        .flatMap(payment1 -> {
                                            if (totalQuotesPay > 1) {

                                                Integer userId = suscription.getIdUser().intValue();
                                                BigDecimal ptsValue = objModel1.getPackageInfo().getPackageDetail().get(0).getVolume();
                                                BigDecimal ptsVauleByFree = objModel1.getPackageInfo().getPackageDetail().get(0).getVolumeByFee();

                                                return changeAdvancePaymentData(lispayment1, stateVerif, ptsValue, ptsVauleByFree, userId)
                                                        .map(lispayment2 -> {
                                                            lispayment2.add(0, payment1);
                                                            return lispayment2;
                                                        });
                                            }
                                            return Flux.fromIterable(lispayment1).collectList(); // Convert
                                                                                                 // Flux<Payment> to

                                        });
                            });
                });
    }

    /**
     * Este método se encarga de obtener la sección del cronograma.
     *
     * @param schedule          Cronograma de pagos.
     * @param idPayment         ID del pago.
     * @param totalPaymentsPaid Total de pagos realizados.
     * @return Un Flux<Payment> que contiene la sección del cronograma.
     */
    private Flux<Payment> getScheduleSection(Flux<Payment> schedule, Long idPayment, Integer totalPaymentsPaid) {
        return schedule.index().filter(tuple -> tuple.getT2().getIdPayment().equals(idPayment)).next()
                .flatMapMany(tuple -> {
                    long positionInitialSect = tuple.getT1();
                    long postionFinSection = totalPaymentsPaid + positionInitialSect;

                    return schedule.index().filter(indexedPayment -> indexedPayment.getT1() >= positionInitialSect
                            && indexedPayment.getT1() < postionFinSection).map(Tuple2::getT2);
                });
    }

    /**
     * Este método se encarga de cambiar los detalles del pago realizado.
     *
     * @param payment        Información del pago.
     * @param stateVerif     Estado de la verificación.
     * @param volumePackage  Volumen del paquete.
     * @param totalQuotesPay Total de cotizaciones pagadas.
     * @return Un Mono<Payment> que contiene el pago actualizado.
     */
    public Mono<Payment> changePaymentDetailMakingPaid(Payment payment, AtomicReference<State> stateVerif,
            BigDecimal volumePackage, int totalQuotesPay) {
        if (payment == null) {
            return Mono.empty();
        }

        return Mono.fromSupplier(() -> {
            payment.setIdStatePayment(stateVerif.get().getValue());
            payment.setPayDate(TimeLima.getLimaTime());
            payment.setNumberQuotePay(totalQuotesPay);

            if (stateVerif.get() == State.ACTIVO) {
                payment.setPts(volumePackage);
            } else {
                payment.setPts(BigDecimal.ZERO);
            }

            return payment;

        });
    }

    /**
     * Este método se encarga de cambiar los datos del pago anticipado.
     *
     * @param paymentsPaid  Pagos realizados.
     * @param verifState    Estado de la verificación.
     * @param packageVolume Puntos/Volumen del paquete solo para iniciales del cronograma.
     * @param packageVolumeByFee Puntos del paquete para las cuotas no para iniciales.
     * @return Un Mono<List<Payment>> que contiene la lista de pagos actualizados.
     */
    public Mono<List<Payment>> changeAdvancePaymentData(List<Payment> paymentsPaid, AtomicReference<State> verifState, BigDecimal packageVolume, BigDecimal packageVolumeByFee, Integer userId) {
         if (paymentsPaid == null || paymentsPaid.isEmpty()) {
            return Mono.empty();
        }

        if (paymentsPaid == null || paymentsPaid.isEmpty()) {
            return Mono.empty();
        }

        Integer subscriptionId = paymentsPaid.get(0).getIdSuscription();
        String quoteDescription = paymentsPaid.get(0).getQuoteDescription();
        String obsQuotes = String.format("Pagado en %s", quoteDescription);
        BigDecimal ptsPackage = verifState.get() == State.ACTIVO ? packageVolume : BigDecimal.ZERO;

        Mono<SubscriptionCoupon> subscriptionCoupon = subscriptionCouponService
                .findByIdSuscriptionAndUserId(subscriptionId, userId)
                .defaultIfEmpty(new SubscriptionCoupon());
                 // Bloquea para esperar el resultado del cupón
        return subscriptionCoupon.flatMap(coupon -> {

            Boolean applyCoupon;
            if(coupon.getDiscountPercentage() != null && coupon.getDiscountPercentage().compareTo(BigDecimal.ZERO) > 0 ) {
                applyCoupon = true;
            } else {
                applyCoupon = false;
            }
            return Flux.fromIterable(paymentsPaid)
                    .skip(1) // Skip the first element
                    .map(payment -> {
                        BigDecimal selectVolumen = payment.getIsInitialQuote() == 1 ? packageVolume : packageVolumeByFee;
                        BigDecimal discountVolumen = applyCoupon ? coupon.getDiscountPercentage().divide(new BigDecimal(100)).multiply(selectVolumen) : BigDecimal.ZERO;
                        BigDecimal newVolumen = ptsPackage.intValue()>0 ? selectVolumen.subtract(discountVolumen) : BigDecimal.ZERO;

                        payment.setObs(obsQuotes);
                        payment.setPts(newVolumen);
                        payment.setPayDate(TimeLima.getLimaTime());
                        payment.setIdStatePayment(verifState.get().getValue());
                        payment.setNumberQuotePay(0);
                        return payment;
                    })
                    .collectList()
                    .map(updatedPayments -> {
                        // Add the first payment back to the list
                        updatedPayments.add(0, paymentsPaid.get(0));
                        return updatedPayments;
                    });
        });

    }

    private Mono<Void> assignPaymentVoucher(List<PaymentVoucher> listVouchers, Long idPayment, Integer idSuscription) {
        return Flux.fromIterable(listVouchers).map(voucher -> new PaymentVoucher(voucher, idPayment, idSuscription))
                .flatMap(paymentVoucher -> {
                    return paymentVoucherDao.putPaymentVoucher(paymentVoucher).flatMap(paymentVoucher1 -> {
                        PaymentVoucherDTO paymentVoucherDTO = MembershipToAdminPanelMapper
                                .mapPaymentVoucherDTO(paymentVoucher1);
                        kafkaTemplate.send("topic-paymentvoucher", paymentVoucherDTO);
                        return Mono.empty();
                    });
                }).then();
    }

    /**
     * Este método se encarga de actualizar el estado del pago .
     *
     * @param userId           ID del usuario.
     * @param idSuscription    ID de la suscripción.
     * @param scheduleSection  Sección del cronograma.
     * @param stateUser        Estado del usuario.
     * @param stateSuscripcion Estado de la suscripción.
     * @return Un Mono<Boolean> que indica si la operación fue exitosa.
     */
    private Mono<Boolean> UpdateStatusMakingPayment(Integer userId, Integer idSuscription,
            List<Payment> scheduleSection, AtomicReference<State> stateUser, AtomicReference<State> stateSuscripcion) {
        PaymentToPaymentDTOMapper paymentMapper = new PaymentToPaymentDTOMapper();
        SuscriptionToSuscriptionDTOMapper suscriptionMapper = new SuscriptionToSuscriptionDTOMapper();

        return suscriptionDao.getSuscriptionById(Long.valueOf(idSuscription)).flatMap(suscription -> {
            return adminPanelService.getPackageData(suscription.getIdPackage(), suscription.getIdPackageDetail())
                    .flatMap(packDto -> {
                        suscription.setStatus(stateSuscripcion.get().getValue());
                        SuscriptionDTO suscriptionDTO = suscriptionMapper.map(suscription); // Convert
                        // Suscription to
                        // SuscriptionDTO
                        Flux.fromIterable(scheduleSection) // Convert List<Payment> to Flux<Payment>
                                .flatMap(payment -> {
                                    PaymentDTO paymentDTO = paymentMapper.map(payment); // Convert Payment to
                                    // PaymentDTO
                                    log.info("Payment sent to Kafka" + stateUser.get().getValue());
                                    UserStateDto userStateDto = new UserStateDto();

                                    userStateDto.setIdUser(Long.valueOf(userId));
                                    userStateDto.setIdState(Long.valueOf(stateUser.get().getValue()));

                                    return paymentDao.putPayment(payment).doOnSuccess(payments1 -> {
                                        kafkaTemplate.send("topic-payment", paymentDTO);
                                        kafkaTemplate.send("topic-test-suscription", suscriptionDTO);
                                        kafkaTemplate.send("topic-state-account", userStateDto);
                                    });

                                }).subscribe();
                        return Mono.just(true);
                    });
        });
    }

    /**
     * Este método se encarga de borrar las cuotas que se le pasen .
     */
    public Mono<Void> deletePaymentsAndVouchers(List<Long> paymentIds) {
        // log.info("Iniciando eliminación de Payments y PaymentVouchers para los IDs:
        // {}", paymentIds);

        return Flux.fromIterable(paymentIds)
                .flatMap(paymentId -> paymentVoucherDao.deletePaymentVoucherByIdPayment(paymentId.intValue())
                        .then(paymentDao.deletePaymentById(paymentId)))
                .then(); // Completa el Mono cuando todos los Flux finalizan
    }

    public Mono<Void> deletePaymentVoucherByIdPaymentVoucher(List<Long> idPaymentVouchers) {
        return Flux.fromIterable(idPaymentVouchers)
                .flatMap(idPaymentVoucher -> paymentVoucherDao
                        .deletePaymentVoucherByIdPaymentVoucher(idPaymentVoucher.intValue()))
                .then();

    }

    public Mono<Payment> findFirstUnpaidByIdSuscriptionAndIdStatePayment(Integer idSuscription) {
        return paymentDao.findFirstUnpaidByIdSuscriptionAndIdStatePayment(idSuscription)
                .defaultIfEmpty(new Payment());
    }

    /**
     * Procesa un pago usando el método WALLET
     *
     * @param meansPayment              Datos del medio de pago
     * @param suscription               Información de la suscripción
     * @param typeWalletTransactionCode Código del tipo de transacción de wallet
     * @return Mono con la lista de PaymentVoucher generados
     */
    private Mono<List<PaymentVoucher>> processWalletPayment(CMeansPayment meansPayment,
            Suscription suscription,
            Integer typeWalletTransactionCode) {
        SponsordResponse userPayment = new SponsordResponse();
        userPayment.setId(suscription.getIdUser());

        return Mono.zip(
                accountService.getUserSponsor(suscription.getIdUser()),
                adminPanelService.getPackageData(suscription.getIdPackage(), suscription.getIdPackageDetail()))
                .flatMap(tuple -> {
                    SponsordResponse userSponsor = tuple.getT1();
                    PackageDTO packageData = tuple.getT2();

                    if (userSponsor == null) {
                        return Mono.error(new ResourceNotFoundException("Sponsor user not found"));
                    }

                    if (packageData == null) {
                        return Mono.error(new ResourceNotFoundException("Package data not found"));
                    }

                    ObjModel packageModel = new ObjModel();
                    packageModel.setPackageInfo(packageData);

                    User user = createUserFromSponsor(userSponsor);

                    if (meansPayment.getWalletTransaction() == null) {
                        return Mono.error(new IllegalArgumentException("Wallet transaction information is required"));
                    }
                    return paymentVoucherService.MakeWalletFullPayment(
                            userPayment,
                            meansPayment.getWalletTransaction(),
                            typeWalletTransactionCode,
                            packageModel,
                            user)
                            .map(paymentVoucher -> {
                                log.info("Pago wallet procesado exitosamente para usuario: {} - Monto: {}",
                                        suscription.getIdUser(),
                                        meansPayment.getAmountPaidPayment());

                                return Collections.singletonList(paymentVoucher);
                            })
                            .onErrorMap(ex -> {
                                log.error("\"Error procesando pago wallet para usuario: {} - Error: {}",
                                        suscription.getIdUser(), ex.getMessage());
                                return new PaymentProcessingException(
                                        "Error al procesar pago con wallet: " + ex.getMessage(), ex);
                            });
                });

    }

    /**
     * Crea un objeto User a partir de la información del patrocinador
     *
     * @param userSponsor Información del usuario patrocinador
     * @return User objeto User creado
     */

    private User createUserFromSponsor(SponsordResponse userSponsor) {
        User user = new User();
        user.setIdUser(userSponsor.getId());
        user.setName(userSponsor.getName());
        user.setLastName(userSponsor.getLastName());

        if (userSponsor.getId() == null) {
            throw new ResourceNotFoundException("Sponsor user not found");
        }

        return user;
    }

    /**
     * Método público para procesar pagos wallet con validaciones adicionales
     *
     * @param meansPayment          Datos del medio de pago
     * @param suscription           Información de la suscripción
     * @param typeWalletTransaction Tipo de transacción wallet
     * @return Mono con la lista de PaymentVoucher generados
     */

    public Mono<List<PaymentVoucher>> handleWalletPayment(CMeansPayment meansPayment,
            Suscription suscription,
            CodigoTypeWalletTransaction typeWalletTransaction) {

        if (meansPayment == null) {
            return Mono.error(new IllegalArgumentException("Payment method information is required"));
        }

        if (suscription == null) {
            return Mono.error(new IllegalArgumentException("Subscription information is required"));
        }
        if (typeWalletTransaction == null) {
            return Mono.error(new IllegalArgumentException("Wallet transaction type is required"));
        }

        TypeMethodPayment typeMethodPayment = TypeMethodPayment.fromValue(meansPayment.getTypeMethodPayment());
        if (typeMethodPayment != typeMethodPayment.WALLET) {
            return Mono.error(new IllegalArgumentException("Payment method must be WALLET"));
        }

        return processWalletPayment(meansPayment, suscription, typeWalletTransaction.getCode())
                .timeout(Duration.ofSeconds(30))
                .retry(2);

    }

}
