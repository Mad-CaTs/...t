package world.inclub.membershippayment.aplication.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import world.inclub.membershippayment.crosscutting.exception.common.ResourceNotFoundException;
import world.inclub.membershippayment.domain.dto.response.SuscriptionAndDaysDTO;
import world.inclub.membershippayment.infraestructure.apisExternas.account.AccountService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.ObjModel;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.TypeExchangeResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import world.inclub.membershippayment.domain.dto.request.SuscriptionRequest;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.domain.enums.CodigoTypeWalletTransaction;
import world.inclub.membershippayment.domain.enums.State;
import world.inclub.membershippayment.domain.enums.TypeMethodPayment;
import world.inclub.membershippayment.infraestructure.apisExternas.walllet.WalletService;
import world.inclub.membershippayment.infraestructure.config.kafka.dtos.response.WalletResponseDto;
import world.inclub.membershippayment.infraestructure.repository.PaymentRepository;
import world.inclub.membershippayment.infraestructure.repository.SubscriptionDelayRepository;
import world.inclub.membershippayment.payPayment.aplication.service.PayPaymentService;


@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentVoucherService paymentVoucherService;
    private final WalletService walletService;
    private final PaymentTransactionalService paymentTransactionalService;
    private final AccountService accountService;
    private final PayPaymentService payPaymentService;
    private final SubscriptionDelayRepository subscriptionDelayRepository;
    private final PaymentRepository paymentRepository;

    State stateSuscripcion = State.ACTIVO;
    State stateUser = State.ACTIVO;
    State verifDefecto = State.ACTIVO;
    boolean isPackageBonus;
    List<PaymentVoucher> listVoucher = new ArrayList<>();

    public Mono<Boolean> processPayment(SuscriptionRequest suscriptionRequest, Suscription suscription, ObjModel objModel, TypeExchangeResponse typeExchangeResponse, boolean isCollaborator) {
        if (suscriptionRequest.getIsPayLater()) {
            return processPayLater(suscriptionRequest, suscription, objModel, typeExchangeResponse, isCollaborator);
        } else {
            return processImmediatePayment(suscriptionRequest, suscription, objModel, typeExchangeResponse, isCollaborator)
                    .onErrorResume(e -> {
                        log.error("Error processing payment.", e);
                        return Mono.error(new RuntimeException("Error processing payment: " + e.getMessage(), e));
                    });
        }
    }

    private Mono<Boolean> processPayLater(SuscriptionRequest suscriptionRequest, Suscription suscription, ObjModel objModel, TypeExchangeResponse typeExchangeResponse, boolean isCollaborator) {
       
            //enviar un correo
            stateSuscripcion = State.PAGAR_DESPUES;
            stateUser = State.PAGAR_DESPUES;
            verifDefecto = State.PAGAR_DESPUES;
            return paymentTransactionalService.transaccionales(suscriptionRequest, suscription, listVoucher, stateSuscripcion, stateUser, verifDefecto, objModel, typeExchangeResponse, isCollaborator);
        
    }

    private Mono<Boolean> processImmediatePayment(SuscriptionRequest suscriptionRequest, Suscription suscription, ObjModel objModel, TypeExchangeResponse typeExchangeResponse, boolean isCollaborator) {
        listVoucher.clear();
        
        TypeMethodPayment typeMethodPayment = TypeMethodPayment.fromValue(suscriptionRequest.getTypeMethodPayment());
        return switch (typeMethodPayment) {

            //Paypal
            case PAYPAL -> {
                log.info("pago con paypal");
                stateSuscripcion = State.ACTIVO;
                stateUser = State.ACTIVO;
                verifDefecto = State.ACTIVO;
                isPackageBonus = false; // falta extraer de la tabla familiPackage
                yield paymentVoucherService.MakePaymentPaypal(suscriptionRequest.getAmountPaid(), suscriptionRequest.getOperationNumber(), objModel.getPaymentSubType())
                        .doOnNext(paymentVoucher -> listVoucher.add(paymentVoucher))
                        .publishOn(Schedulers.parallel())
                        .flatMap(paymentVoucher -> {
                            if (listVoucher.get(0) == null) {
                                return Mono.error(new ResourceNotFoundException("Invalid payment method"));

                            } else {
                                return paymentTransactionalService.transaccionales(suscriptionRequest, suscription, listVoucher, stateSuscripcion, stateUser, verifDefecto, objModel, typeExchangeResponse, isCollaborator);
                            }
                        });
            }

            //Vouchers
            case VOUCHERS -> {

                log.info("pago con Vouchers");
                stateSuscripcion = State.PENDIENTE_VALIDACION_INICIAL;
                stateUser = State.PENDIENTE_VALIDACION_INICIAL;
                verifDefecto = State.PENDIENTE_VALIDACION_INICIAL;

                log.info(stateSuscripcion.getValue() + " " + stateUser.getValue() + " " + verifDefecto.getValue());
                isPackageBonus = false; // falta extraer de la tabla familiPackage
                suscription.setStatus(stateSuscripcion.getValue());
                yield paymentVoucherService.MakePaymentVouchers(suscriptionRequest.getListaVouches(), typeExchangeResponse)
                        .doOnNext(paymentVoucher -> listVoucher = paymentVoucher)
                        .publishOn(Schedulers.parallel())
                        .flatMap(paymentVoucher -> {
                            if (listVoucher.get(0) == null) {
                                return Mono.error(new ResourceNotFoundException("Invalid payment method"));

                            } else {
                                log.info(stateSuscripcion.getValue() + " " + stateUser.getValue() + " " + verifDefecto.getValue());
                                return paymentTransactionalService.transaccionales(suscriptionRequest, suscription, listVoucher, stateSuscripcion, stateUser, verifDefecto, objModel, typeExchangeResponse, isCollaborator);
                            }
                        });
            }

            //Wallet
            case WALLET -> {
                // verificar que el rango sea mayor a 2


                yield Mono.zip(
                        walletService.getWallet(suscriptionRequest.getIdSponsor()),
                        accountService.getUserSponsor(suscriptionRequest.getIdSponsor())
                ).flatMap(response -> {
                    WalletResponseDto walletResponseDto = (WalletResponseDto) response.getT1();
                    SponsordResponse userSponsordResponseDTO = response.getT2();

                    stateSuscripcion = State.ACTIVO;

                    suscriptionRequest.getWalletTransaction().setIdWallet(walletResponseDto.getIdWallet());
                    return paymentVoucherService.MakeWalletFullPayment(userSponsordResponseDTO, suscriptionRequest.getWalletTransaction(), CodigoTypeWalletTransaction.REGISTRO_SOCIO.getCode(), objModel, suscriptionRequest.getUser())
                            .flatMap(paymentVoucher -> {
                                stateUser = State.ACTIVO;
                                verifDefecto = State.ACTIVO;
                                if (paymentVoucher == null) {
                                    return Mono.error(new ResourceNotFoundException("Invalid payment method"));
                                } else {
                                    listVoucher.add(paymentVoucher);
                                    return paymentTransactionalService.transaccionales(suscriptionRequest, suscription, listVoucher, stateSuscripcion, stateUser, verifDefecto, objModel, typeExchangeResponse,isCollaborator);
                                }
                            });
                });
            }

            //Mixtos
            case MIXTO -> {

                log.info("pago con Mixtos " );

                yield Mono.zip(
                        walletService.getWallet(suscriptionRequest.getIdSponsor()),
                    accountService.getUserSponsor(suscriptionRequest.getIdSponsor())
                               
                ).flatMap(response -> {
                    WalletResponseDto walletResponseDto = (WalletResponseDto) response.getT1();
                    SponsordResponse userSponsordResponseDTO = response.getT2();

                    stateSuscripcion = State.PENDIENTE_VALIDACION_INICIAL;

                    suscriptionRequest.getWalletTransaction().setIdWallet(walletResponseDto.getIdWallet());

                    return paymentVoucherService.MakeMixedPayment(userSponsordResponseDTO, suscriptionRequest.getWalletTransaction(), CodigoTypeWalletTransaction.REGISTRO_SOCIO.getCode(), objModel, suscriptionRequest.getUser(), suscriptionRequest.getListaVouches(), typeExchangeResponse)
                            .flatMap(paymentVoucher -> {
                                stateUser = State.PENDIENTE_VALIDACION_INICIAL;
                                verifDefecto = State.PENDIENTE_VALIDACION_INICIAL;
                                if (paymentVoucher == null) {
                                    return Mono.error(new ResourceNotFoundException("Invalid payment method"));
                                } else {
                                    listVoucher = paymentVoucher;
                                    return paymentTransactionalService.transaccionales(suscriptionRequest, suscription, listVoucher, stateSuscripcion, stateUser, verifDefecto, objModel, typeExchangeResponse, isCollaborator);
                                }
                            });


                });
            }
            //Otros
            case OTROS -> {
                log.info("pago con otros Vouchers");
                stateSuscripcion = State.PENDIENTE_VALIDACION_INICIAL;
                stateUser = State.PENDIENTE_VALIDACION_INICIAL;
                verifDefecto = State.PENDIENTE_VALIDACION_INICIAL;
                suscription.setStatus(stateSuscripcion.getValue());
                yield paymentVoucherService.savePaymentVouchers(suscriptionRequest.getListaVouches(), typeExchangeResponse)
                        .doOnNext(paymentVoucher -> listVoucher = paymentVoucher)
                        .publishOn(Schedulers.parallel())
                        .flatMap(paymentVoucher -> {
                            if (listVoucher.get(0) == null) {
                                return Mono.error(new ResourceNotFoundException("Invalid payment method"));

                            } else {
                                return paymentTransactionalService.transaccionales(suscriptionRequest, suscription, listVoucher, stateSuscripcion, stateUser, verifDefecto, objModel, typeExchangeResponse, isCollaborator);
                            }
                        });
            }
            default -> Mono.error(new RuntimeException("Invalid payment method"));
    
        };


    }


    public Mono<SuscriptionAndDaysDTO> getDaysForNextExpiration(Integer idSuscription){
        return payPaymentService.findFirstUnpaidByIdSuscriptionAndIdStatePayment(idSuscription)
                .flatMap(payment -> {

                    ZoneId limaZone = ZoneId.of("America/Lima");
                    LocalDateTime actualDate = LocalDateTime.now(limaZone);  // Fecha y hora actual en Lima, Perú

                    // Realiza las operaciones que necesites con el objeto `payment`

                    // Ejemplo: Si payment es nulo o no tiene algún campo específico, devolver falso
                    if (payment == null) {
                        return Mono.just(new SuscriptionAndDaysDTO(idSuscription, -999999, actualDate.toLocalDate(), null, -999999, null));  // -99999 cuando no tiene expiración
                    }
                    if (payment.getNextExpirationDate()==null) {
                        return Mono.just(new SuscriptionAndDaysDTO(idSuscription, -999999, actualDate.toLocalDate(), null, -999999, null));  // -99999 cuando no tiene expiración
                    }

                    LocalDateTime nextExpirationDate = payment.getNextExpirationDate();

                    // Calcular la diferencia en días entre nextExpirationDate y actualDate
                    long diferenciaEnDias = ChronoUnit.DAYS.between(actualDate.toLocalDate(), nextExpirationDate.toLocalDate());

                    return subscriptionDelayRepository.findDelayDaysByIdSubscription(idSuscription)
                            .flatMap(response -> {
                                int delayDays = response.getDaysToAnnualLiquidation() != null ? response.getDaysToAnnualLiquidation() : 0;
                                LocalDate liquidationDate = null;
                                int subscriptionStatus = response.getStatus() != null ? response.getStatus() : 1;

                                // Añadir otros estados que consideres inválidos para evitar enviar notificaciones incorrectas
                                List<Integer> invalidStatus = List.of(
                                        State.PENDIENTE_VALIDACION_INICIAL.getValue(),
                                        State.RECHAZO_INICIAL.getValue(),
                                        State.PAGAR_DESPUES.getValue(),
                                        State.CONGELADO.getValue(),
                                        State.PENDIENTE_VALIDACION_CUOTA.getValue(),
                                        State.RECHAZO_CUOTA.getValue(),
                                        State.PENDIENTE_VALIDACION_MIGRACION.getValue(),
                                        State.RECHAZO_MIGRACION.getValue(),
                                        State.PENDIENTE_VALIDACION_CUOTA_ADELANTADA.getValue(),
                                        State.SUSCRIPCION_FINALIZADA.getValue(),
                                        State.SUSCRIPCION_FINALIZADA_1.getValue(),
                                        State.SUSCRIPCION_FINALIZADA_2.getValue(),
                                        State.SUSCRIPCION_FINALIZADA_3.getValue(),
                                        State.SUSCRIPCION_FINALIZADA_4.getValue(),
                                        State.SUSCRIPCION_FINALIZADA_5.getValue(),
                                        State.SUSCRIPCION_FINALIZADA_6.getValue(),
                                        State.LIQUIDACION.getValue());

                                // Solo acumular días si el estado de la suscripción no está en la lista de estados inválidos
                                if (!invalidStatus.contains(subscriptionStatus) && diferenciaEnDias < 0) {
                                    delayDays += Math.abs((int) diferenciaEnDias);
                                }

                                // Si ya alcanzó 365, mostrar la fecha de liquidación solo si se le aplico la liquidación anual a su membresía
                                if (delayDays >= 365 && response.getLiquidationDate() != null) {
                                    liquidationDate = response.getLiquidationDate().toLocalDate();
                                }

                                return Mono.just(SuscriptionAndDaysDTO.builder()
                                        .idSuscription(idSuscription)
                                        .daysNextExpiration((int) diferenciaEnDias)
                                        .dateNotification(actualDate.toLocalDate())
                                        .dateExpiration(nextExpirationDate.toLocalDate())
                                        .daysToAnnualLiquidation(delayDays)
                                        .liquidationDate(liquidationDate)
                                        .build());
                            });
                });
    }

    public Mono<Integer> getTotalPayments(Integer idSuscription, Integer idstatepayment) {
        return paymentRepository.getTotalPayments(idSuscription, idstatepayment);
    }
}
