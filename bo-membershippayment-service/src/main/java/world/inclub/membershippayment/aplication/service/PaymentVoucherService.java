package world.inclub.membershippayment.aplication.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.crosscutting.exception.core.BusinessLogicException;
import world.inclub.membershippayment.crosscutting.utils.TimeLima;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.AdminPanelService;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.ObjModel;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PaymentSubType;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.TypeExchangeResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.documentImage.ExternalAPIClient;
import world.inclub.membershippayment.domain.dto.WalletTransaction;
import world.inclub.membershippayment.domain.dto.response.CalculateResponse;
import world.inclub.membershippayment.domain.dto.response.SponsordResponse;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.PackageDetail;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.domain.entity.User;
import world.inclub.membershippayment.domain.enums.Currency;
import world.inclub.membershippayment.infraestructure.apisExternas.walllet.WalletService;
import world.inclub.membershippayment.infraestructure.config.kafka.dtos.response.RegisterPaymenWithWalletResponseDTO;

import javax.imageio.ImageIO;
import javax.swing.JEditorPane;
import javax.swing.text.html.HTMLEditorKit;

import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentVoucherService {

    private final AdminPanelService adminPanelService;
    private final WalletService walletService;
    private final ExternalAPIClient externalAPIClient;

    // resive usuario y lista de vouchers
    public Mono<List<PaymentVoucher>> MakePaymentVouchers(List<PaymentVoucher> voucherList, TypeExchangeResponse typeExchangeResponse) {
        return savePaymentVouchers(voucherList, typeExchangeResponse);
    }

    public Mono<PaymentVoucher> MakePaymentPaypal(BigDecimal amountPaid, String operationNumber, PaymentSubType paymentSubType) {
        return SaveVoucherPaypal(amountPaid, operationNumber, paymentSubType);

    }

    public Mono<PaymentVoucher> MakeWalletFullPayment(SponsordResponse userResponse, WalletTransaction walletTransaction, Integer codigoTypeWalletTransaction, ObjModel objModel, User user )  {
        boolean ISFULLPAYMENT = true;
        //ProcessPaymentWithWallet
        BigDecimal walletAmmount = walletTransaction.getAmount();
        BigDecimal TotalAmmountPackage = objModel.getPackageInfo().getPackageDetail().get(0).getPrice();
        if (walletAmmount.compareTo(TotalAmmountPackage) > 0) {
            return Mono.error(
                    new RuntimeException("El monto no es suficiente o excediste el monto para realizar el pago completo")
            );
        }

        log.info("Inicio de peticion a Wallet");
        return walletService.walletTransaction(walletTransaction,userResponse,codigoTypeWalletTransaction,user,ISFULLPAYMENT)
                .flatMap(response -> {
                    RegisterPaymenWithWalletResponseDTO responseDTO = (RegisterPaymenWithWalletResponseDTO) response;
                    log.info("Respuesta de la transacción con wallet: {}", responseDTO);
                    return saveVoucherWallet(responseDTO.getWalletTransaction())
                            .onErrorResume(e -> {
                                log.error("Error al procesar el pago con wallet", e);
                                return Mono.error(new RuntimeException("Error al procesar el pago con wallet"));
                            });
                });

    }

    public Mono<List<PaymentVoucher>> MakeMixedPayment(SponsordResponse userResponse, WalletTransaction walletTransaction, Integer codigoTypeWalletTransaction, ObjModel objModel, User user , List<PaymentVoucher> voucherList, TypeExchangeResponse typeExchangeResponse) {
        boolean ISFULLPAYMENT = false;
        //ProcessPaymentWithWallet
        if (walletTransaction.getAmount().compareTo(objModel.getPackageInfo().getPackageDetail().get(0).getPrice()) >= 0) {
            return Mono.error(
                    new RuntimeException("El monto no es suficiente para realizar el pago completo")
            );
        }

        return Mono.zip(
                savePaymentVouchers(voucherList, typeExchangeResponse),
                walletService.walletTransaction(walletTransaction,userResponse,codigoTypeWalletTransaction,user,ISFULLPAYMENT)
        ).flatMap(tuple -> {
            List<PaymentVoucher> vouchers = tuple.getT1();
            RegisterPaymenWithWalletResponseDTO responseDTO =  tuple.getT2();

            int numberCorrelativeVoucherWallet = vouchers.size() + 1 ;
            return saveVoucherWallet(responseDTO.getWalletTransaction())
                    .flatMap(voucherWallet -> {
                        voucherWallet.setOperationNumber(voucherWallet.getOperationNumber()+"-" + numberCorrelativeVoucherWallet);
                        vouchers.add(voucherWallet);
                        return Mono.just(vouchers);
                    } );


        });

    }

    //Payment por Paypal
    public String htmlVoucher(BigDecimal amountPaid, String operationNumber) {
        // Formatear la fecha y hora actual
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        String formattedDateTime = TimeLima.getLimaTime().format(formatter);

        // Construir el HTML con la fecha formateada
        String htmlBuilder = "<html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title></title></head><body style='color:black'>" +
                "<div style='width: 100%'>" +
                "<div style='display:flex;'>" +
                "</div>" +
                "<img width='500' height='50' src='https://s3.us-east-2.amazonaws.com/backoffice.documents/vouchers-de-pago/6f1bdbdc-d547-4b9f-976a-eeab52ca9034-paypal.png'>" +
                "<h1 style='margin-top: 2px ;text-align: center;font-weight: bold;font-style: italic;'>Voucher de Pago Paypal</h1>" +
                "<h2 style='text-align: center;'>Fecha de Pago :" + formattedDateTime + "  </h2>" +
                "<h2 style='text-align: center;'>Monto Pagado: $" + amountPaid + "  </h2>" +
                "<h2 style='text-align: center;'>Cod. de transacción :" + operationNumber + "  </h2>" +
                "<h2 style='text-align: center;'>¡Gracias por su pago!</h2>" +
                "<center><p style='margin-left: 10%;margin-right: 10%;'>Te saluda la familia Intech</p></center> " +
                "<center><div style='width: 100%'>" +
                "</a></div></center>" +
                "<center><div style='width: 100%'>" +
                "<p style='margin-left: 10%;margin-right: 10%; '></p>" +
                "<center>Recuerde que el pago también lo puede realizar mediante depósito en nuestra cuenta corriente a través de Agente BCP, Agencia BCP o transferencia bancaria desde Banca por Internet.</center>" +
                "</div></center>" +
                "<center><div style='width: 100%'>" +
                "<p style='margin-left: 10%;margin-right: 10%; '>----------------------------</p>" +
                "</div></center>" +
                "</div></center>" +
                "</body>" +
                "</html>";

        return htmlBuilder;
    }

    public String GenerateVoucherWallet(BigDecimal amountTotal, String codOperation) {

        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        String formattedDateTime = TimeLima.getLimaTime().format(formatter);

        return "<html><head <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'><title></title></head><body style='color:black'>" +
                "<div style='width: 100%'>" +
                "<div style='display:flex;'>" +
                "</div>" +
                "<img width='500' height='50' src='http://www.inresorts.club/Views/img/fondo.png'>" +

                "<h1 style='margin-top: 2px ;text-align: center;font-weight: bold;font-style: italic;'>Voucher de Pago Wallet</h1>" +
                "<h2 style='text-align: center;'>Fecha de Pago :" + formattedDateTime + "  </h2>" +
                "<h2 style='text-align: center;'>Monto Pagado: $" + amountTotal + "  </h2>" +
                "<h2 style='text-align: center;'>Cod. de transacci&oacute;n :" + codOperation + "  </h2>" +
                "<h2 style='text-align: center;'>¡Gracias por su pago!</h2>" +

                "<center><p style='margin-left: 10%;margin-right: 10%;'>Te saluda la familia Intech</p></center> " +
                "" +
                "<center><div style='width: 100%'>" +
                "</a></div></center>" +
                "<center><div style='width: 100%'>" +
                "<p style='margin-left: 10%;margin-right: 10%; '></p>" +

                "<center>Recuerde que el pago tambi&eacute;n lo puede realizar mediante deposito en nuestra cuenta corriente a trav&eacute;s de Agente BCP, Agencia BCP O transferencia bancaria desde Banca por Internet.</center>" +
                "</div></center>" +
                "<center><div style='width: 100%'>" +
                "<p style='margin-left: 10%;margin-right: 10%; '>----------------------------</p>" +
                "</div></center>" +
                "</div></center>" +
                "</body>" +
                "</html>";
    }

    public Mono<String> convertHtmlToImage(String htmlContent) {
        try {
            // Crear un JEditorPane y un HTMLEditorKit
            JEditorPane editorPane = new JEditorPane();
            editorPane.setContentType("text/html");
            editorPane.setText(htmlContent);
            editorPane.setSize(new Dimension(800, 600)); // Tamaño de la imagen

            HTMLEditorKit kit = new HTMLEditorKit();
            editorPane.setEditorKit(kit);
            kit.read(new StringReader(htmlContent), editorPane.getDocument(), 0);

            // Crear la imagen
            BufferedImage image = new BufferedImage(editorPane.getWidth(), editorPane.getHeight(), BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = image.createGraphics();
            editorPane.print(g2d);
            g2d.dispose();

            // Crear MultipartFile
            MultipartFile file = createMultipartFile(image, "voucherPaypalImage.png");

            // Subir la imagen a la API externa
            return externalAPIClient.postDataToExternalAPI(file, "1");

        } catch (Exception e) {
            e.printStackTrace();
            return Mono.error(e);
        }
    }

    private static MultipartFile createMultipartFile(BufferedImage image, String fileName) {
        try {
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            javax.imageio.ImageIO.write(image, "png", os);
            byte[] bytes = os.toByteArray();
            return new MockMultipartFile("voucherImage", fileName, "Voucher/png", bytes);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    //pago con Voucher
    public Mono<PaymentVoucher> SaveVoucherPaypal(BigDecimal amountPaid, String operationNumber, PaymentSubType paymentSubType) {
        String htmlContent = htmlVoucher(amountPaid, operationNumber);
        return convertHtmlToImage(htmlContent)
                .flatMap(url -> {
                    log.info("Imagen con éxito" + url);
            
                    Integer IDSUBMETODOPAGOPAYPAL = 9;
                    String NOTEPAGOPAYPAL = "Pago realizado por PayPal";

                    PaymentVoucher paymentVoucher = new PaymentVoucher();
                    paymentVoucher.setIdMethodPaymentSubType(IDSUBMETODOPAGOPAYPAL);
                    paymentVoucher.setNote(NOTEPAGOPAYPAL);
                    paymentVoucher.setOperationNumber(operationNumber);
                    paymentVoucher.setIdPaymentCoinCurrency(1);//v
                    paymentVoucher.setSubTotalAmount(amountPaid);
                    paymentVoucher.setPathPicture(url);
                    paymentVoucher.setCreationDate(TimeLima.getLimaTime());
                    paymentVoucher.setStatusSave(true);
                    return CalculateTotalAmountPaypal(amountPaid, paymentSubType)
                            .flatMap(calculateResponse -> {

                                paymentVoucher.setTotalAmount(calculateResponse.getSubTotal());
                                paymentVoucher.setCommissionPaymentSubType(calculateResponse.getComission());
                                return Mono.just(paymentVoucher);
                            });
                });

    }

    public Mono<List<PaymentVoucher>> savePaymentVouchers(List<PaymentVoucher> voucherList, TypeExchangeResponse typeExchangeResponse) {

        return Flux.fromIterable(voucherList)
                .flatMap(paymentVoucher -> {
                    String imageNameWithExtension = "voucher_imagen.png";
                    MultipartFile multipartFile;
                    try {
                        multipartFile = base64ToMultipart(paymentVoucher.getImagenBase64(), imageNameWithExtension);
                        log.info("Imagen antes comprimida con éxito: {}", multipartFile.getSize());
                        if (multipartFile.getSize() > 3 * 1024 * 1024) {
                            // Comprimir la imagen
                            BufferedImage image = ImageIO.read(multipartFile.getInputStream());
                            ByteArrayOutputStream os = new ByteArrayOutputStream();
                            Thumbnails.of(image).size(800, 600).outputQuality(0.5).outputFormat("png").toOutputStream(os);
                            byte[] compressedImageBytes = os.toByteArray();
                            log.info("Imagen comprimida");
                            multipartFile = new MockMultipartFile("file", imageNameWithExtension, "image/png", compressedImageBytes);
                            log.info("Imagen comprimida con éxito: {}", multipartFile.getSize());
                        }

                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                    try {
                        log.info("Subiendo imagen a la API externa");
                        return externalAPIClient.postDataToExternalAPI(multipartFile, "1")
                                .flatMap(url -> {
                                    if (url != null) {
                                        if (paymentVoucher.getIdPaymentCoinCurrency() == 2) {
                                            BigDecimal exchangeRate = typeExchangeResponse.getSale();
                                            BigDecimal amountPaidInDollars = paymentVoucher.getTotalAmount().divide(exchangeRate, RoundingMode.HALF_UP);
                                            paymentVoucher.setTotalAmount(amountPaidInDollars);
                                            log.info("amountPaidInDollars: " + amountPaidInDollars);
                                        }


                                        return adminPanelService.getPaymentSubType(paymentVoucher.getIdMethodPaymentSubType())
                                                .flatMap(subTipoPaymnet -> {
                                                    // Asegúrate de tener un setter para totalAmount en PaymentVoucher
                                                    PaymentSubType paymentSubType1 = subTipoPaymnet;
                                                    return calculateSubTotalPaid(paymentVoucher.getTotalAmount(), paymentSubType1,paymentVoucher.getIdPaymentCoinCurrency())
                                                            .flatMap(calculateResponse -> {
                                                                paymentVoucher.setSubTotalAmount(calculateResponse.getSubTotal());

                                                                paymentVoucher.setCommissionPaymentSubType(calculateResponse.getComission());
                                                                paymentVoucher.setPathPicture(url);
                                                                paymentVoucher.setCreationDate(TimeLima.getLimaTime());
                                                                paymentVoucher.setStatusSave(true);
                                                                paymentVoucher.setCompanyOperationNumber(paymentVoucher.getOperationNumber());
                                                                log.info("imagen con éxito");
                                                                return Mono.just(paymentVoucher);
                                                            });
                                                });
                                    } else {
                                        paymentVoucher.setStatusSave(false);
                                        throw new RuntimeException("Error al subir la imagen a la API externa");
                                    }

                                });

                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collectList();
    }


    private Mono<PaymentVoucher> saveVoucherWallet(WalletTransaction walletTransaction) {

        final Currency currencyOperationWallet = Currency.Dolar;
        final int IDSUBTIPOPAGOWALLET = 17;
        final String NOTEWALLET = "Pago realizado con wallet";
        log.info("total amount: " + walletTransaction.getAmount());
        BigDecimal montoPagoAbs = walletTransaction.getAmount().abs();

        String numeroOperacion = String.format("PWCOD-%s", walletTransaction.getIdWalletTransaction());
        return  adminPanelService.getPaymentSubType(IDSUBTIPOPAGOWALLET)
                .flatMap(subTipoPago -> {

                    return CalculateTotalAmountPayable(montoPagoAbs, subTipoPago)
                            .flatMap(totalAmount1 -> {

                                String htmlContent = GenerateVoucherWallet(montoPagoAbs, numeroOperacion);

                                return convertHtmlToImage(htmlContent)
                                        .flatMap(url -> {

                                            PaymentVoucher paymentVoucher = new PaymentVoucher();
                                            paymentVoucher.setIdMethodPaymentSubType(IDSUBTIPOPAGOWALLET);
                                            paymentVoucher.setNote(NOTEWALLET);
                                            paymentVoucher.setOperationNumber(numeroOperacion);
                                            paymentVoucher.setIdPaymentCoinCurrency(currencyOperationWallet.getValue());
                                            paymentVoucher.setSubTotalAmount(montoPagoAbs);
                                            paymentVoucher.setPathPicture(url);
                                            paymentVoucher.setCreationDate(TimeLima.getLimaTime());
                                            paymentVoucher.setStatusSave(true);
                                            paymentVoucher.setCompanyOperationNumber(numeroOperacion);
                                            paymentVoucher.setTotalAmount(totalAmount1.getSubTotal());
                                            paymentVoucher.setCommissionPaymentSubType(totalAmount1.getComission());

                                            return Mono.just(paymentVoucher);
                                        });
                            });
                })
                .doOnError(error -> walletService.errorPay(walletTransaction.getIdWalletTransaction().intValue()))
                .onErrorResume(error -> Mono.error(new BusinessLogicException("El Document API Murio")));
    }


    private static MultipartFile base64ToMultipart(String base64String, String filenameWithExtension) throws IOException {
        try {
            if (StringUtils.isEmpty(base64String)) {
                throw new IllegalArgumentException("The base64String parameter cannot be null or empty");
            }
            byte[] decodedBytes = Base64.getDecoder().decode(base64String);
            String[] parts = filenameWithExtension.split("\\.");
            String extension = parts[1];
            return new MockMultipartFile("file", filenameWithExtension, "image/" + extension, decodedBytes);
        } catch (Exception e) {
            throw new IOException(e);
        }
    }

    public Mono<CalculateResponse> CalculateTotalAmountPayable(BigDecimal totalAmount, PaymentSubType paymentSubType) {





        return calculateSubTotalPaid(totalAmount, paymentSubType);
    }

    private Mono<CalculateResponse> calculateSubTotalPaid(BigDecimal totalAmount, PaymentSubType paymentSubType, Integer idCurrency){

        BigDecimal commissionPlace = BigDecimal.ZERO;

        if (idCurrency == Currency.Dolar.getValue()) {

            commissionPlace = paymentSubType.getCommissionDollars();

        } else if (idCurrency == Currency.Sol.getValue()) {

            commissionPlace = paymentSubType.getCommissionSoles();
        }
        BigDecimal subTotal = totalAmount.subtract(commissionPlace);

        CalculateResponse response = new CalculateResponse(subTotal,commissionPlace);
        return Mono.just(response);

    }

    public Mono<CalculateResponse> calculateSubTotalPaid(BigDecimal totalAmount, PaymentSubType paymentSubType) {

        BigDecimal comisionPlaza = paymentSubType.getCommissionDollars();

        BigDecimal resta = totalAmount.add(comisionPlaza);
        BigDecimal posentaje = paymentSubType.getRatePercentage().divide(BigDecimal.valueOf(100));
        BigDecimal suma = BigDecimal.ONE.add(posentaje);
        BigDecimal total = resta.divide(suma, 2, RoundingMode.HALF_UP);
        BigDecimal comission = total.subtract(totalAmount);


        return Mono.just(new CalculateResponse(total, comission));
    }

    public Mono<CalculateResponse> CalculateTotalAmountPaypal(BigDecimal subTotal, PaymentSubType paymentSubType) {
        return calculateSubTotalPaidPaypal(subTotal, paymentSubType);
    }

    public Mono<CalculateResponse> calculateSubTotalPaidPaypal(BigDecimal subTotal, PaymentSubType subTipoPago) {
        Integer currency = 1; // 1 = Dólares
        return Mono.fromCallable(() -> {
            BigDecimal montoTotal = BigDecimal.ZERO;
            BigDecimal cargoTasa = BigDecimal.ZERO;
            BigDecimal comission = BigDecimal.ZERO;

            // Calculamos la tasa si es que la tiene
            // Solo en PayPal existe tasa y es solo en dólares
            if (subTipoPago.getRatePercentage().compareTo(BigDecimal.ZERO) > 0) {
                cargoTasa = (subTotal.multiply(subTipoPago.getRatePercentage())).divide(BigDecimal.valueOf(100));
                comission = comission.add(cargoTasa);
            }

            // Agregamos la comisión
            if (currency == 1) {
                montoTotal = cargoTasa.add(subTotal).add(subTipoPago.getCommissionDollars());
                comission = comission.add(subTipoPago.getCommissionDollars());
            } else if (currency == 2) {
                montoTotal = cargoTasa.add(subTotal).add(subTipoPago.getCommissionSoles());
                comission = comission.add(subTipoPago.getCommissionSoles());
            }

            return new CalculateResponse(montoTotal, comission);
        });

    }



    public Mono<Boolean> checkCorrectPaymentAmountPurchaseSubscription (PackageDetail packageDetail , BigDecimal amountPaid) {

        if (packageDetail.getPrice().compareTo(amountPaid) >= 0){
            return Mono.just(true);

        }
        return Mono.error(new RuntimeException("El monto pagado no es correcto"));

    }
}
