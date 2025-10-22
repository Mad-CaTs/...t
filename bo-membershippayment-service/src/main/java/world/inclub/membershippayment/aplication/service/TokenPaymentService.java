package world.inclub.membershippayment.aplication.service;

import org.springframework.stereotype.Service;

import java.security.MessageDigest;

import java.util.List;
import java.util.UUID;
import java.nio.charset.StandardCharsets;

import java.security.NoSuchAlgorithmException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.TokenPaymentDao;
import world.inclub.membershippayment.crosscutting.utils.TimeLima;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.TokenPayment;

@Service
@Slf4j
@RequiredArgsConstructor
public class TokenPaymentService {

    private final TokenPaymentDao tokenPaymentDao;

     public Mono<TokenPayment> generateTokenPayment(int idSuscription, long idPayment, int hoursDuration, List<Payment> schedule) {
        return Flux.fromIterable(schedule) // Convert List<Payment> to Flux<Payment>
                .filter(payment -> payment.getIdStatePayment() == 1)
                .count()
                .flatMap(numberPayQuotes -> {
                    boolean isFirstPaymentQuote = numberPayQuotes == 0;
                    return generatePaidTokenCode()
                            .flatMap(codToken -> {
                                if (codToken != null) {
                                    TokenPayment tokenPayment = new TokenPayment();
                                    tokenPayment.setIdSuscription(idSuscription);
                                    tokenPayment.setIdPayment((int) idPayment);
                                    tokenPayment.setStartDate(TimeLima.getLimaTime());
                                    tokenPayment.setEndDate(TimeLima.getLimaTime().plusHours(hoursDuration));
                                    tokenPayment.setCodTokenPayment(codToken);
                                    return tokenPaymentDao.postTokenPayment(tokenPayment)
                                            .flatMap(token -> {
                                                String cudTokenPay = GeneratePaymentLink(isFirstPaymentQuote, tokenPayment.getCodTokenPayment());
                                                tokenPayment.setCodTokenPayment(cudTokenPay);

                                                return Mono.just(tokenPayment);
                                            });
                                } else {
                                    log.error("Error: codToken is null");
                                    return Mono.error(new RuntimeException("Token generation failed"));
                                }
                            });
                });
    }

    public Mono<TokenPayment> generateTokenAdminPanel(int idSuscription, int idPaymentStar, Boolean isFirstPaymentQuote){

        return generatePaidTokenCode()
                .flatMap(codToken -> {
                    if (codToken != null) {
                        TokenPayment tokenPayment = new TokenPayment(codToken,idSuscription,idPaymentStar);
                        return tokenPaymentDao.postTokenPayment(tokenPayment)
                                .flatMap(token -> {
                                    String cudTokenPay = GeneratePaymentLink(isFirstPaymentQuote, tokenPayment.getCodTokenPayment());
                                    tokenPayment.setCodTokenPayment(cudTokenPay);

                                    return Mono.just(tokenPayment);
                                });
                    } else {
                        log.error("Error: codToken is null");
                        return Mono.error(new RuntimeException("Token generation failed"));
                    }
                });
    }

    public Mono<String> generatePaidTokenCode() {

        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            String originalString = UUID.randomUUID().toString();
            byte[] encodedhash = md.digest(originalString.getBytes(StandardCharsets.UTF_8));
            return Mono.just(bytesToHex(encodedhash));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating token code", e);
        }

    }

    private static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    private String GeneratePaymentLink(boolean isFirstPaymentQuote, String codToken) {
        String link = "http://www.inclub.world/backoffice/home/payments?token=";
        return link + codToken;
    }

}
