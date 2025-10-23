package world.inclub.bonusesrewards.shared.payment.infrastructure.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import world.inclub.bonusesrewards.shared.payment.application.dto.PaymentListView;
import world.inclub.bonusesrewards.shared.payment.application.usecase.GetPagedPendingPaymentsUseCase;
import world.inclub.bonusesrewards.shared.payment.application.usecase.ListAllPendingPaymentsUseCase;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.PaymentSearchRequest;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.dto.excel.PaymentPendingExcelResponse;
import world.inclub.bonusesrewards.shared.payment.infrastructure.controllers.mapper.PaymentPendingExcelResponseMapper;
import world.inclub.bonusesrewards.shared.response.ApiResponse;
import world.inclub.bonusesrewards.shared.response.ResponseHandler;
import world.inclub.bonusesrewards.shared.utils.datetime.DateTimeFormatter;
import world.inclub.bonusesrewards.shared.utils.pagination.application.PagedData;
import world.inclub.bonusesrewards.shared.utils.pagination.domain.Pageable;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.dto.PaginationRequest;
import world.inclub.bonusesrewards.shared.utils.pagination.infrastructure.utils.PageableUtils;
import world.inclub.bonusesrewards.shared.utils.reports.domain.ReportExporter;

import java.time.Instant;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/car-bonus/payments/details")
public class PaymentDetailController {

    private final GetPagedPendingPaymentsUseCase getPagedPendingPaymentsUseCase;
    private final ListAllPendingPaymentsUseCase listAllPendingPaymentsUseCase;
    private final ReportExporter<PaymentPendingExcelResponse> reportExporter;
    private final PaymentPendingExcelResponseMapper paymentPendingExcelResponseMapper;

    @GetMapping
    public Mono<ResponseEntity<ApiResponse<PagedData<PaymentListView>>>> getAllPendingPayments(
            @Valid @ModelAttribute PaginationRequest pagination,
            @Valid @ModelAttribute PaymentSearchRequest request
    ) {
        Pageable pageable = PageableUtils.createPageable(pagination, "payment_date");

        return ResponseHandler.generateResponse(
                HttpStatus.OK,
                getPagedPendingPaymentsUseCase.getPendingPayments(
                        request.member(),
                        request.bonusType(),
                        getPaymentDateOrNull(request.paymentDate()),
                        pageable
                ),
                true
        );
    }

    @GetMapping("/export")
    public Mono<ResponseEntity<byte[]>> exportAll(
            @Valid @ModelAttribute PaymentSearchRequest request
    ) {
        return listAllPendingPaymentsUseCase
                .getAllPendingPayments(
                        request.member(),
                        request.bonusType(),
                        getPaymentDateOrNull(request.paymentDate())
                )
                .map(paymentPendingExcelResponseMapper::toExcelResponse)
                .collectList()
                .map(responses -> reportExporter
                        .export(responses, "reporte_pagos_pendientes_revision"))
                .map(bytes -> ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=reporte_pagos_pendientes_revision.xlsx")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .body(bytes));
    }

    private Instant getPaymentDateOrNull(LocalDate paymentDate) {
        return paymentDate != null ? DateTimeFormatter.toEndOfDayInstant(paymentDate) : null;
    }
}
