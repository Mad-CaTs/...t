package world.inclub.membershippayment.aplication.service;

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
import reactor.util.function.Tuple2;
import reactor.util.function.Tuples;
import world.inclub.membershippayment.aplication.dao.PaymentDao;
import world.inclub.membershippayment.aplication.dao.PaymentVoucherDao;
import world.inclub.membershippayment.aplication.dao.SuscriptionDao;
import world.inclub.membershippayment.aplication.dao.impl.IPaymentDao;
import world.inclub.membershippayment.aplication.service.mapper.AccountToNotificationMapper;
import world.inclub.membershippayment.aplication.service.mapper.MembershipToAdminPanelMapper;
import world.inclub.membershippayment.crosscutting.utils.ConstantFields;
import world.inclub.membershippayment.crosscutting.utils.TimeLima;
import world.inclub.membershippayment.infraestructure.apisExternas.account.AccountService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.ObjModel;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.TypeExchangeResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.service.KafkaAdminPanelService;
import world.inclub.membershippayment.infraestructure.apisExternas.collaborator.CollaboratorService;
import world.inclub.membershippayment.infraestructure.apisExternas.commission.CommissionService;
import world.inclub.membershippayment.infraestructure.apisExternas.notification.NotificationService;
import world.inclub.membershippayment.infraestructure.apisExternas.tree.service.TreeService;
import world.inclub.membershippayment.infraestructure.apisExternas.walllet.WalletService;
import world.inclub.membershippayment.infraestructure.apisExternas.tree.dto.Membership;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDTO;
import world.inclub.membershippayment.domain.dto.PaymentDTO;
import world.inclub.membershippayment.domain.dto.PaymentVoucherDTO;
import world.inclub.membershippayment.domain.dto.SuscriptionDTO;
import world.inclub.membershippayment.domain.dto.request.SuscriptionRequest;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;
import world.inclub.membershippayment.domain.dto.response.UserResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDetail;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.domain.entity.User;
import world.inclub.membershippayment.domain.enums.State;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;


@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentTransactionalService {

    private final PaymentVoucherDao paymentVoucherDao;
    private final SuscriptionDao suscriptionDao;
    private final IPaymentDao paymentDao;
    private final AffiliateService affiliateService;
    private final AccountService accountService;
    private final KafkaTemplate<String, Object> kafkaTemplateGeneral;
    private final NotificationService notificationService;
    private final WalletService walletService;
    private final CommissionService commissionService;
    private final TreeService treeService;
    private final KafkaAdminPanelService kafkaAdminPanelService;
    private final ReactiveTransactionManager transactionManager;
    private final CollaboratorService collaboratorService;

    public Mono<Tuple2<List<Payment>, PaymentVoucher>> RegisterUserSuscription(UserResponse userResponse,
                                                                               Suscription suscription, SuscriptionRequest suscriptionRequest, ObjModel objModel,
                                                                               List<PaymentVoucher> listVoucher, Integer verifDefecto, Integer stateSuscripcion,
                                                                               TypeExchangeResponse typeExchangeResponse, boolean isBuy,boolean isCollaborator, Integer discountPercent) throws IOException {

        // Crear el TransactionalOperator
        TransactionalOperator transactionalOperator = TransactionalOperator.create(transactionManager);

        try {
            suscriptionRequest.setTotalNumberPaymentPaid(suscriptionRequest.getTotalNumberPaymentPaid() + 1);
            suscription.setStatus(stateSuscripcion);
            suscription.setIdUser(userResponse.getIdUser());
            List<PaymentVoucher> vouchersSaved  = new ArrayList<>();

            List<Payment> paymentsSaved = new ArrayList<>();

            // Obtener el primer detalle del paquete
            PackageDetail packageDetail = objModel.getPackageInfo().getPackageDetail().get(0);

            // Crear un Mono para la suscripción
            Mono<Suscription> suscriptionMono = suscriptionDao.postSuscription(suscription);

            // Retornar un Mono combinado que procesa la suscripción y establece el ID de suscripción en cada PaymentVoucher
            Mono<Tuple2<List<Payment>, PaymentVoucher>> result = suscriptionMono.flatMap(suscription1 -> {

                        Integer suscriptionId = suscription1.getIdSuscription().intValue();

                        // Iterar sobre cada PaymentVoucher y establecer el ID de suscripción
                        for (PaymentVoucher paymentVoucher : listVoucher) {
                            paymentVoucher.setIdSuscription(suscriptionId);
                            paymentVoucher.setCreationDate(TimeLima.getLimaTime());
                            paymentVoucher.setIdPaymentCoinCurrency(1);
                        }

                        return createSchedulePayments(suscriptionRequest.getIsEditedInitial(), suscriptionId,
                                suscriptionRequest.getNumberPaymentInitials(), suscriptionRequest.getListInitialAmounts(),
                                packageDetail, suscriptionRequest.getTotalNumberPaymentPaid(), typeExchangeResponse, suscriptionRequest.getDiscountPercent())
                                .flatMap(payments -> {
                                    Flux<Payment> paymentsFlux = Flux.fromIterable(payments);
                                    Integer positionInitialSchedule = 1;
                                    Mono<List<Payment>> schedule = ChangePaymentsPaidDetails(paymentsFlux, positionInitialSchedule,
                                            verifDefecto, suscriptionRequest.getTotalNumberPaymentPaid(), suscription1.getStatus(),
                                            packageDetail.getVolume()).collectList();

                                    return unifyPaidScheduleSectionWithGeneralSchedule(schedule, payments)
                                            .flatMap( unified -> {
                                                return createMultiplePayments(unified)
                                                        .flatMap(payments1 -> {
                                                            for (PaymentVoucher paymentVoucher : listVoucher) {
                                                                assert payments1.get(0).getIdPayment() != null;
                                                                paymentVoucher.setIdPayment(payments1.get(0).getIdPayment().intValue());
                                                            }

                                                            paymentsSaved.addAll(payments1);

                                                            return Mono.just(Tuples.of(suscription1, payments1));
                                                        });
                                            });


                                });
                    })
                    .flatMap(tuple -> {

                        Suscription suscription1 = tuple.getT1();
                        List<Payment> payments = tuple.getT2();

                        if (suscription1.getStatus() != 4) {
                            return Flux.fromIterable(listVoucher)
                                    .filter(paymentVoucher -> paymentVoucher.getIdSuscription() != 4)
                                    .flatMap(paymentVoucher -> paymentVoucherDao.postPaymentVoucher(paymentVoucher)
                                            .doOnSuccess(vouchersSaved::add))
                                    .collectList()
                                    .flatMap(list -> Mono.just(Tuples.of(payments, list.get(0))));
                        } else {
                            PaymentVoucher paymentVoucher = new PaymentVoucher();
                            paymentVoucher.setIdSuscription(suscription1.getIdSuscription().intValue());
                            return Mono.just(Tuples.of(payments, paymentVoucher));
                        }
                    })
                    .doOnSuccess(tuple -> {

                        Mono<Void> commissionOp = isCollaborator
                                ? Mono.empty()                             // colaborador → sin comisión
                                : commissionService.generateCommission(suscription).then();

                        Mono<Void> kafkaOperations = kafkaAdminPanelService.synchronizeSuscriptionData(suscription)
                                .then(commissionOp)
                                .then(kafkaAdminPanelService.synchronizePaymentVoucherData(vouchersSaved))
                                .then(kafkaAdminPanelService.synchronizePaymentData(paymentsSaved))
                                .then(treeService.synchronizeMembershipDataForRegister(
                                        suscription, paymentsSaved, objModel.getPackageInfo(), isBuy))
                                .doOnSuccess(v -> log.info("Transacción exitosa RegisterUserSuscription"))
                                .then();

                        kafkaOperations.subscribeOn(Schedulers.parallel()).subscribe();
                    });


            // Envolver el flujo dentro de una transacción con TransactionalOperator
            return transactionalOperator.transactional(result);

        } catch (Exception e) {
            log.error("Error processing payment with Voucher", e);
            throw new RuntimeException("Error processing payment with Voucher", e);
        }
    }


    private Mono<List<Payment>> createMultiplePayments(List<Payment> payments) {
        return paymentDao.postPayments(payments);
    }
    // se realizaron cambios aqui
    private Mono<List<Payment>> createSchedulePayments(Boolean isEditedInitial, Integer suscriptionId,
                                                       Integer initialNumbers, List<BigDecimal> listInitialAmounts, PackageDetail packageDetail,
                                                       Integer totalNumberPaymentPaid, TypeExchangeResponse typeExchangeResponse, Integer discountPercent) {
        try {
            List<Payment> payments = new ArrayList<>();

            int numInitial = 1;
            int numQuote = 1;
            int numMes = 0;
            BigDecimal quotefracionInitial;
            Integer positionOnSchedule = 1;

            Integer quotesNumber = packageDetail.getNumberQuotas();
            BigDecimal quoteInitial = packageDetail.getInitialPrice();
            BigDecimal tipoCambio = typeExchangeResponse.getSale();
            BigDecimal quotePrice = packageDetail.getQuotaPrice();
            BigDecimal initialNumbersB = BigDecimal.valueOf(initialNumbers);
            BigDecimal init = BigDecimal.ZERO;

            BigDecimal finalInitialPrice = quoteInitial;
            BigDecimal finalQuotePrice = quotePrice;

            if (discountPercent != null && discountPercent > 0) {
                log.info("Aplicando descuento del {}% a la cuota inicial y a las cuotas regulares.", discountPercent);
                BigDecimal discountDecimal = BigDecimal.valueOf(discountPercent).divide(BigDecimal.valueOf(100));

                BigDecimal initialDiscountAmount = quoteInitial.multiply(discountDecimal).setScale(2, RoundingMode.HALF_UP);
                finalInitialPrice = quoteInitial.subtract(initialDiscountAmount);
                log.info("Monto de descuento inicial: {}. Nueva cuota inicial con descuento: {}", initialDiscountAmount, finalInitialPrice);

                BigDecimal quoteDiscountAmount = quotePrice.multiply(discountDecimal).setScale(2, RoundingMode.HALF_UP);
                finalQuotePrice = quotePrice.subtract(quoteDiscountAmount);
                log.info("Monto de descuento por cuota: {}. Nueva cuota regular con descuento: {}", quoteDiscountAmount, finalQuotePrice);
            }

            // El precio total ahora se basa en los precios con descuento.
            BigDecimal finalTotalPrice = finalInitialPrice.add(finalQuotePrice.multiply(BigDecimal.valueOf(quotesNumber)));

            if (initialNumbers > 1) {
                quotefracionInitial = finalInitialPrice.divide(initialNumbersB, 2, RoundingMode.HALF_UP);
            } else {
                quotefracionInitial = finalInitialPrice;
            }
            for (int i = 0; i < initialNumbers; i++) {
                Payment payment = new Payment();
                if (i == 0) {
                    payment.setNumberQuotePay(totalNumberPaymentPaid);
                    payment.setPts(packageDetail.getVolume());
                } else {
                    payment.setNumberQuotePay(0);
                    payment.setPts(BigDecimal.ZERO);
                }
                if (isEditedInitial && packageDetail.getIsSpecialFractional()) {
                    BigDecimal sumOfInitialAmounts = listInitialAmounts.stream()
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    if (sumOfInitialAmounts.compareTo(finalInitialPrice) != 0) {
                        return Mono.error(
                                new RuntimeException("La suma de los importes iniciales no coincide con la cotización inicial con descuento."));
                    }
                    payment.setQuoteUsd(listInitialAmounts.get(i));
                    BigDecimal suma = BigDecimal.valueOf(1 + (i));
                    BigDecimal multipli = listInitialAmounts.get(i).multiply(suma);
                    BigDecimal divi = multipli.setScale(finalTotalPrice.scale(), RoundingMode.HALF_UP)
                            .divide(finalTotalPrice, RoundingMode.HALF_UP);
                    payment.setPercentage(divi);
                    payment.setAmortizationUsd(listInitialAmounts.get(i));
                    if (i == 0) {
                        payment.setCapitalBalanceUsd(
                                finalTotalPrice.subtract(listInitialAmounts.get(i).multiply(BigDecimal.valueOf(i))));
                    } else {
                        payment.setCapitalBalanceUsd(finalTotalPrice.subtract(init.multiply(BigDecimal.valueOf(i))));
                    }
                    init = listInitialAmounts.get(i);


                } else {
                    payment.setQuoteUsd(quotefracionInitial);
                    BigDecimal suma = BigDecimal.valueOf(1 + (i));
                    BigDecimal multipli = quotefracionInitial.multiply(suma);
                    BigDecimal divi = multipli.setScale(finalTotalPrice.scale(), RoundingMode.HALF_UP)
                            .divide(finalTotalPrice, RoundingMode.HALF_UP);
                    payment.setPercentage(divi);
                    payment.setAmortizationUsd(quotefracionInitial);
                    payment.setCapitalBalanceUsd(
                            finalTotalPrice.subtract(quotefracionInitial.multiply(BigDecimal.valueOf(i))));
                }
                payment.setIdSuscription(suscriptionId);
                payment.setQuoteDescription("Inicial N° : " + numInitial);
                payment.setNextExpirationDate(TimeLima.getLimaTime().plusMonths(numMes));
                payment.setDollarExchange(tipoCambio);
                payment.setIdStatePayment(0);
                payment.setObs("");
                payment.setPayDate(null);
                payment.setIsInitialQuote(1);
                payment.setPositionOnSchedule(positionOnSchedule);

                payments.add(payment);
                numInitial++;
                numMes++;
                positionOnSchedule++;
            }
            BigDecimal balanceUsd = finalTotalPrice.subtract(finalInitialPrice);
            for (int i = 0; i < quotesNumber; i++) {
                Payment payment = new Payment();
                payment.setIdSuscription(suscriptionId);
                payment.setQuoteDescription("Cuota N° : " + numQuote);
                payment.setNextExpirationDate(TimeLima.getLimaTime().plusMonths(numMes));
                payment.setDollarExchange(tipoCambio);
                payment.setQuoteUsd(finalQuotePrice);
                payment.setPercentage((finalQuotePrice.multiply(BigDecimal.valueOf((i + initialNumbers + 2))))
                        .setScale(finalTotalPrice.scale(), RoundingMode.HALF_UP).divide(finalTotalPrice, RoundingMode.HALF_UP));
                payment.setIdStatePayment(0);
                payment.setObs("");
                payment.setPayDate(null);
                payment.setPts(BigDecimal.ZERO);
                payment.setIsInitialQuote(0);
                payment.setPositionOnSchedule(positionOnSchedule);
                payment.setNumberQuotePay(0);
                payment.setAmortizationUsd(finalQuotePrice);
                payment.setCapitalBalanceUsd(balanceUsd.subtract(finalQuotePrice.multiply(BigDecimal.valueOf(i))));

                payments.add(payment);
                numQuote++;
                numMes++;
                positionOnSchedule++;
            }

            return Mono.just(payments);
        } catch (Exception e) {
            log.error("Error creating schedule payments", e);
            throw new RuntimeException("Error creating schedule payments", e);
        }
    }

    public Flux<Payment> ChangePaymentsPaidDetails(Flux<Payment> scheduleSuscription, Integer positionOnSchedulePayment,
            Integer statePayment, Integer totalPaymentsPaid, Integer statusSuscription, BigDecimal volumen) {
        try {

            return getScheduleSection(scheduleSuscription, positionOnSchedulePayment, totalPaymentsPaid)
                    .collectList()
                    .flatMapMany(scheduleSectionPaid -> {
                        if (!scheduleSectionPaid.isEmpty()) {
                            Payment firstPayment = scheduleSectionPaid.get(0);
                            return changePaymentDetailMakingPaid(firstPayment, statePayment, volumen, totalPaymentsPaid)
                                    .flatMapMany(payment -> {
                                        scheduleSectionPaid.set(0, payment);
                                        if (totalPaymentsPaid > 1) {
                                            return changeAdvancePaymentData(scheduleSectionPaid, statePayment, volumen);
                                        }
                                        // Corregido: Devolver un Flux<Payment> en lugar de Flux<List<Payment>>
                                        return Flux.fromIterable(scheduleSectionPaid);
                                    });
                        } else {
                            return Flux.empty();
                        }
                    });
        } catch (Exception e) {
            log.error("Error changing payment details", e);
            throw new RuntimeException("Error changing payment details", e);
        }
    }

    private Flux<Payment> getScheduleSection(Flux<Payment> schedule, int positionOnScheduleStar,
            int totalPaymentsSection) {
        return schedule
                .index() // Indexa los pagos
                .flatMap(indexedPayment -> {
                    long index = indexedPayment.getT1(); // Obtiene el índice
                    Payment payment = indexedPayment.getT2(); // Obtiene el pago
                    return index >= totalPaymentsSection ? Mono.empty() : Mono.just(payment); // Filtra por la posición
                                                                                              // final
                })
                .take(totalPaymentsSection); // Toma los primeros 'totalPaymentsSection' pagos
    }

    private Mono<Payment> changePaymentDetailMakingPaid(Payment payment, Integer state, BigDecimal volumePackage,
            Integer totalQuotesPay) {

        if (payment != null) {
            payment.setIdStatePayment(state);
            payment.setPayDate(TimeLima.getLimaTime());
            payment.setNumberQuotePay(totalQuotesPay);
            if (state == 1) {
                payment.setPts(volumePackage);
            } else {
                payment.setPts(BigDecimal.ZERO);
            }
            return Mono.just(payment);
        } else {
            return Mono.empty();
        }
    }

    public Flux<Payment> changeAdvancePaymentData(List<Payment> paymentsPaid, Integer state, BigDecimal volumePackage) {

        BigDecimal ptosPackage = BigDecimal.ZERO;
        // El detalle de la observación sale del detalle de la cuota maestra de pago que
        // es el primer registro
        String obsQuotes = String.format("Pagado en %s", paymentsPaid.get(0).getQuoteDescription());
        if (state == 1) {
            ptosPackage = volumePackage;
        }

        // Modificamos los campos que son parte del detalle (pos inicial + 1 en
        // adelante)
        for (int i = 1; i < paymentsPaid.size(); i++) {
            Payment payment = paymentsPaid.get(i);
            payment.setObs(obsQuotes);
            payment.setPts(ptosPackage);
            payment.setPayDate(TimeLima.getLimaTime());
            payment.setIdStatePayment(state);
            payment.setNumberQuotePay(0); // Ya que está siendo pagada en una cuota distinta
        }

        return Flux.fromIterable(paymentsPaid);
    }

    public Mono<List<Payment>> unifyPaidScheduleSectionWithGeneralSchedule(Mono<List<Payment>> sectionPaidSchedule,
            List<Payment> generalSchedule) {
        return sectionPaidSchedule.flatMap(paidSchedule -> {
            for (Payment paidPayment : paidSchedule) {
                int indexPayment = -1;
                for (int i = 0; i < generalSchedule.size(); i++) {
                    if (Objects.equals(generalSchedule.get(i).getPositionOnSchedule(),
                            paidPayment.getPositionOnSchedule())) {
                        indexPayment = i;
                        break;
                    }
                }
                if (indexPayment != -1) {
                    generalSchedule.set(indexPayment, paidPayment);
                }
            }
            return Mono.just(generalSchedule);
        });
    }
    /*TransactionalOperator transactionalOperator = TransactionalOperator.create(transactionManager);

        return suscription.flatMap(s -> {
        return transactionalOperator.transactional(*/
    @Transactional
    public Mono<Boolean> transaccionales(SuscriptionRequest suscriptionRequest, Suscription suscription,
            List<PaymentVoucher> listVoucher, State stateSuscripcion, State stateUser, State verifDefecto,
            ObjModel objModel, TypeExchangeResponse typeExchangeResponse, boolean isCollaborator) {
        // transacciones

        // if si resulto exitoso enviar por correo al sponsor con datos del usuario
        // registrado y del package que compro
        // ---SendEmailAlertSponsord---

        // --realizamos el registro de todas las tablas involucradas

        // traer userSponsor
        User user = suscriptionRequest.getUser(); // traer usuarioRegistrado
        user.setIdState(stateUser.getValue());
        boolean isBuy = false;
        Integer nroCuotasAdelantadas = suscriptionRequest.getTotalNumberPaymentPaid();

        PackageDTO packageDTO = objModel.getPackageInfo();

        // Paralelizar getUserSponsor y registerUser
        return Mono.zip(
                accountService.getUserSponsor(suscriptionRequest.getIdSponsor()),
                registerUser(suscriptionRequest))
                .flatMap(tuple -> {
                    SponsordResponse userSponsor = tuple.getT1();
                    UserResponse userResponse = tuple.getT2();

                    try {
                        return registerUserSubscription(userResponse, suscriptionRequest, suscription, objModel,
                                listVoucher, verifDefecto.getValue(), stateSuscripcion.getValue(), typeExchangeResponse,
                                isBuy,isCollaborator)
                                .flatMap(tuple2 -> {
                                    List<Payment> payments = tuple2.getT1();
                                    PaymentVoucher paymentVoucher = tuple2.getT2();

                                    // Ejecutar tareas en paralelo para no bloquear la respuesta principal
                                    Mono.fromRunnable(() -> {
                                        log.info("Transacción exitosa transaccionales Parte Asing");
                                        affiliateService.registerAffiliate(userResponse, userSponsor,
                                                stateUser, packageDTO, suscription,nroCuotasAdelantadas).subscribe();
                                        walletService.createWallet(userResponse.getIdUser()).subscribe();
                                        notificationService.sendEmailAlertSponsor(userResponse, userSponsor, packageDTO)
                                                .subscribe();
                                        processUserState(stateUser, userResponse, suscriptionRequest,
                                                paymentVoucher, userSponsor, packageDTO, payments).subscribe();
                                    }).subscribeOn(Schedulers.parallel()).subscribe();
                                    log.info("Transacción exitosa transaccionales");

                                    return Mono.just(true);

                                });
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })

                .onErrorResume(e -> {
                    log.error("Error processing transaction", e);
                    return Mono.error(new RuntimeException("Error processing transaction: " + e.getMessage(), e));
                });
    }

    public Mono<UserResponse> registerUser(SuscriptionRequest suscriptionRequest) {

        return accountService.postRegisterUser(suscriptionRequest)
                .map(userAccount -> AccountToNotificationMapper.mapToUserResponse(userAccount));
    }

    private Mono<Tuple2<List<Payment>, PaymentVoucher>> registerUserSubscription(UserResponse userResponse,
            SuscriptionRequest suscriptionRequest, Suscription suscription, ObjModel objModel,
            List<PaymentVoucher> listVoucher, Integer verifDefecto, Integer stateSuscripcion,
            TypeExchangeResponse typeExchangeResponse, boolean isBuy, boolean isCollaborator) throws IOException {
        try {
            return RegisterUserSuscription(userResponse, suscription, suscriptionRequest, objModel, listVoucher,
                    verifDefecto, stateSuscripcion, typeExchangeResponse, isBuy,isCollaborator, null);
        } catch (IOException e) {
            return Mono.error(new RuntimeException("Registry Error" + e));
        }
    }

    private Mono<Boolean> processUserState(State stateUser, UserResponse userResponse,
            SuscriptionRequest suscriptionRequest, PaymentVoucher paymentVoucher,
            SponsordResponse userSponsordResponseDTO, PackageDTO packageDTO, List<Payment> payments) {
        if (stateUser == State.ACTIVO) {
            return notificationService.sendEmailCredencialesUser(userResponse, suscriptionRequest, paymentVoucher,
                    userSponsordResponseDTO, packageDTO);
        } else if (stateUser == State.PENDIENTE_VALIDACION_INICIAL) {
            return notificationService.sendEmailQuotePayedVoucher(userResponse, suscriptionRequest.getAmountPaid(),
                    userSponsordResponseDTO, packageDTO, paymentVoucher);
        } else if (stateUser == State.PAGAR_DESPUES) {

            return notificationService.sendEmailPayLater(userResponse, suscriptionRequest, paymentVoucher,
                    userSponsordResponseDTO, packageDTO, payments);
        } else {
            return Mono.just(true); // or handle other states as needed
        }
    }

}
