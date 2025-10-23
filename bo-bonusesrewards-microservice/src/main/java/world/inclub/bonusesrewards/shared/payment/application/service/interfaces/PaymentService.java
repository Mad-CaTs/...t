package world.inclub.bonusesrewards.shared.payment.application.service.interfaces;

import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.dto.MakePaymentCommand;
import world.inclub.bonusesrewards.shared.payment.api.dto.PaymentResponseDto;

import java.util.UUID;

public interface PaymentService {

    Mono<String> processPayment(MakePaymentCommand command);

    Mono<PaymentResponseDto> approvePayment(UUID paymentId);

    Mono<PaymentResponseDto> rejectPayment(UUID paymentId, Long reasonId, String detail);

    Mono<PaymentResponseDto> correctRejectedPayment(UUID paymentId, FilePart voucherFile,
                                                    String operationNumber, String note);
}

