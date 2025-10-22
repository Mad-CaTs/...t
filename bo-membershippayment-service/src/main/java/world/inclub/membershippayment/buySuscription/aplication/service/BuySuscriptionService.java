package world.inclub.membershippayment.buySuscription.aplication.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.impl.IPaymentDao;
import world.inclub.membershippayment.aplication.service.PaymentTransactionalService;
import world.inclub.membershippayment.aplication.service.PaymentVoucherService;
import world.inclub.membershippayment.crosscutting.exception.common.ResourceNotFoundException;
import world.inclub.membershippayment.crosscutting.utils.TimeLima;
import world.inclub.membershippayment.domain.dto.request.UserDTO;
import world.inclub.membershippayment.domain.dto.request.ValidateCouponRequest;
import world.inclub.membershippayment.domain.dto.response.ValidateCouponResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.account.AccountService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.AdminPanelService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.ObjModel;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.TypeExchangeResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.collaborator.CollaboratorService;
import world.inclub.membershippayment.infraestructure.apisExternas.notification.NotificationService;
import world.inclub.membershippayment.domain.dto.request.CMeansPayment;
import world.inclub.membershippayment.domain.dto.request.SuscriptionRequest;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;
import world.inclub.membershippayment.domain.dto.response.UserResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDetail;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.domain.entity.User;
import world.inclub.membershippayment.domain.enums.CodigoTypeWalletTransaction;
import world.inclub.membershippayment.domain.enums.State;
import world.inclub.membershippayment.domain.enums.TypeMethodPayment;
import java.util.Optional;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BuySuscriptionService {

    private final PaymentVoucherService paymentVoucherService;
    private final PaymentTransactionalService paymentTransactionalService;
    private final NotificationService notificationService;
    private final AccountService accountService;
    private final AdminPanelService adminPanelService;
    private final CollaboratorService collaboratorService;
    private final IPaymentDao paymentDao;

    public Mono<Boolean> buySuscription(CMeansPayment meansPayment) {


        List<PaymentVoucher> listVouchers = new ArrayList<>();

        return Mono.zip(
                adminPanelService.getPackData(meansPayment.getIdPackage(), null),
                accountService.getUserSponsor(meansPayment.getIdUserPayment()),
                adminPanelService.getTypeExchange()
        ).flatMap(tuple -> {
            ObjModel objModel = tuple.getT1();
            SponsordResponse buyerUser = tuple.getT2();
            TypeExchangeResponse typeExchangeResponse = tuple.getT3();

            TypeMethodPayment typeMethodPayment = TypeMethodPayment.fromValue(meansPayment.getTypeMethodPayment());
            CodigoTypeWalletTransaction typeWalletTransaction = CodigoTypeWalletTransaction.COMPRA_SUSCRIPCION_EXTRA;

            // Elegimos el metodo de pago
            switch (typeMethodPayment) {

                case PAYPAL:
                    return adminPanelService.getPaymentSubType(9)
                            .flatMap(paymentSubType1 -> {
                                return paymentVoucherService.MakePaymentPaypal(meansPayment.getAmountPaidPayment(), meansPayment.getPaypalDTO().getNroOperation(), paymentSubType1)
                                        .doOnNext(listVouchers::add)
                                        .then(registerUserSubscription(meansPayment, listVouchers, buyerUser, objModel, State.ACTIVO.getValue(),
                                                typeExchangeResponse, State.ACTIVO.getValue(), meansPayment.getDiscountPercent()))
                                        .thenReturn(true);
                    });

                case VOUCHERS, OTROS:

                    return paymentVoucherService.MakePaymentVouchers(meansPayment.getListaVouches(), typeExchangeResponse)
                            .flatMap(paymentVoucher -> {
                                listVouchers.addAll(paymentVoucher);
                                return registerUserSubscription(meansPayment, listVouchers, buyerUser, objModel, State.PENDIENTE_VALIDACION_INICIAL.getValue(),
                                        typeExchangeResponse, State.PENDIENTE_VALIDACION_INICIAL.getValue(), meansPayment.getDiscountPercent())
                                        .thenReturn(true);

                    });
                case WALLET:

                    return paymentVoucherService.checkCorrectPaymentAmountPurchaseSubscription(objModel.getPackageInfo().getPackageDetail().get(0), meansPayment.getAmountPaidPayment())
                            .flatMap(aBoolean -> {
                                if (aBoolean) {

                                    User user = new User();
                                    user.setIdUser(buyerUser.getId());
                                    user.setName(buyerUser.getName());
                                    user.setLastName(buyerUser.getLastName());

                                    return paymentVoucherService.MakeWalletFullPayment(buyerUser, meansPayment.getWalletTransaction(), typeWalletTransaction.getCode(), objModel, user)
                                            .flatMap(paymentVoucher -> {
                                                listVouchers.add(paymentVoucher);
                                                return registerUserSubscription(meansPayment, listVouchers, buyerUser, objModel,  State.ACTIVO.getValue(),
                                                        typeExchangeResponse,  State.ACTIVO.getValue(), meansPayment.getDiscountPercent())
                                                        .thenReturn(true);
                                            });
                                } else {
                                    return Mono.just(false);
                                }

                    });

                case MIXTO:
                    User user = new User();
                    user.setIdUser(buyerUser.getId());
                    user.setName(buyerUser.getName());
                    user.setLastName(buyerUser.getLastName());

                    return paymentVoucherService.MakeMixedPayment(buyerUser, meansPayment.getWalletTransaction(), typeWalletTransaction.getCode(),
                            objModel, user, meansPayment.getListaVouches(), typeExchangeResponse)
                            .flatMap(paymentVoucher -> {
                                listVouchers.addAll(paymentVoucher);
                                return registerUserSubscription(meansPayment, listVouchers, buyerUser, objModel, State.PENDIENTE_VALIDACION_INICIAL.getValue(),
                                        typeExchangeResponse, State.PENDIENTE_VALIDACION_INICIAL.getValue(), meansPayment.getDiscountPercent())
                                        .thenReturn(true);
                    });
                default:
                    return Mono.error(new ResourceNotFoundException("No existe este método de pago"));

            }

        });
    }


    private Mono<Boolean> handlePostSubscription(CMeansPayment meansPayment, List<PaymentVoucher> listVouchers, UserResponse buyerUser, PackageDetail packageDetail, int suscriptionStatus) {

        State status = State.fromValue(suscriptionStatus);

        return switch (status) {

            case ACTIVO ->
                    adminPanelService.getPackData(meansPayment.getIdPackage(), null)
                            .flatMap(objModel1 -> notificationService.sendEmailSuccesfulPaymentDirectPayment(buyerUser, meansPayment.getAmountPaidPayment(), objModel1.getPackageInfo()));

            case PENDIENTE_VALIDACION_CUOTA ->
                    adminPanelService.getPackData(meansPayment.getIdPackage(), null)
                            .flatMap(objModel1 -> notificationService.sendEmailQuotePayedVoucher(buyerUser, meansPayment.getAmountPaidPayment(), null, objModel1.getPackageInfo(), listVouchers.get(0)));

            default -> Mono.just(false);
        };

    }

    private Mono<PaymentVoucher> registerUserSubscription(CMeansPayment meansPayment, List<PaymentVoucher> listVouchers, SponsordResponse buyerUser, ObjModel objModel, int suscriptionStatus, TypeExchangeResponse typeExchangeResponse, int paymentStatus, Integer discountPercent) {
        boolean isBuy = true;
        Suscription suscription = Suscription.builder()
                .idUser(meansPayment.getIdUserPayment())
                .creationDate(TimeLima.getLimaTime())
                .idPackageDetail(Math.toIntExact(
                        objModel.getPackageInfo().getPackageDetail().get(0).getIdPackageDetail()))
                .isMigrated(0)
                .idPackage(objModel.getPackageInfo().getIdPackage())
                .build();

        SuscriptionRequest suscriptionRequest = SuscriptionRequest.builder()
                .isEditedInitial(meansPayment.getIsEditedInitial())
                .numberPaymentInitials(meansPayment.getNumberPaymentInitials())
                .listInitialAmounts(meansPayment.getListInitialAmounts())
                .listaVouches(listVouchers)
                .totalNumberPaymentPaid(meansPayment.getNumberAdvancePaymentPaid())
                .build();

        UserResponse userResponse = UserResponse.builder()
                .idUser(meansPayment.getIdUserPayment())
                .email(buyerUser.getEmail())
                .lastName(buyerUser.getLastName())
                .name(buyerUser.getName())
                .nroTelf(buyerUser.getTelephone())
                .userName(buyerUser.getUsername())
                .build();

        //validar si es colaborad//
        String dni = Optional.ofNullable(meansPayment.getUser())
                .map(UserDTO::getNroDocument)
                .orElse(null);

        Mono<Boolean> isCollab$ = (dni != null && !dni.isBlank())
                ? collaboratorService.isCollaborator(dni)
                : Mono.just(false);

        return isCollab$.flatMap(isCollaborator -> {
            try {
                return paymentTransactionalService.RegisterUserSuscription(userResponse, suscription, suscriptionRequest, objModel, listVouchers, Integer.valueOf(paymentStatus), Integer.valueOf(suscriptionStatus), typeExchangeResponse, isBuy, isCollaborator, discountPercent
                ).flatMap(tuples -> {
                    PaymentVoucher paymentVoucher = tuples.getT2();
                    return handlePostSubscription(
                            meansPayment,
                            listVouchers,
                            userResponse,
                            objModel.getPackageInfo().getPackageDetail().get(0),
                            suscriptionStatus
                    ).thenReturn(paymentVoucher);
                });
            } catch (IOException e) {
                return Mono.error(new RuntimeException(e));
            }
        });
    }
    public Mono<ValidateCouponResponse> validateCoupon(ValidateCouponRequest request) {
        return adminPanelService.validateCoupon(request);
    }
}