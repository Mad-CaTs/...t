package world.inclub.membershippayment.payPayment.aplication.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.PaymentDao;
import world.inclub.membershippayment.aplication.dao.PaymentVoucherDao;
import world.inclub.membershippayment.aplication.dao.SuscriptionDao;
import world.inclub.membershippayment.aplication.dao.TokenPaymentDao;
import world.inclub.membershippayment.aplication.service.mapper.MembershipMapper;
import world.inclub.membershippayment.aplication.service.mapper.MembershipToAdminPanelMapper;
import world.inclub.membershippayment.crosscutting.exception.common.ResourceNotFoundException;
import world.inclub.membershippayment.crosscutting.exception.core.BusinessLogicException;
import world.inclub.membershippayment.crosscutting.utils.TimeLima;
import world.inclub.membershippayment.domain.dto.TokenPaymentResponseDTO;
import world.inclub.membershippayment.domain.dto.response.*;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.domain.enums.ArraysData;
import world.inclub.membershippayment.domain.enums.FlagEnabled;
import world.inclub.membershippayment.domain.enums.State;
import world.inclub.membershippayment.domain.enums.TypePercentOverdue;
import world.inclub.membershippayment.infraestructure.apisExternas.account.AccountService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.AdminPanelService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDTO;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PercentOverdueDetail;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SuscriptionPaymentService {

    private final SuscriptionDao suscriptionDao;
    private final PaymentDao paymentDao;
    private final PaymentVoucherDao paymentVoucherDao;
    private final TokenPaymentDao tokenPaymentDao;
    private final AdminPanelService adminPanelService;
    private final AccountService accountService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private final LocalDateTime fechaActual = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);

    public Mono<List<SuscriptionPayResponse>> getSuscriptions(Integer userId) {

        return suscriptionDao.getSuscriptionsByUserId(userId).flatMap(suscription -> adminPanelService.getPackageData(suscription.getIdPackage(), suscription.getIdPackageDetail()).map(pack -> MembershipMapper.mapToSuscriptionPayResponse(suscription, pack))).collectList().switchIfEmpty(Mono.error(new ResourceNotFoundException("No se encontraron suscripciones para el usuario"))).flatMap(suscriptions -> {
            List<SuscriptionPayResponse> sortedSuscription = suscriptions.stream().sorted(Comparator.comparing(SuscriptionPayResponse::getId).reversed()).collect(Collectors.toList());
            return Mono.just(sortedSuscription);
        });
    }

    public Mono<List<Suscription>> getSuscriptionsAsc(Integer userId) {

        return suscriptionDao.getSuscriptionsByUserId(userId)
                .collectList()
                .map(suscriptions -> suscriptions.stream()
                        .sorted(Comparator.comparing(Suscription::getIdSuscription))
                        .collect(Collectors.toList())
                );
    }

    public Mono<SuscriptionPayResponse> getSuscriptionDataById(Integer idSuscription) {
        return suscriptionDao.getSuscriptionById(idSuscription.longValue())
                .switchIfEmpty(Mono.error(new ResourceNotFoundException("No se encontró la suscripción con id " + idSuscription)))
                .flatMap(suscription ->
                        adminPanelService.getPackageData(suscription.getIdPackage(), suscription.getIdPackageDetail())
                                .map(packageData -> MembershipMapper.mapToSuscriptionPayResponse(suscription, packageData))
                );
    }

    public Mono<List<Payment>> scheduleCorrection(Integer idSuscription) {
        return paymentDao.getAllPaymentsByIdSubscription(idSuscription)
                .sort(Comparator.comparing(Payment::getPositionOnSchedule))
                .collectList()

                .flatMap(scheduleOld -> {

                    List<Payment> scheduleNew = new ArrayList<>();

                    BigDecimal sumaTotal = scheduleOld.stream()
                            .map(Payment::getQuoteUsd)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal amortizacion = BigDecimal.ZERO;
                    BigDecimal capitalBalance = BigDecimal.ZERO;
                    BigDecimal porcentaje = BigDecimal.ZERO;
                    BigDecimal suma = BigDecimal.ZERO;

                    for (int i = 0; i < scheduleOld.size(); i++) {

                        Payment payment = scheduleOld.get(i);

                        amortizacion = payment.getQuoteUsd();
                        payment.setAmortizationUsd(amortizacion);
                        capitalBalance = sumaTotal.subtract(suma);
                        payment.setCapitalBalanceUsd(capitalBalance);
                        suma = suma.add(amortizacion);

                        porcentaje = suma.divide(sumaTotal, 2, RoundingMode.HALF_UP);
                        payment.setPercentage(porcentaje);
                        scheduleNew.add(payment);

                    }

                    Flux<Payment> paymentFlux = Flux.fromIterable(scheduleNew);

                    //return  Mono.just(scheduleNew);

                    //Filtrar y procesar los pagos
                    return paymentFlux
                            .flatMap(p -> paymentDao.putPayment(p) // Guardar el pago en la base de datos
                                    .flatMap(saved -> {
                                        // Enviar el pago guardado a Kafka
                                        kafkaTemplate.send("topic-payment", MembershipToAdminPanelMapper.mapToPaymentDTO(saved));
                                        return Mono.just(saved); // Devolver el pago guardado
                                    })
                            ).collectList();
                });

    }


    public Mono<SuscriptionDetailResponse> getSuscriptionDetail(Integer idSuscription) {

        Mono<Payment> monoPayStar = paymentDao.getAllPaymentsAndMoraByIdSubscription(idSuscription).filter(payment -> payment.getIdStatePayment() != 1).sort(Comparator.comparing(Payment::getPositionOnSchedule)).next().defaultIfEmpty(new Payment());

        return Mono.zip(monoPayStar, suscriptionDao.getSuscriptionById(Long.valueOf(idSuscription))).flatMap(tuple -> {

            Payment payStar = tuple.getT1();
            Suscription suscription = tuple.getT2();

            return Mono.zip(descriptionResponse(payStar), adminPanelService.getPackageData(suscription.getIdPackage(), suscription.getIdPackageDetail())).flatMap(tuple2 -> {

                SuscriptionDetailResponse response = tuple2.getT1();
                PackageDTO packageDTO = tuple2.getT2();

                response.setSuscriptionName(packageDTO.getName());

                return Mono.just(response);


            });
        });
    }

    private Mono<SuscriptionDetailResponse> descriptionResponse(Payment payment) {

        SuscriptionDetailResponse response = new SuscriptionDetailResponse();
        String description;
        BigDecimal amount;
        LocalDateTime dateTime = null;

        if (payment.getIdPayment() == null) {

            description = "No tiene cuotas a pagar";
            amount = null;
            return Mono.error(new BusinessLogicException("No tiene cuotas a pagar o Una Inicial fue rechazada"));


//        } else if (payment.getNextExpirationDate().toLocalDate().isAfter(TimeLima.getLimaDate().plusDays(1))) {
//
//            description = payment.getQuoteDescription() + " - " + State.getNameByValue(payment.getIdStatePayment());
//            amount =  payment.getQuoteUsd();
//            dateTime = payment.getNextExpirationDate();

        } else {
            if (payment.getTotalOverdue() == null) {
                payment.setTotalOverdue(BigDecimal.ZERO);
            }
            description = payment.getQuoteDescription() + " - " + State.getNameByValue(payment.getIdStatePayment());
            amount = payment.getQuoteUsd().add(payment.getTotalOverdue());
            dateTime = payment.getNextExpirationDate();
        }

        response.setAmount(amount);
        response.setSuscriptionDescription(description);
        response.setNextExpirationDate(dateTime);

        return Mono.just(response);

    }

    public Mono<List<PaymentPayResponseDTO>> getCronogramaPagos(Integer idSuscription) {

        Mono<Map<Integer, Collection<PaymentVoucherResponse>>> vouchersGroupedByPayment = paymentVoucherDao.getPaymentVoucherByIdSuscription(idSuscription).map(MembershipMapper::mapToPaymentVoucherResponse).collectMultimap(PaymentVoucherResponse::getIdPayment);

        return paymentDao.getAllPaymentsAndMoraByIdSubscription(idSuscription).flatMap(payment ->

                        Mono.zip(suscriptionDao.getSuscriptionById(Long.valueOf(payment.getIdSuscription())),
                                        adminPanelService.getPercentdetailActive(TypePercentOverdue.ConCambioFecha.getValue()))
                                .flatMap(tuple2 -> {
                                            Suscription suscription = tuple2.getT1();
                                            PercentOverdueDetail percentOverdueDetail = tuple2.getT2();

                                            return adminPanelService.getPackageData(suscription.getIdPackage(), suscription.getIdPackageDetail())
                                                    .map(pack -> MembershipMapper.mapToPaymentPayResponseDTO(payment, pack, percentOverdueDetail));
                                        }

                                )).flatMap(paymentsSinVouchers -> {

                    if (!paymentsSinVouchers.getIdStatePayment().equals(0)) {
                        Integer idPayment = paymentsSinVouchers.getIdPayment().intValue();
                        // Asignar vouchers correspondientes usando el mapa
                        return vouchersGroupedByPayment.map(voucherMap -> {
                            if (voucherMap.containsKey(idPayment)) {
                                // Convertimos Collection a List antes de asignar
                                List<PaymentVoucherResponse> associatedVouchers = new ArrayList<>(voucherMap.get(idPayment));
                                paymentsSinVouchers.setVouchers(associatedVouchers);
                            } else {
                                // Si no encuentra vouchers, continúa sin modificar el objeto
                                paymentsSinVouchers.setVouchers(Collections.emptyList()); // Asignar lista vacía
                            }
                            return paymentsSinVouchers;
                        });
                    } else {
                        // Retornamos el objeto tal cual si no aplica
                        return Mono.just(paymentsSinVouchers);
                    }
                }).sort(Comparator.comparing(PaymentPayResponseDTO::getPositionOnSchedule)) // Sorting the payments by positionOnSchedule
                .collectList().flatMap(payments -> {
                    if (payments == null || payments.isEmpty()) {
                        return Mono.error(new ResourceNotFoundException("No se encontró la suscripción para el cronograma de pagos"));
                    }
                    // The payments are already sorted, so no need to sort again
                    return Mono.just(payments);
                });
    }

    public Mono<PaymentPayResponseDTO> getPaymentById(Integer idSuscription) {
        return paymentDao.getPaymentById(idSuscription.longValue())
                .flatMap(payment ->
                        suscriptionDao.getSuscriptionById(Long.valueOf(payment.getIdSuscription()))
                                .flatMap(suscription ->
                                        adminPanelService.getPackageData(suscription.getIdPackage(), suscription.getIdPackageDetail())
                                                .flatMap(pack ->
                                                        adminPanelService.getPercentdetailActive(TypePercentOverdue.ConCambioFecha.getValue())
                                                                .map(percentOverdueDetail -> {
                                                                    boolean isPayed = payment.getIdStatePayment() != 0;
                                                                    PaymentPayResponseDTO paymentPayResponseDTO = new PaymentPayResponseDTO();

                                                                    paymentPayResponseDTO.setIdPayment(payment.getIdPayment());
                                                                    paymentPayResponseDTO.setIdSuscription(payment.getIdSuscription());
                                                                    paymentPayResponseDTO.setQuoteDescription(payment.getQuoteDescription());
                                                                    paymentPayResponseDTO.setNextExpirationDate(payment.getNextExpirationDate());
                                                                    paymentPayResponseDTO.setDollarExchange(payment.getDollarExchange());
                                                                    paymentPayResponseDTO.setQuoteUsd(payment.getQuoteUsd());
                                                                    paymentPayResponseDTO.setPercentage(payment.getPercentage());
                                                                    paymentPayResponseDTO.setIdStatePayment(payment.getIdStatePayment());
                                                                    paymentPayResponseDTO.setObs(payment.getObs());
                                                                    paymentPayResponseDTO.setStatusName(State.getNameByValue(payment.getIdStatePayment()));
                                                                    paymentPayResponseDTO.setPayDate(payment.getPayDate());
                                                                    paymentPayResponseDTO.setPts(payment.getPts());
                                                                    paymentPayResponseDTO.setIsInitialQuote(payment.getIsInitialQuote());
                                                                    paymentPayResponseDTO.setPositionOnSchedule(payment.getPositionOnSchedule());
                                                                    paymentPayResponseDTO.setNumberQuotePay(payment.getNumberQuotePay());
                                                                    paymentPayResponseDTO.setAmortizationUsd(payment.getAmortizationUsd());
                                                                    paymentPayResponseDTO.setCapitalBalanceUsd(payment.getCapitalBalanceUsd());
                                                                    paymentPayResponseDTO.setTotalOverdue(payment.getTotalOverdue());
                                                                    paymentPayResponseDTO.setIdPercentOverduedetail(payment.getIdPercentOverduedetail());
                                                                    paymentPayResponseDTO.setIdPackage(pack.getIdPackage());
                                                                    paymentPayResponseDTO.setNameSuscription(pack.getName());

                                                                    BigDecimal total = payment.getQuoteUsd();
                                                                    paymentPayResponseDTO.setPayed(isPayed);

                                                                    if (payment.getNextExpirationDate().isAfter(TimeLima.getLimaDate().atStartOfDay())) {
                                                                        paymentPayResponseDTO.setDaysOverdue(0);
                                                                        paymentPayResponseDTO.setTotalOverdue(BigDecimal.ZERO);
                                                                    } else if (payment.getTotalOverdue() != null && payment.getTotalOverdue().compareTo(BigDecimal.ZERO) > 0) {
                                                                        total = payment.getQuoteUsd().add(payment.getTotalOverdue());
                                                                        BigDecimal cien = BigDecimal.valueOf(100L);
                                                                        BigDecimal asd = payment.getQuoteUsd()
                                                                                .multiply(percentOverdueDetail.getPercentOverdue())
                                                                                .setScale(2, RoundingMode.HALF_UP);
                                                                        BigDecimal totalDaysDecimal = payment.getTotalOverdue()
                                                                                .divide(asd, 2, RoundingMode.HALF_UP)
                                                                                .multiply(cien)
                                                                                .setScale(0, RoundingMode.HALF_UP);
                                                                        Integer totalDays = totalDaysDecimal.intValue();
                                                                        paymentPayResponseDTO.setDaysOverdue(totalDays);
                                                                    } else {
                                                                        paymentPayResponseDTO.setDaysOverdue(0);
                                                                    }
                                                                    paymentPayResponseDTO.setTotal(total);
                                                                    return paymentPayResponseDTO;
                                                                })
                                                )
                                )
                )
                .doOnSuccess(cronograma -> log.info("Successfully payments encontrado: " + cronograma.getIdPayment()))
                .flatMap(payments -> {
                    if (payments == null) {
                        return Mono.error(new ResourceNotFoundException("No se encontró el payment"));
                    }
                    return Mono.just(payments);
                });
    }

    public Mono<RegisterResponseDTO> validateTokenPayLater(String codTokenPay) {
        log.info("validateTokenPayLater");

        return ValidateTokenPayment(codTokenPay).flatMap(tokenPay -> {
            return paymentDao.getAllPaymentsByIdSubscription(tokenPay.getIdSuscription()).collectList().flatMap(payments -> {
                //if (hasPaymentWithState(payments, 1)) {
                if (Boolean.FALSE) {
                    return Mono.error(new RuntimeException("Error: Hay un pago con statePaymentId igual a 1"));
                } else {
                    return buildRegisterResponseDTO(payments, tokenPay);
                }
            });
        }).switchIfEmpty(Mono.error(new ResourceNotFoundException("The token is not valid or does not exist"))).onErrorResume(e -> {
            return Mono.error(new ResourceNotFoundException(e.getMessage()));
        });
    }

    private boolean hasPaymentWithState(List<Payment> payments, int state) {
        return payments.stream().anyMatch(payment -> payment.getIdStatePayment() == state);
    }

    private Mono<RegisterResponseDTO> buildRegisterResponseDTO(List<Payment> payments, TokenPaymentResponseDTO tokenPay) {
        RegisterResponseDTO registerResponseDTO = new RegisterResponseDTO();

        BigDecimal totalQuoteUsd = payments.stream().filter(payment -> payment.getIdStatePayment() != 0 && payment.getIdStatePayment() != 1) // Aplica el filtro
                .map(Payment::getQuoteUsd) // Mapea al campo quoteUsd
                .reduce(BigDecimal.ZERO, BigDecimal::add); // Suma todos los valores de quoteUsd


        List<Payment> quoteInitialList = payments.stream().filter(payment -> payment.getIsInitialQuote() == 1).collect(Collectors.toList());
        /*
        // state 1 =pagado cambiar por enum
        Payment quoteInitial;
        if (quoteInitialList.isEmpty()) {
            return Mono.error(new RuntimeException("No hay cuotas iniciales"));
        } else {
            quoteInitial = quoteInitialList.get(0);
        }*/

        int numberInitial = quoteInitialList.size();
        if (numberInitial > 1) {
            registerResponseDTO.setIsQuotaInitialSplitting(FlagEnabled.ACTIVE);
        } else {
            registerResponseDTO.setIsQuotaInitialSplitting(FlagEnabled.INACTIVE);
        }
        registerResponseDTO.setNumberQuotesInitial(numberInitial);
        registerResponseDTO.setTotalAmount(totalQuoteUsd);
        registerResponseDTO.setIdPayment(tokenPay.getIdPayment());
        registerResponseDTO.setIdSuscriptionPay(tokenPay.getIdSuscription());
        registerResponseDTO.setIdUserPay(tokenPay.getIdUser());
        registerResponseDTO.setIsPayLatter(tokenPay.isPayLatter());
        return accountService.getUserSponsor(tokenPay.getIdUser()).flatMap(sponsordResponse -> {
            registerResponseDTO.setIdResidenceCountry(sponsordResponse.getIdResidenceCountry());
            return Mono.just(registerResponseDTO);
        });
    }

    public Mono<TokenPaymentResponseDTO> ValidateTokenPayment(String codTokenPay) {
        return tokenPaymentDao.getByCodTokenPayment(codTokenPay).flatMap(token1 -> {

            List<State> statesPaymentMade = Arrays.asList(ArraysData.StatesPaymentMade);
            if (token1 != null) {
                if (token1.getEndDate().isBefore(TimeLima.getLimaTime())) {
                    return Mono.error(new BusinessLogicException("The token has expired"));
                } else {
                    return paymentDao.getPaymentById(Long.valueOf(token1.getIdPayment())).flatMap(payment -> {
                        log.info("payment state : " + payment.getIdStatePayment());
                        if (statesPaymentMade.contains(State.values()[payment.getIdStatePayment()])) {
                            return Mono.error(new BusinessLogicException("The payment has already been made"));
                        } else {
                            return suscriptionDao.getSuscriptionById(Long.valueOf(token1.getIdSuscription()))

                                    .flatMap(suscription -> {

                                        return accountService.getUserAccountById(suscription.getIdUser()).flatMap(user -> {

                                            int userStatus = user.getIdState().intValue();
                                            boolean isPayLatter = userStatus == State.PAGAR_DESPUES.getValue();

                                            TokenPaymentResponseDTO tokenPaymentResponseDTO = new TokenPaymentResponseDTO();

                                            tokenPaymentResponseDTO.setIdSuscription(suscription.getIdSuscription().intValue());
                                            tokenPaymentResponseDTO.setIdPayment(payment.getIdPayment().intValue());
                                            tokenPaymentResponseDTO.setCodTokenPayment(token1.getCodTokenPayment());
                                            tokenPaymentResponseDTO.setStartDate(token1.getStartDate());
                                            tokenPaymentResponseDTO.setEndDate(token1.getEndDate());
                                            tokenPaymentResponseDTO.setIdUser(suscription.getIdUser());
                                            tokenPaymentResponseDTO.setPayLatter(isPayLatter);

                                            return Mono.just(tokenPaymentResponseDTO);
                                        });


                                    });
                        }
                    });
                }
            } else {
                return Mono.error(new RuntimeException("The token is not valid or does not exist"));
            }
        }).switchIfEmpty(Mono.error(new RuntimeException("The token is not valid or does not exist")));
    }

    public Mono<Boolean> checkSuscriptionInitialQuotePayed(Integer suscriptionId) {
        return paymentDao.existsPaymentWithInitialQuotePayed(suscriptionId);
    }

    public Mono<Boolean> hasFirst12QuotePayed(Integer suscriptionId) {
        return paymentDao.hasFirst12PaymentsStateOne(suscriptionId);
    }

    public Flux<Payment> findPaymentsDueToday() {

        ZoneId zonaHoraria = ZoneId.of("America/Lima");
        ZonedDateTime fechaZoned = fechaActual.atZone(zonaHoraria); // Si fechaActual es Instant
        LocalDate fechaLocal = fechaZoned.toLocalDate();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        String fechaInicio = fechaLocal.atStartOfDay().format(formatter); // 00:00:00
        String fechaFinal = fechaLocal.atTime(LocalTime.MAX).format(formatter); // 23:59:59

        log.info("Fecha de inicio: {}, Fecha final: {}", fechaInicio, fechaFinal);
        //Flux<PaymentSuscription> paymentSuscriptions = iPaymentSuscriptionRepository.getAllPaymentSuscriptions(fechaInicio, fechaFinal);
        LocalDateTime finitst = LocalDateTime.parse("2025-08-01", formatter);
        String ffinalst = LocalDateTime.parse(fechaInicio, formatter).toString();
        return paymentDao.getPaymentsDueToday(ffinalst);
    }
}