package world.inclub.membershippayment.infraestructure.listeners;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import world.inclub.membershippayment.aplication.dao.PaymentVoucherDao;
import world.inclub.membershippayment.domain.dto.PaymentVoucherDTO;
import world.inclub.membershippayment.infraestructure.config.kafka.constants.KafkaConstants;

@Service
public class KafkaConsumerPaymentVoucherService {

    @Autowired
    private PaymentVoucherDao paymentVoucherDao;

    @KafkaListener(topics = "topic-paymentvoucher", groupId = KafkaConstants.GROUP_ID, containerFactory = "paymentVoucherKafkaListenerContainerFactory")
    public void consume(PaymentVoucherDTO paymentVoucherDto) {
        paymentVoucherDao.getPaymentVoucherById ((long) paymentVoucherDto.getIdPaymentVoucher())
                .flatMap(existingPaymentVoucher -> {
                    // Si el comprobante de pago ya existe en la base de datos, actualiza los datos

                    existingPaymentVoucher.setIdPaymentVoucher((long) paymentVoucherDto.getIdPaymentVoucher());
                    existingPaymentVoucher.setIdPayment(paymentVoucherDto.getPaymentId());
                    existingPaymentVoucher.setIdSuscription(paymentVoucherDto.getSuscriptionId());
                    existingPaymentVoucher.setPathPicture(paymentVoucherDto.getPathPicture());
                    existingPaymentVoucher.setOperationNumber(paymentVoucherDto.getOperationNumber());
                    existingPaymentVoucher.setIdMethodPaymentSubType(paymentVoucherDto.getMethodPaymentSubTypeId());
                    existingPaymentVoucher.setNote(paymentVoucherDto.getNote());
                    existingPaymentVoucher.setIdPaymentCoinCurrency(paymentVoucherDto.getPaymentCoinCurrencyId());
                    existingPaymentVoucher.setSubTotalAmount(paymentVoucherDto.getSubTotalAmount());
                    existingPaymentVoucher.setCommissionPaymentSubType(paymentVoucherDto.getComissionPaymentSubType());
                    existingPaymentVoucher.setTotalAmount(paymentVoucherDto.getTotalAmount());
                    existingPaymentVoucher.setCreationDate(paymentVoucherDto.getCreationDate());
                    existingPaymentVoucher.setCompanyOperationNumber(paymentVoucherDto.getCompanyOperationNumber());
                    return paymentVoucherDao.putPaymentVoucher(existingPaymentVoucher);
                })
                .subscribe(null, error -> {
                    // Maneja la excepción aquí
                    System.err.println("Error: " + error.getMessage());
                });
    }
}