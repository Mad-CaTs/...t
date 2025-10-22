package world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import world.inclub.membershippayment.aplication.dao.PaymentVoucherDao;
import world.inclub.membershippayment.aplication.service.TokenPaymentService;
import world.inclub.membershippayment.aplication.service.mapper.MembershipToAdminPanelMapper;
import world.inclub.membershippayment.domain.dto.PaymentVoucherReceiveDTO;
import world.inclub.membershippayment.domain.dto.SuscriptionDTO;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.domain.entity.TokenPayment;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.dtos.TokenPaymentRequest;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaAdminPanelService {

        private final TokenPaymentService tokenPaymentService;
        private final KafkaTemplate<String, Object> kafkaTemplate;
        private final PaymentVoucherDao paymentVoucherDao;

        @KafkaListener(topics = KafkaConstants.Topic.DELETE_PAYMENT_VOUCHER, groupId = KafkaConstants.GROUP_ID, containerFactory = KafkaConstants.ContainerFactory.INTEGER_KAFKA_LISTENER_CONTAINER_FACTORY)
        private void synchroneDeleteVouchersByIdPayment(Integer idPayment) {

                paymentVoucherDao.deletePaymentVoucherByIdPayment(idPayment)
                                .subscribe(
                                                response -> log.info("Payments sent "),
                                                error -> log.error("Error: {}", error.getMessage()));
        }

        @KafkaListener(topics = KafkaConstants.Topic.DELETE_PAYMENT_VOUCHER_BY_ID, groupId = KafkaConstants.GROUP_ID, containerFactory = KafkaConstants.ContainerFactory.INTEGER_KAFKA_LISTENER_CONTAINER_FACTORY)
        private void synchroneDeleteVoucherById(Integer idPaymentVoucher) {
                paymentVoucherDao.deletePaymentVoucherByIdPaymentVoucher(idPaymentVoucher)
                                .subscribe(
                                                unused -> log.info("PaymentVoucher {} eliminado.", idPaymentVoucher),
                                                error -> log.error("Error eliminando PaymentVoucher {}: {}",
                                                                idPaymentVoucher, error.getMessage()));
        }

        @KafkaListener(topics = KafkaConstants.Topic.REQUEST_TOKEN_PAYMENT, groupId = KafkaConstants.GROUP_ID, containerFactory = KafkaConstants.ContainerFactory.TOKEN_REQUEST_KAFKA_LISTENER_CONTAINER_FACTORY)
        private void responseGenerateToken(TokenPaymentRequest request,
                        @Header(KafkaHeaders.CORRELATION_ID) String correlationId,
                        @Header(KafkaHeaders.REPLY_TOPIC) String reaply,
                        @Header(KafkaHeaders.RECEIVED_KEY) String key) {

                tokenPaymentService
                                .generateTokenAdminPanel(request.getIdSuscription(), request.getIdPaymentStar(),
                                                request.getIsFirstPaymentQuote())
                                .flatMap(tokenPayment -> {

                                        Message<TokenPayment> message = MessageBuilder
                                                        .withPayload(tokenPayment)
                                                        .setHeader(KafkaHeaders.TOPIC, reaply)
                                                        .setHeader(KafkaHeaders.KEY, key)
                                                        .setHeader(KafkaHeaders.CORRELATION_ID, correlationId)
                                                        .build();
                                        return Mono.fromRunnable(() -> kafkaTemplate.send(message))
                                                        .thenReturn(tokenPayment);

                                })
                                .subscribe(
                                                response -> log.info("Payments sent "),
                                                error -> log.error("Error: {}", error.getMessage()));

        }

        public Mono<Boolean> synchronizeSuscriptionData(Suscription suscription) {
                SuscriptionDTO result = MembershipToAdminPanelMapper.mapToSuscriptionDTO(suscription);

                return Mono.fromRunnable(() -> kafkaTemplate.send(KafkaConstants.Topic.TOPIC_SUSCRIPTION, result))
                                .thenReturn(true); // Retorna true después de intentar enviar el mensaje
        }

        public Mono<Boolean> synchronizePaymentVoucherData(List<PaymentVoucher> paymentVouchers) {

                return Flux.fromIterable(paymentVouchers)
                                .map(MembershipToAdminPanelMapper::mapPaymentVoucherDTO) // Mapea cada PaymentVoucher a
                                                                                         // PaymentVoucherDTO
                                .flatMap(paymentVoucherDTO -> Mono.fromRunnable(() -> kafkaTemplate
                                                .send(KafkaConstants.Topic.TOPIC_PAYMENTVOUCHER, paymentVoucherDTO))

                                ) // Envía cada PaymentVoucherDTO a Kafka y espera la confirmación de envío
                                .then(Mono.just(true)); // Retorna true después de que todos los mensajes hayan sido
                                                        // enviados
        }

        public Mono<Boolean> synchronizePaymentData(List<Payment> payments) {

                return Flux.fromIterable(payments)
                                .map(MembershipToAdminPanelMapper::mapToPaymentDTO) // Mapea cada Payment a PaymentDTO
                                .flatMap(paymentDTO -> Mono.fromRunnable(() -> kafkaTemplate
                                                .send(KafkaConstants.Topic.TOPIC_PAYMENT, paymentDTO))) // Envía cada
                                                                                                        // PaymentDTO a
                                                                                                        // Kafka
                                .then(Mono.just(true)); // Retorna true después de que todos los mensajes hayan sido
                                                        // enviados
        }

        @KafkaListener(topics = KafkaConstants.Topic.TOPIC_PAYMENTVOUCHER, groupId = "membership-group-70", containerFactory = "paymentVoucherKafkaListenerContainerFactoryB")
        public void handlePaymentVoucherSync(PaymentVoucherReceiveDTO dto) {
                log.info("Recibiendo voucher DTO para sincronización: {}", dto.getIdPaymentVoucher());

                paymentVoucherDao.getPaymentVoucherById(dto.getIdPaymentVoucher().longValue())
                                .switchIfEmpty(Mono.defer(() -> {
                                        PaymentVoucher newVoucher = new PaymentVoucher();
                                        newVoucher.setIdPaymentVoucher(dto.getIdPaymentVoucher().longValue());
                                        newVoucher.setIdPayment(dto.getPaymentId());
                                        newVoucher.setIdSuscription(dto.getSuscriptionId());
                                        newVoucher.setPathPicture(dto.getPathPicture());
                                        newVoucher.setOperationNumber(dto.getOperationNumber());
                                        newVoucher.setIdMethodPaymentSubType(dto.getMethodPaymentSubTypeId());
                                        newVoucher.setNote(dto.getNote());
                                        newVoucher.setIdPaymentCoinCurrency(dto.getPaymentCoinCurrencyId());
                                        newVoucher.setSubTotalAmount(dto.getSubTotalAmount());
                                        newVoucher.setCommissionPaymentSubType(dto.getComissionPaymentSubType());
                                        newVoucher.setTotalAmount(dto.getTotalAmount());
                                        newVoucher.setCreationDate(dto.getCreationDate());
                                        newVoucher.setCompanyOperationNumber(dto.getCompanyOperationNumber());
                                        log.info("CREANDO NUEVO VOUCHER: {}", newVoucher.getIdPaymentVoucher());
                                        return paymentVoucherDao.postPaymentVoucher(newVoucher)
                                                        .doOnSuccess(saved -> log.info("Voucher creado: {}",
                                                                        saved.getIdPaymentVoucher()));
                                }))
                                .flatMap(existingVoucher -> {
                                        existingVoucher.setIdPayment(dto.getPaymentId());
                                        existingVoucher.setIdSuscription(dto.getSuscriptionId());
                                        existingVoucher.setPathPicture(dto.getPathPicture());
                                        existingVoucher.setOperationNumber(dto.getOperationNumber());
                                        existingVoucher.setIdMethodPaymentSubType(dto.getMethodPaymentSubTypeId());
                                        existingVoucher.setNote(dto.getNote());
                                        existingVoucher.setIdPaymentCoinCurrency(dto.getPaymentCoinCurrencyId());
                                        existingVoucher.setSubTotalAmount(dto.getSubTotalAmount());
                                        existingVoucher.setCommissionPaymentSubType(dto.getComissionPaymentSubType());
                                        existingVoucher.setTotalAmount(dto.getTotalAmount());
                                        existingVoucher.setCreationDate(dto.getCreationDate());
                                        existingVoucher.setCompanyOperationNumber(dto.getCompanyOperationNumber());

                                        log.info("ACTUALIZANDO VOUCHER: {}", existingVoucher.getIdPaymentVoucher());
                                        return paymentVoucherDao.putPaymentVoucher(existingVoucher)
                                                        .doOnSuccess(updated -> log.info("Voucher actualizado: {}",
                                                                        updated.getIdPaymentVoucher()));
                                })
                                .subscribe(null, error -> {
                                        log.error("Error en el flujo de sincronización: {}", error.getMessage());
                                });
        }

}
