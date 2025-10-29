package world.inclub.bonusesrewards.shared.payment.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import world.inclub.bonusesrewards.shared.payment.api.dto.PaymentRejectionReasonResponseDto;
import world.inclub.bonusesrewards.shared.payment.api.mapper.PaymentRejectionReasonMapper;
import world.inclub.bonusesrewards.shared.payment.application.usecase.GetAllPaymentRejectionReasonsUseCase;
import world.inclub.bonusesrewards.shared.payment.domain.port.PaymentRejectionReasonRepositoryPort;

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
