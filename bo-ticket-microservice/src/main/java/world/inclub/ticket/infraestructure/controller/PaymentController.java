package world.inclub.ticket.infraestructure.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import reactor.core.publisher.Mono;
import world.inclub.ticket.application.service.interfaces.PaymentService;
import world.inclub.ticket.application.service.interfaces.GetAllPaymentRejectionReasonsUseCase;
import world.inclub.ticket.application.service.interfaces.CanModifyRejectedPaymentUseCase;
import world.inclub.ticket.application.service.interfaces.CorrectRejectedPaymentUseCase;
import world.inclub.ticket.application.service.interfaces.GetPendingPaymentsUseCase;
import world.inclub.ticket.infraestructure.config.handler.ResponseHandler;
import world.inclub.ticket.infraestructure.controller.dto.MakePaymentRequest;
import world.inclub.ticket.infraestructure.controller.dto.RejectPaymentRequest;
import world.inclub.ticket.infraestructure.controller.dto.ValidatePaymentsFilterRequest;
import world.inclub.ticket.infraestructure.controller.mapper.PaymentRequestMapper;
import world.inclub.ticket.infraestructure.controller.dto.CorrectPaymentRequest;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/ticket/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRequestMapper paymentRequestMapper;
    private final GetAllPaymentRejectionReasonsUseCase getAllPaymentRejectionReasonsUseCase;
    private final CanModifyRejectedPaymentUseCase canModifyRejectedPaymentUseCase;
    private final CorrectRejectedPaymentUseCase correctRejectedPaymentUseCase;
    private final GetPendingPaymentsUseCase getPendingPaymentsUseCase;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<Object>> makePaymentMultipart(@Valid @ModelAttribute MakePaymentRequest request) {
        var command = paymentRequestMapper.toCommand(request);
        return ResponseHandler.generateResponse(HttpStatus.CREATED, paymentService.processPayment(command), true);
    }

    @PutMapping("/{paymentId}/approve")
    public Mono<ResponseEntity<Object>> approvePayment(@PathVariable Long paymentId) {
        return ResponseHandler.generateResponse(HttpStatus.OK, paymentService.approvePayment(paymentId), true);
    }

    @PutMapping("/{paymentId}/reject")
    public Mono<ResponseEntity<Object>> rejectPayment(@PathVariable Long paymentId, @Valid @RequestBody RejectPaymentRequest request) {
        return ResponseHandler.generateResponse(HttpStatus.OK, paymentService.rejectPayment(paymentId, request.getReasonId(), request.getDetail()), true);
    }

    @GetMapping("/payment-rejection-reasons")
    public Mono<ResponseEntity<Object>> getAllPaymentRejectionReasons() {
        return ResponseHandler.generateResponse(HttpStatus.OK, getAllPaymentRejectionReasonsUseCase.getAllPaymentRejectionReasons(), true);
    }

    @GetMapping("/{paymentId}/validate")
    public Mono<ResponseEntity<Object>> canModifyRejectedPayment(@PathVariable Long paymentId) {
        return ResponseHandler.generateResponse(HttpStatus.OK, canModifyRejectedPaymentUseCase.canModifyRejectedPayment(paymentId), true);
    }

    @PutMapping(value = "/{paymentId}/correct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<Object>> correctRejectedPayment(
            @PathVariable Long paymentId,
            @Valid @ModelAttribute CorrectPaymentRequest request) {
        return ResponseHandler.generateResponse(
                HttpStatus.OK, 
                correctRejectedPaymentUseCase.correctRejectedPayment(
                        paymentId, 
                        request.getVoucherFile()
                ), 
                true
        );
    }

    @GetMapping("/validate")
    public Mono<ResponseEntity<Object>> getPendingPayments(@ModelAttribute ValidatePaymentsFilterRequest filterRequest) {
        return ResponseHandler.generateResponse(HttpStatus.OK, getPendingPaymentsUseCase.getPendingPayments(filterRequest), true);
    }

}
