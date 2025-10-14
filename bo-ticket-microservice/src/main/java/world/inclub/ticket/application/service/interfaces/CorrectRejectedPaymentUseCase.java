package world.inclub.ticket.application.service.interfaces;

import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;
import world.inclub.ticket.api.dto.PaymentResponseDto;

public interface CorrectRejectedPaymentUseCase {
    
    /**
     * Corrige un pago que está en estado TEMPORAL_REJECTED
     * @param paymentId ID del pago a corregir
     * @param voucherFile Nuevo archivo del comprobante
     * @return Pago corregido
     */
    Mono<PaymentResponseDto> correctRejectedPayment(Long paymentId, FilePart voucherFile);
}
