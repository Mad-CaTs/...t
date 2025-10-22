package world.inclub.membershippayment.payPayment.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.crosscutting.utils.handler.ResponseHandler;
import world.inclub.membershippayment.domain.dto.request.CMeansPayment;
import world.inclub.membershippayment.infraestructure.apisExternas.commission.dtos.MembershipTreeCommissionEventRequest;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;
import world.inclub.membershippayment.payPayment.aplication.service.AutoPaymentSuscriptionService;
import world.inclub.membershippayment.payPayment.aplication.service.LegalizationService;
import world.inclub.membershippayment.payPayment.aplication.service.PayPaymentService;
import world.inclub.membershippayment.payPayment.aplication.service.SuscriptionPaymentService;
import world.inclub.membershippayment.aplication.dao.PaymentDao;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/pay")
public class PayPaymentController {

        private final PayPaymentService payPaymentService;
        private final SuscriptionPaymentService suscriptionPaymentService;
        private final KafkaTemplate<String, Object> kafkaTemplate;
        private final AutoPaymentSuscriptionService paymentSuscriptionService;
        private final LegalizationService legalizationService;
        private final PaymentDao paymentDao;

        @PostMapping
        public Mono<ResponseEntity<Object>> portSuscription(@RequestBody CMeansPayment cMeansPayment) {
                return ResponseHandler.generateMonoResponse(
                                HttpStatus.CREATED,
                                payPaymentService.PayPaymentSuscription(cMeansPayment)
                                                .map(Object.class::cast),
                                true);
        }

        @GetMapping("suscription/{id}")
        public Mono<ResponseEntity<Object>> getSuscriptionsByIdUser(@PathVariable Integer id) {
                return ResponseHandler.generateMonoResponse(
                                HttpStatus.CREATED,
                                suscriptionPaymentService.getSuscriptions(id)
                                                .map(Object.class::cast),
                                true);
        }

        @GetMapping("suscription-asc/{id}")
        public Mono<ResponseEntity<Object>> getSuscriptionsByIdUserAsc(@PathVariable Integer id) {
                return ResponseHandler.generateMonoResponse(
                                HttpStatus.CREATED,
                                suscriptionPaymentService.getSuscriptionsAsc(id)
                                                .map(Object.class::cast),
                                true);
        }

        @GetMapping("suscription/detail/{id}")
        public Mono<ResponseEntity<Object>> getSuscriptionById(@PathVariable Integer id) {
                return ResponseHandler.generateMonoResponse(
                                HttpStatus.OK,
                                suscriptionPaymentService.getSuscriptionDataById(id)
                                                .map(Object.class::cast),
                                true);
        }

        @GetMapping("suscription-detail/{id}")
        public Mono<ResponseEntity<Object>> getSuscriptionsDetailById(@PathVariable Integer id) {
                return ResponseHandler.generateMonoResponse(
                                HttpStatus.CREATED,
                                suscriptionPaymentService.getSuscriptionDetail(id)
                                                .map(Object.class::cast),
                                true);
        }

        @GetMapping("cronograma/{id}")
        public Mono<ResponseEntity<Object>> getCronogramaByIdUser(@PathVariable Integer id) {
                return ResponseHandler.generateMonoResponse(
                                HttpStatus.CREATED,
                                suscriptionPaymentService.getCronogramaPagos(id)
                                                .map(Object.class::cast),
                                true);
        }

        @GetMapping("/validate/token/{token}")
        public Mono<ResponseEntity<Object>> validateToken(@PathVariable String token) {
                return ResponseHandler.generateMonoResponse(
                                HttpStatus.OK,
                                suscriptionPaymentService.validateTokenPayLater(token)
                                                .map(Object.class::cast),
                                true);
        }

        @GetMapping("/test")
        Mono<String> getTestApi() {
                return Mono.just("Test API pay payment");
        }

        @GetMapping("/payment/{paymentId}")
        public Mono<ResponseEntity<Object>> getScheduleById(@PathVariable Integer paymentId) {
                return ResponseHandler.generateMonoResponse(
                                HttpStatus.OK,
                                suscriptionPaymentService.getPaymentById(paymentId)
                                                .map(Object.class::cast),
                                true);
        }

        @GetMapping("/test/commission")
        Mono<ResponseEntity<Object>> testCommission(MembershipTreeCommissionEventRequest request) {

                String key = "testCommission";
                kafkaTemplate.send(KafkaConstants.Topic.REQUEST_MEMBERSHIP_TO_TREE, key, request);

                return ResponseHandler.generateMonoResponse(HttpStatus.OK, Mono.just(true)
                                .map(Object.class::cast),
                                true);
        }

        @DeleteMapping("/delete/paymentById")
        public Mono<ResponseEntity<Object>> deletePaymentsAndVouchers(@RequestBody List<Long> paymentIds) {
                log.info("Recibiendo solicitud para eliminar Payments y PaymentVouchers para los IDs: {}", paymentIds);

                return payPaymentService.deletePaymentsAndVouchers(paymentIds)
                                .then(Mono.just(ResponseEntity.ok().build()))// completan las eliminaciones
                                .doOnError(error -> log.error("Error al eliminar Payments y PaymentVouchers: {}",
                                                error.getMessage()))
                                .onErrorResume(error -> Mono.just(ResponseEntity
                                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                                .body("Error durante la eliminación: " + error.getMessage())));
        }

        @DeleteMapping("/delete/idPaymentVoucher")
        public Mono<ResponseEntity<Object>> delete(@RequestBody List<Long> idPaymentVouchers) {
                return payPaymentService.deletePaymentVoucherByIdPaymentVoucher(idPaymentVouchers)
                                .then(Mono.just(ResponseEntity.ok().build()))
                                .doOnError(error -> log.error("Error al eliminar los PaymentVouchers: {}",
                                                error.getMessage()))
                                .onErrorResume(error -> Mono.just(ResponseEntity
                                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                                .body("Error durante la eliminación: " + error.getMessage())));
        }

        @PostMapping("/cronograma-correction/{id}")
        public Mono<ResponseEntity<Object>> cronogramaCorrection(@PathVariable Integer id) {
                return ResponseHandler.generateMonoResponse(HttpStatus.OK,
                                suscriptionPaymentService.scheduleCorrection(id).map(Object.class::cast), true);
        }

        @GetMapping("/check/initialQuote/{suscriptionId}")
        public Mono<ResponseEntity<Object>> checkInitialQuote(@PathVariable Integer suscriptionId) {
                return ResponseHandler.generateMonoResponse(HttpStatus.OK, suscriptionPaymentService
                                .checkSuscriptionInitialQuotePayed(suscriptionId).map(Object.class::cast), true);
        }

        @GetMapping("/check/payedQuotes/{suscriptionId}")
        public Mono<ResponseEntity<Object>> checkPayedQuotes(@PathVariable Integer suscriptionId) {
                return ResponseHandler.generateMonoResponse(HttpStatus.OK,
                                suscriptionPaymentService.hasFirst12QuotePayed(suscriptionId).map(Object.class::cast),
                                true);
        }

        @GetMapping("/payments/due-today")
        public Flux<Object> getPaymentsDueToday() {
                return suscriptionPaymentService.findPaymentsDueToday()
                                .cast(Object.class)
                                .onErrorResume(error -> {
                                        log.error("Error al obtener pagos del día: ", error);
                                        return Flux.error(new ResponseStatusException(
                                                HttpStatus.INTERNAL_SERVER_ERROR,
                                                "Error al procesar la solicitud"));
                                });
        }

        @GetMapping("/autopayment")
        public Mono<List<Boolean>> payAllSuscriptions(@RequestParam Map<String, String> params) {
                String finit = params.get("finit");
                String ffinal = params.get("ffinal");
                return paymentSuscriptionService.getAllSuscriptionsPayment(finit, ffinal);
        }

        @GetMapping("/legalization/{idUser}")
        public Mono<ResponseEntity<Object>> checkLegalizationStatus(@PathVariable Integer idUser) {
                return ResponseHandler.generateMonoResponse(
                                HttpStatus.CREATED,
                                legalizationService.checkLegalizationEligibility(idUser)
                                                .map(Object.class::cast),
                                true);
        }

        // 🚀 NUEVO: Obtener último pago por lista de suscripciones
        @PostMapping("/last-payment")
        public Mono<ResponseEntity<Object>> getLastPaymentBySubscriptions(@RequestBody List<Integer> subscriptionIds) {
                return ResponseHandler.generateMonoResponse(
                                HttpStatus.OK,
                                paymentDao.getLastPaymentBySubscriptions(subscriptionIds)
                                                .map(Object.class::cast),
                                true);
        }

        // 🚀 NUEVO: Obtener próximo pago por lista de suscripciones
        @PostMapping("/next-payment")
        public Mono<ResponseEntity<Object>> getNextPaymentBySubscriptions(@RequestBody List<Integer> subscriptionIds) {
                return ResponseHandler.generateMonoResponse(
                                HttpStatus.OK,
                                paymentDao.getNextPaymentBySubscriptions(subscriptionIds)
                                                .map(Object.class::cast),
                                true);
        }

}
