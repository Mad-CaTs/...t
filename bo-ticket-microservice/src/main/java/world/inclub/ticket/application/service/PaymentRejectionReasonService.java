package world.inclub.ticket.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import world.inclub.ticket.api.dto.PaymentRejectionReasonResponseDto;
import world.inclub.ticket.api.mapper.PaymentRejectionReasonMapper;
import world.inclub.ticket.application.service.interfaces.GetAllPaymentRejectionReasonsUseCase;
import world.inclub.ticket.domain.ports.payment.PaymentRejectionReasonRepositoryPort;

@Service
@RequiredArgsConstructor
public class PaymentRejectionReasonService implements GetAllPaymentRejectionReasonsUseCase {

    private final PaymentRejectionReasonRepositoryPort paymentRejectionReasonRepositoryPort;
    private final PaymentRejectionReasonMapper paymentRejectionReasonMapper;

    @Override
    public Flux<PaymentRejectionReasonResponseDto> getAllPaymentRejectionReasons() {
        return paymentRejectionReasonRepositoryPort.findAll()
                .map(paymentRejectionReasonMapper::toResponseDto);
    }

}
