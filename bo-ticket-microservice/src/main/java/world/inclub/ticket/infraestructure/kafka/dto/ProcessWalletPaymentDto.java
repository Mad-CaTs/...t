package world.inclub.ticket.infraestructure.kafka.dto;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ProcessWalletPaymentDto(
        Integer senderUserId,
        Integer receiverUserId,
        BigDecimal amount,
        int sendCodeId,
        int receiveCodeId,
        String referenceDataSender,
        String referenceDataReceiver
) {}