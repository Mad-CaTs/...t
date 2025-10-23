package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.service.interfaces.PaymentService;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.CorrectPaymentRequest;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.MakePaymentRequest;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.RejectPaymentRequest;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.mapper.PaymentRequestMapper;
import world.inclub.bonusesrewards.shared.payment.infrastructure.config.handler.ResponseHandler;

import java.util.UUID;

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

    @PutMapping("/{paymentId}/approve")
    public Mono<ResponseEntity<Object>> approvePayment(@PathVariable UUID paymentId) {
        return ResponseHandler.generateResponse(HttpStatus.OK, paymentService.approvePayment(paymentId), true);
    }

    @PutMapping("/{paymentId}/reject")
    public Mono<ResponseEntity<Object>> rejectPayment(@PathVariable UUID paymentId, @Valid @RequestBody RejectPaymentRequest request) {
        return ResponseHandler.generateResponse(HttpStatus.OK, paymentService.rejectPayment(paymentId, request.getReasonId(), request.getDetail()), true);
    }

    @PutMapping(value = "/{paymentId}/correct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<Object>> correctRejectedPayment(
            @PathVariable UUID paymentId,
            @Valid @ModelAttribute CorrectPaymentRequest request) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                paymentService.correctRejectedPayment(
                        paymentId,
                        request.getVoucherFile(),
                        request.getOperationNumber(),
                        request.getNote()
                ),
                true
        );
    }
}
