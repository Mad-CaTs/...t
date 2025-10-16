package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.PaymentService;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.request.MakePaymentRequest;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.mapper.PaymentRequestMapper;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/car-bonus/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRequestMapper paymentRequestMapper;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<Object>> makePaymentMultipart(@Valid @ModelAttribute MakePaymentRequest request) {
        var command = paymentRequestMapper.toCommand(request);
        return ResponseHandler.generateResponse(HttpStatus.CREATED, paymentService.processPayment(command), true);
    }
}
