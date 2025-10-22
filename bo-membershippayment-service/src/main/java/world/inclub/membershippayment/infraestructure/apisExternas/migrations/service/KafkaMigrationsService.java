package world.inclub.membershippayment.infraestructure.apisExternas.migrations.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import world.inclub.membershippayment.aplication.dao.PaymentDao;
import world.inclub.membershippayment.aplication.dao.PaymentVoucherDao;
import world.inclub.membershippayment.aplication.dao.SuscriptionDao;
import world.inclub.membershippayment.aplication.service.mapper.MembershipToAdminPanelMapper;
import world.inclub.membershippayment.crosscutting.utils.KafkaRequestService;
import world.inclub.membershippayment.domain.dto.PaymentDTO;
import world.inclub.membershippayment.domain.dto.PaymentVoucherDTO;
import world.inclub.membershippayment.domain.dto.SuscriptionDTO;
import world.inclub.membershippayment.domain.dto.request.PaymentRequest;
import world.inclub.membershippayment.domain.entity.Payment;
import world.inclub.membershippayment.domain.entity.PaymentVoucher;
import world.inclub.membershippayment.domain.entity.Suscription;
import world.inclub.membershippayment.domain.enums.State;
import world.inclub.membershippayment.infraestructure.apisExternas.adminpanel.AdminPanelService;
import world.inclub.membershippayment.infraestructure.apisExternas.migrations.dtos.RemoveOldPaymentScheduleRequestDto;
import world.inclub.membershippayment.infraestructure.apisExternas.migrations.dtos.UpdateScheduleStatusRequestDto;
import world.inclub.membershippayment.infraestructure.apisExternas.migrations.dtos.UpdateScheduleStatusResponseDto;
import world.inclub.membershippayment.infraestructure.apisExternas.tree.dto.Membership;
import world.inclub.membershippayment.infraestructure.apisExternas.tree.service.TreeService;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;
import world.inclub.membershippayment.infraestructure.config.kafka.dtos.response.RegisterPaymenWithWalletResponseDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaMigrationsService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final SuscriptionDao suscriptionDao;
    private final PaymentDao paymentDao;
    private final PaymentVoucherDao paymentVoucherDao;
    private final KafkaRequestService kafkaRequestService;
    private final AdminPanelService adminPanelService;
    private final TreeService treeService;

    @KafkaListener(topics = KafkaConstants.Topic.REQUEST_MIGRATION_SUSCRIPTION, groupId = KafkaConstants.GROUP_ID,containerFactory = KafkaConstants.ContainerFactory.SUSCRIPTION_KAFKA_LISTENER_CONTAINER_FACTORY)
    public void responseMigrationSuscription(Suscription request,
                                             @Header(KafkaHeaders.CORRELATION_ID) String correlationId,
                                             @Header(KafkaHeaders.REPLY_TOPIC) String reaply,
                                             @Header(KafkaHeaders.RECEIVED_KEY) String key) {

        log.info("Cosume sus migra: {}", request);

        suscriptionDao.postSuscription(request)
                .flatMap(response -> {

                    Message<Suscription> message = MessageBuilder
                            .withPayload(response)
                            .setHeader(KafkaHeaders.TOPIC,reaply )
                            .setHeader(KafkaHeaders.KEY,key)
                            .setHeader(KafkaHeaders.CORRELATION_ID, correlationId)
                            .build();

                    return Mono.fromRunnable(() -> kafkaTemplate.send(message))
                            .thenReturn(response);
                })
                //Tenemos que pasar esto a la Parte de Persistencia
                .flatMap(response2 -> {

                    SuscriptionDTO responseKafka = MembershipToAdminPanelMapper.mapToSuscriptionDTO(response2);
                    return Mono.fromRunnable(() -> kafkaTemplate.send(KafkaConstants.Topic.TOPIC_SUSCRIPTION,responseKafka))
                            .thenReturn(response2);

                })
                .subscribe(
                        response -> log.info("Suscription sent: {}", response),
                        error -> log.error("Error: {}", error.getMessage())
                );
    }



//    @KafkaListener(topics = KafkaConstants.Topic.REQUEST_MIGRATION_PAYMENT,groupId = KafkaConstants.GROUP_ID,containerFactory = KafkaConstants.ContainerFactory.PAYMENT_KAFKA_LISTENER_CONTAINER_FACTORY)
//    public void responseMigrationPayment(List<Payment> request,
//                                         @Header(KafkaHeaders.CORRELATION_ID) String correlationId,
//                                         @Header(KafkaHeaders.REPLY_TOPIC) String reaply,
//                                         @Header(KafkaHeaders.RECEIVED_KEY) String key) {
//
//        log.info("Cosume payments migra");
//
//        Integer idSuscription = request.get(0).getIdSuscription();
//        Long idSuscriptionLong = Long.valueOf(idSuscription);
//
//        Mono.zip(
//                paymentDao.updateScheduleStatusTemporal(idSuscription),
//                updateScheduleStatusTemporalAdminPanel(idSuscription)
//        )
//                .flatMap(tuple -> {
//                    Boolean request1 = tuple.getT1();
//                    Boolean request2 = tuple.getT2();
//                    // Solo arrojar error si al menos uno es false
//                    if (!request1 || !request2) {
//                        return Mono.error(new RuntimeException("ERROR DURANTE EL PROCESO DE MIGRACION"));
//                    }
//                    // Continúa con el flujo normal si ambos son true
//                    return Mono.just("Proceso completado con éxito");
//                })
//                .thenMany(paymentDao.postPaymentsForMigration(request))
//                .flatMap(response ->{
//
//                    Message<List<Payment>> message = MessageBuilder
//                            .withPayload(response)
//                            .setHeader(KafkaHeaders.TOPIC,reaply )
//                            .setHeader(KafkaHeaders.KEY,key)
//                            .setHeader(KafkaHeaders.CORRELATION_ID, correlationId)
//                            .build();
//                    return Mono.fromRunnable(() -> kafkaTemplate.send(message))
//                            .thenReturn(response);
//                })
//                //Tenemos que pasar esto a la Parte de Persistencia
//                .flatMap(response2 -> {
//
//                    return suscriptionDao.getSuscriptionById(idSuscriptionLong)
//                            .flatMap(suscription -> {
//                                return  adminPanelService.getPackageData(suscription.getIdPackage(),suscription.getIdPackageDetail())
//                                        .flatMap(packageDTO -> {
//                                            boolean isBuy = true;
//                                            return treeService.synchronizeMembershipDataForRegister(suscription,response2,packageDTO,isBuy)
//                                                    .flatMap(values -> {
//                                                        // Convertir la lista en un Flux para procesar cada elemento en paralelo
//                                                        return Flux.fromIterable(response2)
//                                                                .parallel() // Ejecutar las operaciones en paralelo
//                                                                .runOn(Schedulers.parallel()) // Usar el scheduler para operaciones paralelas
//                                                                .flatMap(paymentKafka -> {
//                                                                    // Mapeamos cada objeto `voucher` a `PaymentDTO`
//                                                                    PaymentDTO responseKafka = MembershipToAdminPanelMapper.mapToPaymentDTO(paymentKafka);
//
//                                                                    // Enviamos el objeto mapeado a Kafka y retornamos el voucher procesado
//                                                                    return Mono.fromRunnable(() -> kafkaTemplate.send(KafkaConstants.Topic.TOPIC_PAYMENT, responseKafka))
//                                                                            .then(Mono.just(paymentKafka)); // Retornar el voucher después de enviar el mensaje
//                                                                })
//                                                                .sequential() // Volver a secuencial cuando todos los procesos paralelos terminen
//                                                                .collectList(); // Convertimos el Flux nuevamente
//                                                    });
//                                        });
//                            });
//                })
//
//                .subscribe(
//                        response -> log.info("Payments sent "),
//                        error -> log.error("Error: {}", error.getMessage())
//                );
//
//    }

    @KafkaListener(topics = KafkaConstants.Topic.REQUEST_MIGRATION_PAYMENT,groupId = KafkaConstants.GROUP_ID,containerFactory = KafkaConstants.ContainerFactory.PAYMENT_KAFKA_LISTENER_CONTAINER_FACTORY)
    public void responseMigrationPayment(List<Payment> request,
                                         @Header(KafkaHeaders.CORRELATION_ID) String correlationId,
                                         @Header(KafkaHeaders.REPLY_TOPIC) String reaply,
                                         @Header(KafkaHeaders.RECEIVED_KEY) String key) {

        //FUNKA CTMR

        paymentDao.postPaymentsForMigration(request)
                .flatMap(response ->{
                    Message<List<Payment>> message = MessageBuilder
                            .withPayload(response)
                            .setHeader(KafkaHeaders.TOPIC,reaply )
                            .setHeader(KafkaHeaders.KEY,key)
                            .setHeader(KafkaHeaders.CORRELATION_ID, correlationId)
                            .build();
                    return Mono.fromRunnable(() -> kafkaTemplate.send(message))
                            .thenReturn(response);
                }) .subscribe(
                       response -> log.info("Payments sent "),
                        error -> log.error("Error: {}", error.getMessage())
                );


    }


    @KafkaListener(topics = KafkaConstants.Topic.REQUEST_MIGRATION_PAYMENTVOUCHER, groupId = KafkaConstants.GROUP_ID,containerFactory = "paymentVouchersMembershipKafkaListenerContainerFactory")
    public void responseMigrationPaymentVoucher(List<PaymentVoucher> request,
                                                @Header(KafkaHeaders.CORRELATION_ID) String correlationId,
                                                @Header(KafkaHeaders.REPLY_TOPIC) String reaply,
                                                @Header(KafkaHeaders.RECEIVED_KEY) String key) {
        log.info("Cosume vouchers migra");

        Flux.fromIterable(request)
                .flatMap(paymentVoucherDao::postPaymentVoucher)
                .collectList() // Junta todos los PaymentVouchers guardados en una lista
                .flatMap(response -> {

                    Message<List<PaymentVoucher>> message = MessageBuilder
                            .withPayload(response)
                            .setHeader(KafkaHeaders.TOPIC,reaply )
                            .setHeader(KafkaHeaders.KEY,key)
                            .setHeader(KafkaHeaders.CORRELATION_ID, correlationId)
                            .build();

                    return Mono.fromRunnable(() -> kafkaTemplate.send(message))
                            .thenReturn(response);
                })
                //Tenemos que pasar esto a la Parte de Persistencia
                .flatMap(response2 ->{

                    return Flux.fromIterable(response2)
                            .parallel()
                            .runOn(Schedulers.parallel())
                            .flatMap(voucherKafka ->{
                                PaymentVoucherDTO responseKafka = MembershipToAdminPanelMapper.mapPaymentVoucherDTO(voucherKafka);

                                // Enviamos el objeto mapeado a Kafka y retornamos el voucher procesado
                                return Mono.fromRunnable(() -> kafkaTemplate.send(KafkaConstants.Topic.TOPIC_PAYMENTVOUCHER, responseKafka))
                                        .then(Mono.just(responseKafka));

                            })
                            .sequential()
                            .collectList();

                })
                .flatMap(response -> {
                    // Aquí se puede realizar el otro proceso adicional, por ejemplo, llamar a otro servicio
                    log.info("Realizando la eliminacion del Cronograma anterior");
                    Long idPayment = request.get(0).getIdPayment().longValue();

                    return paymentDao.getPaymentById(idPayment)
                            .flatMap(payment -> {
                                return paymentDao.deleteScheduleByIdSuscription(payment.getIdSuscription())
                                        .flatMap(bool -> {
                                            if (bool) {

                                                RemoveOldPaymentScheduleRequestDto requestDto = new RemoveOldPaymentScheduleRequestDto();
                                                requestDto.setIdStateDelete(666);
                                                requestDto.setIdSuscription(payment.getIdSuscription());

                                                // Enviamos el objeto mapeado a Kafka y retornamos el voucher procesado
                                                return Mono.fromRunnable(() -> kafkaTemplate.send(KafkaConstants.Topic.TOPIC_SCHEDULE_DELETE, requestDto))
                                                        .then(Mono.just(requestDto));

                                            }
                                            else{
                                                log.info("Error al eliminar la eliminacion del Cronograma, no se mandara la solicitud de eliminacion de los datos a Admin Panel");
                                                return Mono.empty();
                                            }
                                        });

                                    });


                })
                .subscribe(
                        response -> log.info("PaymentVouchers sent and additional process completed"),
                        error -> log.error("Error: {}", error.getMessage())
                );
    }

    private Mono<Boolean> updateScheduleStatusTemporalAdminPanel(Integer idSuscription){

        Integer idStatus = State.DELETE_TEMPORAL.getValue();
        UpdateScheduleStatusRequestDto requestDto = new UpdateScheduleStatusRequestDto(idSuscription,idStatus);

        //REQUEST_SCHEDULE_UPDATE
        return kafkaRequestService.sendRequest(requestDto, KafkaConstants.Topic.REQUEST_SCHEDULE_UPDATE,KafkaConstants.Topic.RESPONSE_SCHEDULE_UPDATE)
                .flatMap(response -> {
                    if (response instanceof UpdateScheduleStatusResponseDto) {
                        return Mono.just((UpdateScheduleStatusResponseDto) response)
                                .flatMap(updateValue -> {
                                    if(updateValue.getResult() == Boolean.TRUE){
                                        return Mono.just(true);
                                    }else{
                                        return Mono.just(false);
                                    }
                                });
                    } else {
                        return Mono.error(new IllegalStateException("Unexpected response type"));
                    }
                });
    }

    @KafkaListener(topics = KafkaConstants.Topic.RESPONSE_SCHEDULE_UPDATE, groupId = KafkaConstants.GROUP_ID,containerFactory = KafkaConstants.ContainerFactory.UPDATE_SCHEDULE_KAFKA_LISTENER_CONTAINER_FACTORY)
    private void receiveReplyUpdate(UpdateScheduleStatusResponseDto reply,@Header(KafkaHeaders.CORRELATION_ID) String correlationId, @Header(KafkaHeaders.RECEIVED_KEY) String key) {
        log.info("Cosume update Admin Panel");
        kafkaRequestService.completeRequest(correlationId, reply);
    }


}

